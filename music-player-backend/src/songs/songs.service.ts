import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Song } from "src/entities/song.entity";
import { Repository } from "typeorm";
import { UploadSongDto } from "./upload-song.dto";
import * as mm from "music-metadata/lib/core";
import { User } from "src/entities/user.entity";
import * as fs from "fs/promises";
import { SpotifyService } from "src/spotify/spotify.service";

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song) private repo: Repository<Song>,
    private spotifyService: SpotifyService,
  ) {}

  getAll(user: User) {
    return this.repo.find({ where: { user } });
  }

  async uploadSong(songObject: UploadSongDto, user: User) {
    // Convert base64 to buffer
    const base64 = songObject.base64.split(",")[1];
    const buffer = Buffer.from(base64, "base64");
    const metadata = await mm.parseBuffer(buffer);

    const filename = Math.random().toString(36).substring(2, 15) + ".bin";
    const filepath = `./files/${filename}`;

    // Write buffer to file
    await fs.writeFile(filepath, buffer);

    // Create song object
    const song = this.repo.create({
      title: songObject.title,
      artist: songObject.artist,
      duration: Math.floor(metadata.format.duration),
      cover: songObject.cover,
      bitrate: metadata.format.bitrate,
      sampleRate: metadata.format.sampleRate,
      size: buffer.length,
      lossless: metadata.format.lossless,
      file: filename,
      user,
    });

    // Save song to database
    return this.repo.save(song);
  }

  async search(query: string) {
    const a = await this.spotifyService.search(query);
    return a.tracks.items;
  }
}
