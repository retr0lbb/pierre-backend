import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import type { RegisterUserPayload } from "./dto/register.dto";

@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService){}
    
    @HttpCode(201)
    @Post("/register")
    async createUser(@Body() body: RegisterUserPayload){
        await this.authService.createUser(body)

        return {message: "user created with sucess"}
    }
    
}