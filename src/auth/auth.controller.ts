import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { type RegisterUserPayload, registerUserPayloadSchema } from "./dto/register.dto";
import { ZodValidationPipe } from "../shared/pipes/zod-validation.pipe";

@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService){}
    
    @HttpCode(201)
    @Post("/register")
    @UsePipes(new ZodValidationPipe(registerUserPayloadSchema))
    async createUser(@Body() body: RegisterUserPayload){
        await this.authService.createUser(body)

        return {message: "user created with sucess"}
    }
    
}