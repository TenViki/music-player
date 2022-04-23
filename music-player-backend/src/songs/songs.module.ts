import { Module } from "@nestjs/common";
import { SongsService } from "./songs.service";
import { SongsController } from "./songs.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Song } from "src/entities/song.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Song])],
  providers: [SongsService],
  controllers: [SongsController],
})
export class SongsModule {}
