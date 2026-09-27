import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './modules/common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }))

  app.setGlobalPrefix("api");

  /**
   * Swagger configurations
   */
  const config = new DocumentBuilder()
    .setTitle("nestJs-Master Class")
    .setDescription("App is running on http://localhost:3000")
    .setTermsOfService("http://localhost:3000/terms-of-service")
    .setLicense("MIT Licence", "https://github.com/Rakshith083/nestjs-learning")
    .addServer("http://localhost:3000")
    .setVersion('1.0')
    .build();

  //Instantiate Document
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
