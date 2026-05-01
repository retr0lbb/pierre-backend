import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Response } from "express";



@Injectable()
export class CookieService{
    constructor (private readonly configService: ConfigService){}

    setAuthCookie(res: Response, token: string){
        const cookieName = this.configService.getOrThrow<string>("COOKIE_NAME")
        console.log(cookieName)

        res.cookie(cookieName, token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60,
            secure: false,
            signed: false
        })
    }

    clearCookies(res: Response){
        const cookieName = this.configService.getOrThrow("COOKIE_NAME")

        res.clearCookie(cookieName)
    }
}