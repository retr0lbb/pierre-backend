import { Global, Module } from '@nestjs/common';
import { CookieService } from './services/cookie.service';
import { EncryptService } from './services/encrypt.service';

@Global()
@Module({
    providers: [CookieService, EncryptService],
    exports: [CookieService, EncryptService]
})
export class CommonModule {}
