import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

console.log('CWD:', process.cwd());
console.log('ENV (JWT_SECRET):', process.env.JWT_SECRET);
