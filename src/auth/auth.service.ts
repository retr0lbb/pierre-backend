import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { RegisterUserPayload } from "./dto/register.dto";
import { PrismaService } from "../prisma.service";
import { EncryptService } from "../encrypt/encrypt.service";
import { LoginUserDTO } from "./dto/login.dto";

@Injectable()
export class AuthService{
    constructor(private prismaService: PrismaService, private encrypt: EncryptService){}

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
        const foundUser = await this.prismaService.user.findUnique({
            where: {
                email: payload.email
            }
        })

        if(!foundUser){
            throw new NotFoundException("User not found or Password not match")
        }

        const isValid = await this.encrypt.compare(payload.password, foundUser.passwordHash)

        if(!isValid){
            throw new NotFoundException("User not found or Password not match")
        }
    }
}