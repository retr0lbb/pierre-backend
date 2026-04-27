import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { EncryptService } from '../encrypt/encrypt.service.js';

@Module({
    controllers: [AuthController],
    providers: [PrismaService, AuthService, EncryptService]
})
export class AuthModule {}
