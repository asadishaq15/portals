
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { json, urlencoded } from 'express';
import { ensureUploadsFolder } from 'utils/methods';
import * as cookieParser from 'cookie-parser';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { Express } from 'express'; // ✅ Import Express type

dotenv.config();

// ✅ Explicit type annotation
const server: Express = express();

async function bootstrap() {
  ensureUploadsFolder();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(json());
  app.use(urlencoded({ extended: true }));

  await app.init();
}

bootstrap();

// ✅ For Vercel
export default server;

// ✅ For local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3014;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}
