import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AuthService } from "./auth/auth.service";
import { AuthModule } from "./auth/auth.module";
import { APP_PIPE } from "@nestjs/core";
import { ValidationPipeCheck } from "./interceptors/validation.pipe";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "user",
      password: "password",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      database: "music-player",
      synchronize: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipeCheck({
        whitelist: true,
        stopAtFirstError: true,
      }),
    },
  ],
})
export class AppModule {}
