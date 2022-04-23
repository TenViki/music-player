import { Body, Controller, Post } from "@nestjs/common";
import { SongsService } from "./songs.service";
import { UploadSongDto } from "./upload-song.dto";

@Controller("songs")
export class SongsController {
  constructor(private songsService: SongsService) {}

  @Post("/")
  async uploadSong(@Body() songObject: UploadSongDto) {
    this.songsService.uploadSong(songObject);
  }
}
