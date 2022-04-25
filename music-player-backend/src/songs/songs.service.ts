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
import axios from "axios";
import { SongsGateway } from "./songs.gateway";

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song) private repo: Repository<Song>,
    private spotifyService: SpotifyService,
    private songsGateway: SongsGateway,
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

    const songLyrics = await this.spotifyService.getSongLyrics(
      trackData.artists.map((a) => a.name).join(", "),
      trackData.name,
    );

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
      lyrics: songLyrics,
    });

    const savedSong = await this.repo.save(song);

    this.songsGateway.send("playlist-add", savedSong, user.id);

    // Save song to database
    return savedSong;
  }

  async search(query: string) {
    const a = await this.spotifyService.search(query);
    return a.tracks.items;
  }

  async getLyrics(id: string) {
    const lyrics = await this.repo.findOne({ where: { id } });
    if (!lyrics) return null;
    return JSON.parse(lyrics.lyrics);
  }

  async deleteSong(id: string, user: User) {
    const song = await this.repo.findOne({ where: { id, user } });
    if (!song) return null;
    await this.repo.delete(song.id);
    this.songsGateway.send("playlist-remove", song, user.id);
    return song;
  }
}
