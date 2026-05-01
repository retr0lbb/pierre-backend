import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";


type TokenPayload = {
    sub: string,
    username: string,
    type: "access" | "refresh"
}

@Injectable()
export class TokenService{
    constructor(
        private readonly jwtService: JwtService, 
        private readonly configService: ConfigService
    ){}

    generateAccessToken(userId: string, username: string){

        const accessTokenPayload: TokenPayload = {
            sub: userId,
            username: username,
            type: "access"
        }

        return this.jwtService.sign(accessTokenPayload, {
            expiresIn: this.configService.get("JWT_ACCESS_EXPIRES", "15m")
        })

    }

    generateRefreshToken(userId: string, username: string){
        const refreshTokenPayload: TokenPayload = {
            sub: userId,
            username: username,
            type: "refresh"
        }

        return this.jwtService.sign(refreshTokenPayload, {
            expiresIn: this.configService.get("JWT_REFRESH_EXPIRES", "7d")
        })

    }

    generateTokens(userId: string, username: string) {
        return {
            accessToken: this.generateAccessToken(userId, username),
            refreshToken: this.generateRefreshToken(userId, username),
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