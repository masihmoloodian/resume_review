import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(helmet());
  app.setGlobalPrefix('v1');

  const documentBuilder = new DocumentBuilder()
    .setTitle('Resume Review API')
    .setDescription('Resume Review API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('docs', app, document);

  const config = app.get(ConfigService);

  await app
    .listen(config.get<number>('app.port'), config.get('app.host'))
    .then(() =>
      console.info(
        `Server is running on http://${config.get<string>(
          'app.host',
        )}:${config.get<number>('app.port')}`,
        `\nSwagger is running on http://${config.get<string>(
          'app.host',
        )}:${config.get<number>('app.port')}/docs`,
      ),
    );
}
bootstrap();
