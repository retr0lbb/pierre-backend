import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy){

    constructor(private readonly configService: ConfigService, private readonly authService: AuthService){

        super({
            clientID: configService.getOrThrow("GOOGLE_CLIENT_ID"),
            clientSecret: configService.getOrThrow("GOOGLE_CLIENT_SECRET"),
            callbackURL: configService.getOrThrow("GOOGLE_CALLBACK_URL"),
            scope: ["email", "profile"]
        })
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {

        const user = await this.authService.validateGoogleUser({displayName: profile.displayName, email: profile.emails[0].value})

        done(null, user)
    }
    
}