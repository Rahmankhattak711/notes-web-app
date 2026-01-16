import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   app.use(cookieParser());

   app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: [
            "'self'",
            'data:',
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          scriptSrc: ["'self'", 'https:', "'unsafe-inline'"],
          manifestSrc: [
            "'self'",
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          frameSrc: ["'self'", 'sandbox.embed.apollographql.com'],
        },
      },
    }),
  );

   app.enableCors({
    origin: [
      'http://localhost:5173',
    ],
    credentials: true, 
  });

  // ✅ Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT || 8000);
}
bootstrap();
