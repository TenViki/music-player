import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
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
import { createReadStream, readSync } from "fs";
import { join } from "path";
import { Response } from "express";

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
  async getSong(
    @Param("file") filename: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      await fs.access("./files/" + filename + ".mp3");

      const fileSize = (await fs.stat("./files/" + filename + ".mp3")).size;

      const file = createReadStream(
        join(process.cwd(), "files", filename + ".mp3"),
      );

      res.set({
        "Content-Type": "audio/mpeg",
        "Content-Length": fileSize,
        "Content-Range": `bytes 0-${fileSize - 1}/${fileSize}`,
        "Accept-Ranges": "bytes",
      });

      return new StreamableFile(file);
    } catch (error) {
      console.log(error);
      throw new NotFoundException("File not found");
    }
  }

  @Get("/search/:q")
  @Serialize(SpotifySongDto)
  async search(@Param("q") q: string) {
    return await this.songsService.search(q);
  }
  @Get("/lyrics/:id")
  async getLyrics(@Param("id") id: string) {
    return await this.songsService.getLyrics(id);
  }

  @Delete("/:id")
  @UseGuards(AuthGuard)
  async deleteSong(@Param("id") id: string, @CurrentUser() user: User) {
    return await this.songsService.deleteSong(id, user);
  }
}
