import { NestFactory } from "@nestjs/core";
import { json } from "express";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "*",
  });
  app.use(json({ limit: "50mb" }));
  await app.listen(5000);
}
bootstrap();
