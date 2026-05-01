import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh"){
    constructor(private config: ConfigService){
        const refreshCookieName = config.getOrThrow("REFRESH_COOKIE_NAME")

        super({
            secretOrKey: config.getOrThrow("JWT_SECRET"),
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    if(req?.cookies && req.cookies[refreshCookieName]){
                        return req.cookies[refreshCookieName]
                    } 
                    return null
                }
            ]),
            ignoreExpiration: false
        })
    }

    validate(payload: any): unknown {
        if(payload.type !== "refresh"){
            throw new Error("Invalid cookie type")
        }
        
        return {userId: payload.sub}
    }
}