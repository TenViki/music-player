import { Module } from "@nestjs/common";
import { SongsService } from "./songs.service";
import { SongsController } from "./songs.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Song } from "src/entities/song.entity";
import { SpotifyModule } from "src/spotify/spotify.module";

@Module({
  imports: [TypeOrmModule.forFeature([Song]), SpotifyModule],
  providers: [SongsService],
  controllers: [SongsController],
})
export class SongsModule {}
