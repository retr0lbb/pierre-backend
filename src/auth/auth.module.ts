import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Module({
    controllers: [],
    imports: [PrismaService]
})
export class AuthModule {}
