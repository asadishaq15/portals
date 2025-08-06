import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express } from 'express'; // Import Express type here!
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';

const server: Express = express(); // Explicitly annotate the type

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  // Enable CORS at the NEST level, not express!
  app.enableCors({
    origin: 'https://portals-mu.vercel.app',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
    exposedHeaders: ['Set-Cookie'],
  });

  app.use(cookieParser());
  app.use(json());
  app.use(urlencoded({ extended: true }));
  await app.init();
}

bootstrap();

export default server;

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3014;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}