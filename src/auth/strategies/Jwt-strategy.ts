import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt"
import type { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly config: ConfigService){

        const cookieName = config.getOrThrow<string>("ACCESS_COOKIE_NAME")
        super({
            secretOrKey: config.getOrThrow("JWT_SECRET"),
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    if (req?.cookies && req.cookies[cookieName]) {
                        console.log(req.cookies[cookieName])
                        return req.cookies[cookieName];
                    }
                    console.log("Cookie not found")
                    console.log("ITSHERE: ",req.cookies)
                    return null;
                },
                ExtractJwt.fromAuthHeaderAsBearerToken()
            ]),
            ignoreExpiration: false
        })
    }

    validate(payload: any): unknown {
        return {userId: payload.sub, username: payload.username}
    }

}