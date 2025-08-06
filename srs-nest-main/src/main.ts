import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { json, urlencoded } from 'express';
import { ensureUploadsFolder } from 'utils/methods';
import * as cookieParser from 'cookie-parser';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express } from 'express';
import cors from 'cors';          // ← import it

dotenv.config();
const server: Express = express();

// ← add this block *before* NestFactory.create:
server.use(
  cors({
    origin: 'https://portals-mu.vercel.app',
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
    credentials: true,
  })
);

async function bootstrap() {
  ensureUploadsFolder();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );

  app.use(cookieParser());

  // you can still keep this:
  app.enableCors({
    origin: 'https://portals-mu.vercel.app',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  });

  app.use(json());
  app.use(urlencoded({ extended: true }));
  await app.init();
}

bootstrap();

// export for Vercel
export default server;

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3014;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}
