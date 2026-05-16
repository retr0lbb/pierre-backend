import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { EncryptService } from '../common/services/encrypt.service.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/Jwt-strategy.js';
import { JwtRefreshStrategy } from './strategies/jwt-refresh-strategy.js';
import { GoogleStrategy } from './strategies/googe.strategy.js';

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.getOrThrow("JWT_SECRET"),
                signOptions: {expiresIn: "15m"},
            })
        })
    ],
    controllers: [AuthController],
    providers: [PrismaService, AuthService, EncryptService, JwtStrategy, JwtRefreshStrategy, GoogleStrategy],
    exports: [JwtStrategy, JwtModule]
})
export class AuthModule {}
