import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Request, Response } from "express";



@Injectable()
export class CookieService{
    constructor (private readonly configService: ConfigService){}

    setAccessCookie(res: Response, token: string){
        const cookieName = this.configService.getOrThrow<string>("ACCESS_COOKIE_NAME")
        console.log(cookieName)

        res.cookie(cookieName, token, {
            httpOnly: true,
            maxAge: 900_000, // five minutes
            secure: false,
            signed: false
        })
    }

    setRefreshCookie(res: Response, token: string){
        const cookieName = this.configService.getOrThrow<string>("REFRESH_COOKIE_NAME")

        res.cookie(cookieName, token, {
            httpOnly: true,
            maxAge: 604_800_000, // a week
            secure: false,
            signed: false
        })
    }

    clearCookies(res: Response){
        const accessCookieName = this.configService.getOrThrow("ACCESS_COOKIE_NAME")
        const refreshCookieName = this.configService.getOrThrow("REFRESH_COOKIE_NAME")

        res.clearCookie(accessCookieName)
        res.clearCookie(refreshCookieName)
    }

    getTokenFromCookie(req: Request, cookie: "access" | "refresh"){
        const cookieName = cookie === "access" 
            ? this.configService.getOrThrow<string>("ACCESS_COOKIE_NAME")
            : this.configService.getOrThrow<string>("REFRESH_COOKIE_NAME")

        if(req.cookies && req.cookies[cookieName]){
            return req.cookies[cookieName]
        }
        
        return null
    }

}