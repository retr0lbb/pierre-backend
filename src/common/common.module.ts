import { Global, Module } from '@nestjs/common';
import { CookieService } from './services/cookie.service';
import { EncryptService } from './services/encrypt.service';
import { TokenService } from './services/token.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Global()
@Module({
    providers: [CookieService, EncryptService, TokenService],
    exports: [CookieService, EncryptService, TokenService]
})
export class CommonModule {}
