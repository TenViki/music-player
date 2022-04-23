import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  StreamableFile,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "src/auth/middleware/current-user.middleware";
import { User } from "src/entities/user.entity";
import { AuthGuard } from "src/guards/auth.guard";
import { Serialize } from "src/interceptors/serialize.interceptor";
import { SongsService } from "./songs.service";
import { SpotifySongDto } from "./spotify-song.dto";
import { AddSongDto } from "./upload-song.dto";
import * as fs from "fs/promises";
import { createReadStream } from "fs";
import { join } from "path";

@Controller("songs")
export class SongsController {
  constructor(private songsService: SongsService) {}

  @Post("/")
  @UseGuards(AuthGuard)
  async uploadSong(@Body() songObject: AddSongDto, @CurrentUser() user: User) {
    return this.songsService.addSong(songObject, user);
  }

  @Get("/")
  @UseGuards(AuthGuard)
  getAll(@CurrentUser() user: User) {
    return this.songsService.getAll(user);
  }

  @Get("/:file.mp3")
  async getSong(@Param("file") filename: string) {
    console.log(filename);
    try {
      await fs.access("./files/" + filename + ".mp3");
      const file = createReadStream(
        join(process.cwd(), "files", filename + ".mp3"),
      );
      return new StreamableFile(file);
    } catch (error) {
      throw new NotFoundException("File not found");
    }
  }

  @Get("/search/:q")
  @Serialize(SpotifySongDto)
  async search(@Param("q") q: string) {
    return await this.songsService.search(q);
  }
}
