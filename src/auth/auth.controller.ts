import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards, UsePipes } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { type RegisterUserPayload, registerUserPayloadSchema } from "./dto/register.dto";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { type LoginUserDTO, loginUserSchema } from "./dto/login.dto";
import type { Request, Response } from "express";
import { CookieService } from "../common/services/cookie.service";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";
import { ConfigService } from "@nestjs/config";

@Controller("auth")
export class AuthController{
    constructor(
        private authService: AuthService, 
        private readonly cookieService: CookieService,
        private readonly configService: ConfigService
    ){}
    
    @HttpCode(201)
    @Post("/register")
    async createUser(@Body(new ZodValidationPipe(registerUserPayloadSchema)) body: RegisterUserPayload){
        await this.authService.createUser(body)

        return {message: "user created with sucess"}
    }

    @Post("/login")
    async loginUser(@Body(new ZodValidationPipe(loginUserSchema)) body: LoginUserDTO, @Res({passthrough: true}) res: Response ){
        const { accessToken, refreshToken } = await this.authService.logUser(body)
        this.cookieService.clearCookies(res)

        this.cookieService.setAccessCookie(res, accessToken)
        this.cookieService.setRefreshCookie(res, refreshToken)
        
        return { message: "successful login, token will be located on cookies" }
    }

    @Post("/refresh")
    @UseGuards(JwtRefreshGuard)
    async refreshToken(@Req() req: Request, @Res({passthrough: true}) res: Response){
        const cookieName = this.configService.getOrThrow<string>("REFRESH_COOKIE_NAME")
        const refreshToken = req.cookies[cookieName]
        const tokens = await this.authService.refresh(refreshToken)

        this.cookieService.clearCookies(res)

        this.cookieService.setAccessCookie(res, tokens.accessToken)
        this.cookieService.setRefreshCookie(res, tokens.refreshToken)

        return tokens
    }
    
}