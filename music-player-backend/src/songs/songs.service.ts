import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Song } from "src/entities/song.entity";
import { Repository } from "typeorm";
import { UploadSongDto } from "./upload-song.dto";
import * as mm from "music-metadata/lib/core";

@Injectable()
export class SongsService {
  constructor(@InjectRepository(Song) private repo: Repository<Song>) {}

  async uploadSong(songObject: UploadSongDto) {
    // Convert base64 to buffer
    const buffer = Buffer.from(songObject.base64, "base64");
    const metadata = await mm.parseBuffer(buffer);

    console.log(metadata.format);
  }
}
