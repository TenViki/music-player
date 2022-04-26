import { NestFactory } from "@nestjs/core";
import { json } from "express";
import { AppModule } from "./app.module";
import * as fs from "fs";

async function bootstrap() {
  let httpsOptions;
  if (process.env.NODE_ENV === "production") {
    console.log("Starting app in production mode");

    httpsOptions = {
      key: fs.readFileSync(process.env.PATH_TO_KEY),
      cert: fs.readFileSync(process.env.PATH_TO_CERT),
    };
  }

  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.enableCors({
    origin: "*",
  });

  await app.listen(9876);
}
bootstrap();
