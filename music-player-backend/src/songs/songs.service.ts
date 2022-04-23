import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Song } from "src/entities/song.entity";
import { Repository } from "typeorm";
import { AddSongDto } from "./upload-song.dto";
import * as mm from "music-metadata/lib/core";
import { User } from "src/entities/user.entity";
import * as fs from "fs";
import { SpotifyService } from "src/spotify/spotify.service";
import spdl from "spdl-core";
import * as toArray from "stream-to-array";

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song) private repo: Repository<Song>,
    private spotifyService: SpotifyService,
  ) {}

  getAll(user: User) {
    return this.repo.find({ where: { user } });
  }

  async addSong(songObject: AddSongDto, user: User) {
    await this.spotifyService.download(songObject.id);

    // const metadata = await mm.parseBuffer(buffer);
    // console.log(metadata);

    // const filename = Math.random().toString(36).substring(2, 15) + ".bin";
    // const filepath = `./files/${filename}`;

    // // Write buffer to file
    // await fs.writeFile(filepath, buffer);

    // // Create song object
    // const song = this.repo.create({
    //   title: songObject.title,
    //   artist: songObject.artist,
    //   duration: Math.floor(metadata.format.duration),
    //   cover: songObject.cover,
    //   bitrate: metadata.format.bitrate,
    //   sampleRate: metadata.format.sampleRate,
    //   size: buffer.length,
    //   lossless: metadata.format.lossless,
    //   file: filename,
    //   user,
    // });

    // // Save song to database
    // return this.repo.save(song);
  }

  async search(query: string) {
    const a = await this.spotifyService.search(query);
    return a.tracks.items;
  }
}
