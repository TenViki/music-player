import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AuthService } from "./auth/auth.service";
import { AuthModule } from "./auth/auth.module";
import { APP_PIPE } from "@nestjs/core";
import { ValidationPipeCheck } from "./interceptors/validation.pipe";
import { ConfigModule } from "@nestjs/config";
import { SongsModule } from "./songs/songs.module";
import { SpotifyModule } from "./spotify/spotify.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.prod`,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5433,
      username: "user",
      password: "password",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      database: "music-player",
      synchronize: true,
    }),
    AuthModule,
    SongsModule,
    SpotifyModule,
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
