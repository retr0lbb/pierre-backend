import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { type RegisterUserPayload, registerUserPayloadSchema } from "./dto/register.dto";
import { ZodValidationPipe } from "../shared/pipes/zod-validation.pipe";
import { type LoginUserDTO, loginUserSchema } from "./dto/login.dto";

@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService){}
    
    @HttpCode(201)
    @Post("/register")
    async createUser(@Body(new ZodValidationPipe(registerUserPayloadSchema)) body: RegisterUserPayload){
        await this.authService.createUser(body)

        return {message: "user created with sucess"}
    }

    @Post("/login")
    async loginUser(@Body(new ZodValidationPipe(loginUserSchema)) body: LoginUserDTO ){
        const result = await this.authService.logUser(body)

        return result
    }
    
}