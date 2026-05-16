import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards, UsePipes } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { type RegisterUserPayload, registerUserPayloadSchema } from "./dto/register.dto";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { type LoginUserDTO, loginUserSchema } from "./dto/login.dto";
import type { Request, Response } from "express";
import { CookieService } from "../common/services/cookie.service";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";
import { ConfigService } from "@nestjs/config";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { GoogleAuthGuard } from "./guards/google.guard";
import { TokenService } from "../common/services/token.service";
import { CurrentUser } from "./decorators/current-user";
import { type GoogleUserPayload } from "../types/auth.types";

@Controller("auth")
export class AuthController{
    constructor(
        private readonly authService: AuthService, 
        private readonly cookieService: CookieService,
        private readonly configService: ConfigService,
        private readonly tokenService: TokenService
    ){}
    
    @HttpCode(201)
    @Post("/register")
    async createUser(@Body(new ZodValidationPipe(registerUserPayloadSchema)) body: RegisterUserPayload){
        await this.authService.createUser(body)

        if(body.loginProvider !== "LOCAL"){
            throw new BadRequestException("Not correct route to login with google, please try the /google/login route")
        }

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

        return {message: "token refreshed"}
    }

    @Post("/logout")
    @UseGuards(JwtRefreshGuard)
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ){
        const cookieName = this.configService.getOrThrow("REFRESH_COOKIE_NAME");
        const refreshToken = req.cookies[cookieName];

        await this.authService.logout(refreshToken);

        this.cookieService.clearCookies(res);

        return { message: "Logged out successfully" };
    }


    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    async googleAuth() { }

    @Get("google/callback")
    @UseGuards(GoogleAuthGuard)
    async googleAuthCallback(@CurrentUser() user: GoogleUserPayload, @Res({passthrough: true}) res: Response){

        if(!user){
            throw new Error("Error while login with google")
        }

        const tokens = this.tokenService.generateTokens(user.id, user.username, user.role)

        this.cookieService.setAccessCookie(res, tokens.accessToken)
        this.cookieService.setRefreshCookie(res, tokens.refreshToken)

        return { message: 'Login realizado com sucesso', userId: user.id }
    }
    
}