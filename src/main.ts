import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import Pac from 'nestjs-zod';
import { ZodValidationPipe } from './common/pipes/zod-validation.pipe.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle("Pierre API")
    .setDescription('E-commerce')
    .setVersion("1.0")
    .addCookieAuth("pierre_access")
    .build();

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup("/docs", app, document)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
