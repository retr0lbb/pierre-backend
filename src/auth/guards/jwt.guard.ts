import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { ROLE_KEYS } from "../roles.decorator"
import { Request } from "express";
import { CookieService } from "../../common/services/cookie.service";
import { TokenService } from "../../common/services/token.service";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt"){
    constructor(
        private readonly reflector: Reflector, 
        private readonly cookieService: CookieService, 
        private readonly tokenService: TokenService
    ){
        super()
    }

    async canActivate(context: ExecutionContext){
        const canActivate = await super.canActivate(context)

        if(!canActivate){
            return false
        }

        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLE_KEYS,
            [context.getHandler(), context.getClass()]
        )

        if(!requiredRoles){
            return true
        }

        const request: Request = context.switchToHttp().getRequest()

        const token = this.cookieService.getTokenFromCookie(request, "access")

        if(!token){
            throw new UnauthorizedException("no token provided")
        }

        const payload = this.tokenService.verify(token)

        console.log("GUARDS")
        console.log(payload)

        const userRole = payload.role

        const hasRole = requiredRoles.includes(userRole)

        if(!hasRole){
            throw new UnauthorizedException("Insufficient permissions")
        }

        return true
    }
}