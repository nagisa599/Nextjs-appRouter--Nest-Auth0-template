import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
    }),
  );

  app.enableCors({
    origin: '*', // ここにCORSポリシーを設定
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  });

  await app.listen(3001);
}
bootstrap();
