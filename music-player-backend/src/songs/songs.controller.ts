import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/auth/middleware/current-user.middleware";
import { User } from "src/entities/user.entity";
import { AuthGuard } from "src/guards/auth.guard";
import { Serialize } from "src/interceptors/serialize.interceptor";
import { SongsService } from "./songs.service";
import { SpotifySongDto } from "./spotify-song.dto";
import { UploadSongDto } from "./upload-song.dto";

@Controller("songs")
export class SongsController {
  constructor(private songsService: SongsService) {}

  @Post("/")
  @UseGuards(AuthGuard)
  async uploadSong(
    @Body() songObject: UploadSongDto,
    @CurrentUser() user: User,
  ) {
    return this.songsService.uploadSong(songObject, user);
  }

  @Get("/")
  @UseGuards(AuthGuard)
  getAll(@CurrentUser() user: User) {
    return this.songsService.getAll(user);
  }

  @Get("/search/:q")
  @Serialize(SpotifySongDto)
  async search(@Param("q") q: string) {
    return await this.songsService.search(q);
  }
}
