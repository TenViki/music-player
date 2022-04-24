import { Module } from "@nestjs/common";
import { SongsService } from "./songs.service";
import { SongsController } from "./songs.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Song } from "src/entities/song.entity";
import { SpotifyModule } from "src/spotify/spotify.module";
import { SongsGateway } from "./songs.gateway";
import { User } from "src/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Song, User]), SpotifyModule],
  providers: [SongsService, SongsGateway],
  controllers: [SongsController],
})
export class SongsModule {}
