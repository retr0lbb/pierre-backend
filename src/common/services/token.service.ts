import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { StringFieldUpdateOperationsInput } from "../../generated/prisma/models";


type TokenPayload = {
    sub: string,
    username: string,
    role: "ADMIN" | "USER"
    type: "access" | "refresh"
}

@Injectable()
export class TokenService{
    constructor(
        private readonly jwtService: JwtService, 
        private readonly configService: ConfigService
    ){}

    generateAccessToken(userId: string, username: string, role: "ADMIN" | "USER"){

        const accessTokenPayload: TokenPayload = {
            sub: userId,
            username: username,
            type: "access",
            role
        }

        return this.jwtService.sign(accessTokenPayload, {
            expiresIn: this.configService.get("JWT_ACCESS_EXPIRES", "15m")
        })

    }

    generateRefreshToken(userId: string, username: string, role: "ADMIN" | "USER"){
        const refreshTokenPayload: TokenPayload = {
            sub: userId,
            username: username,
            type: "refresh",
            role
        }

        return this.jwtService.sign(refreshTokenPayload, {
            expiresIn: this.configService.get("JWT_REFRESH_EXPIRES", "7d")
        })

    }

    generateTokens(userId: string, username: string, role: "ADMIN" | "USER") {
        return {
            accessToken: this.generateAccessToken(userId, username, role),
            refreshToken: this.generateRefreshToken(userId, username, role),
        };
    }

    verify(token: string){
        try {
            return this.jwtService.verify<TokenPayload>(token)
        } catch (error) {
            throw new UnauthorizedException("Invalid or expired Token")
        }
    }

}