import { NestFactory } from "@nestjs/core";
import { json } from "express";
import { AppModule } from "./app.module";
import * as fs from "fs";

async function bootstrap() {
  let httpsOptions;
  if (process.env.NODE_ENV === "production") {
    console.log("Starting app in production mode");

    httpsOptions = {
      key: fs.readFileSync("./secrets/private-key.pem"),
      cert: fs.readFileSync("./secrets/public-certificate.pem"),
    };
  }

  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.enableCors({
    origin: "*",
  });

  await app.listen(9876);
}
bootstrap();
