import { Body, Controller, Post } from "@nestjs/common";
import { CurrentUser } from "src/auth/middleware/current-user.middleware";
import { User } from "src/entities/user.entity";
import { SongsService } from "./songs.service";
import { UploadSongDto } from "./upload-song.dto";

@Controller("songs")
export class SongsController {
  constructor(private songsService: SongsService) {}

  @Post("/")
  async uploadSong(
    @Body() songObject: UploadSongDto,
    @CurrentUser() user: User,
  ) {
    return this.songsService.uploadSong(songObject, user);
  }
}
