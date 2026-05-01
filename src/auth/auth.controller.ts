import { Body, Controller, HttpCode, HttpStatus, Post, Res, UsePipes } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { type RegisterUserPayload, registerUserPayloadSchema } from "./dto/register.dto";
import { ZodValidationPipe } from "../shared/pipes/zod-validation.pipe";
import { type LoginUserDTO, loginUserSchema } from "./dto/login.dto";
import type { Response } from "express";
import { CookieService } from "../common/services/cookie.service";

@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService, private readonly cookieService: CookieService){}
    
    @HttpCode(201)
    @Post("/register")
    async createUser(@Body(new ZodValidationPipe(registerUserPayloadSchema)) body: RegisterUserPayload){
        await this.authService.createUser(body)

        return {message: "user created with sucess"}
    }

    @Post("/login")
    async loginUser(@Body(new ZodValidationPipe(loginUserSchema)) body: LoginUserDTO, @Res({passthrough: true}) res: Response ){
        const { accessToken } = await this.authService.logUser(body)
        this.cookieService.clearCookies(res)

        this.cookieService.setAuthCookie(res, accessToken)
        
        return { message: "successful login, token will be located on cookies" }
    }
    
}