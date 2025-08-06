// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { json, urlencoded } from 'express';
import { ensureUploadsFolder } from 'utils/methods';
import * as cookieParser from 'cookie-parser';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { Express } from 'express';

dotenv.config();
const server: Express = express();

async function bootstrap() {
  ensureUploadsFolder();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );

  app.use(cookieParser());

  // 🛠️ Tighten CORS to your frontend domain:
  app.enableCors({
    origin: 'https://portals-mu.vercel.app',         // your Next.js URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',// allowed HTTP verbs
    allowedHeaders:                              
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    credentials: true,                             // allow cookies/auth
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
