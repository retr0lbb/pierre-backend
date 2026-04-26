import { Injectable } from "@nestjs/common";
import { RegisterUserPayload } from "./dto/register.dto.js";
import { PrismaService } from "../prisma.service.js";
import { EncryptService } from "../encrypt/encrypt.service.js";

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
                username: payload.password
            }
        })

        return user
    }
}