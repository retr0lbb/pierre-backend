import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { RegisterUserPayload } from "./dto/register.dto";
import { PrismaService } from "../prisma.service";
import { EncryptService } from "../common/services/encrypt.service";
import { LoginUserDTO } from "./dto/login.dto";
import { TokenService } from "../common/services/token.service";

@Injectable()
export class AuthService{
    constructor(
        private prismaService: PrismaService, 
        private encrypt: EncryptService,
        private readonly tokenService: TokenService
    ){}

    async createUser(payload: RegisterUserPayload){
        const foundUser = await this.prismaService.user.findUnique({
            where: {
                email: payload.email
            }
        })

        if(foundUser){
            throw new Error("an user with this email already exists")
        }

        const passwordHash = await this.encrypt.hash(payload.password)

        const user = await this.prismaService.user.create({
            data: {
                email: payload.email,
                passwordHash: passwordHash,
                username: payload.username
            }
        })

        return user
    }

    async logUser(payload: LoginUserDTO){
        const user = await this.prismaService.user.findUnique({
            where: {
                email: payload.email
            }
        })

        if(!user){
            throw new NotFoundException("User not found or Password not match")
        }

        const isValid = await this.encrypt.compare(payload.password, user.passwordHash)

        if(!isValid){
            throw new NotFoundException("User not found or Password not match")
        }

        const tokens = this.tokenService.generateTokens(user.id, user.username, user.role)

        await this.prismaService.sessions.create({
            data: {
                token: await this.encrypt.hash(tokens.refreshToken),
                expiresAt: new Date(Date.now() + 1000 * 60 * 60),
                userId: user.id
            }
        })

        return tokens
    }

    async refresh(token: string){
        const tokenPayload = this.tokenService.verify(token)

        if (tokenPayload.type !== "refresh") {
            throw new UnauthorizedException("Invalid token type")
        }

        const user = await this.prismaService.user.findUnique({
            where: {
                id: tokenPayload.sub
            }
        })

        if(!user){
            throw new NotFoundException("user not found")
        }

        const sessions = await this.prismaService.sessions.findMany({
            where: {
                isValid: true,
                userId: user.id
            }
        })

        const validSession = await Promise.any(
            sessions.map(async (session) => {
                const match = await this.encrypt.compare(token, session.token)

                if(match) return session;
                throw new Error()
            })
        ).catch(() => null)


        if(!validSession){
            throw new UnauthorizedException("Invalid session")
        }


        if(validSession.expiresAt < new Date()){
            await this.prismaService.sessions.update({
                where: { id: validSession.id },
                data: { isValid: false }
            })

            throw new UnauthorizedException("session expired")
        }
        
        const tokens = this.tokenService.generateTokens(user.username, user.id, user.role)

        await this.prismaService.sessions.update({
            where: {
                id: validSession.id
            },
            data: {
                isValid: false
            }
        })

        await this.prismaService.sessions.create({
            data: {
                token: await this.encrypt.hash(tokens.refreshToken),
                expiresAt: new Date(Date.now() + 1000 * 60 * 60),
                userId: user.id
            }
        })

        return tokens
    }

    async logout(token: string){
        const payload = this.tokenService.verify(token)

        if(payload.type !== "refresh"){
            throw new UnauthorizedException("Invalid token type")
        }

        const sessions = await this.prismaService.sessions.findMany({
            where: {
                userId: payload.sub,
                isValid: true,
            },
        });

        for (const session of sessions) {
            const match = await this.encrypt.compare(token, session.token);

            if (match) {
                await this.prismaService.sessions.update({
                where: { id: session.id },
                data: { isValid: false },
            });
                return;
            }
        }

        return
    }

    async findOrCreateGoogleUser(payload: {
        googleId: string
            email: string,
            firstName: string,
            lastName: string,
    }){

        throw new Error("not implemented yet")
    }
}