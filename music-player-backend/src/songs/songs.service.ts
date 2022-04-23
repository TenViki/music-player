import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Song } from "src/entities/song.entity";
import { Repository } from "typeorm";
import { AddSongDto } from "./upload-song.dto";
import * as mm from "music-metadata/lib/core";
import { User } from "src/entities/user.entity";
import * as fs from "fs/promises";
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
    let buffer: Buffer;
    try {
      buffer = await fs.readFile("./files/" + songObject.id + ".mp3");
    } catch {
      await this.spotifyService.download(songObject.id);
    }

    buffer = await fs.readFile("./files/" + songObject.id + ".mp3");

    const metadata = await mm.parseBuffer(buffer);

    const trackData = await this.spotifyService.getTrack(songObject.id);
    console.log(trackData);

    // Create song object
    const song = this.repo.create({
      title: trackData.name,
      artist: trackData.artists.map((a) => a.name).join(", "),
      duration: Math.floor(metadata.format.duration),
      cover: trackData.album.images[0]?.url || "",
      bitrate: metadata.format.bitrate,
      sampleRate: metadata.format.sampleRate,
      size: buffer.length,
      lossless: metadata.format.lossless,
      file: songObject.id + ".mp3",
      user,
      channels: metadata.format.numberOfChannels,
      format: metadata.format.container,
    });

    // Save song to database
    return this.repo.save(song);
  }

  async search(query: string) {
    const a = await this.spotifyService.search(query);
    return a.tracks.items;
  }
}
