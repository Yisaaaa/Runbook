import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { pullAllRuntimeImages } from './common/docker/pull-images';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const errs = errors.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        }));

        return new BadRequestException({
          message: 'Validation error',
          errors: errs,
        });
      },
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
  });

  try {
    console.log('Pulling runtime images...');
    await pullAllRuntimeImages();
  } catch (error) {
    console.error('Error pulling images on startup: ', error);
  }

  const port = process.env.PORT || 3000;

  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}

bootstrap();

console.log('CWD:', process.cwd());
console.log('ENV (JWT_SECRET):', process.env.JWT_SECRET);
console.log(process.env.CORS_ORIGIN);
