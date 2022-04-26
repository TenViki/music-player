import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import axios from "axios";
import { Cron, CronExpression } from "@nestjs/schedule";
import { SpotifySearch, Track } from "src/types/spotify-search.type";
import SpotifyDLCore from "spotifydl-core";
import SpotifyFetcher from "spotifydl-core/dist/Spotify";
import { LyricsSearch } from "src/types/lyrics";

@Injectable()
export class SpotifyService implements OnApplicationBootstrap {
  private accessToken: string;
  private spotify: SpotifyFetcher;

  onApplicationBootstrap() {
    this.refreshToken();

    this.spotify = new SpotifyDLCore({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  async refreshToken() {
    const token = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
    ).toString("base64");

    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        "grant_type=client_credentials",
        {
          headers: {
            Authorization: "Basic " + token,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );
      this.accessToken = response.data.access_token;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error retrieving spotify access token",
          error.response.data,
        );
      }
    }

    console.log("Refreshed spotify access token", this.accessToken);
  }

  async search(query: string) {
    const url = encodeURI(
      `https://api.spotify.com/v1/search?q=${query}&type=track`,
    );
    const response = await axios.get<SpotifySearch>(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    return response.data;
  }

  async getTrack(id: string) {
    const url = `https://api.spotify.com/v1/tracks/${id}`;
    const response = await axios.get<Track>(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    return response.data;
  }

  async download(id: string) {
    await this.spotify.downloadTrack(
      `https://open.spotify.com/track/${id}`,
      `./files/${id}.mp3`,
    );
  }

  async getSongLyrics(artist: string, title: string): Promise<string | null> {
    const url = encodeURI(
      `https://apic-desktop.musixmatch.com/ws/1.1/macro.subtitles.get?format=json&user_language=en&namespace=lyrics_synched&f_subtitle_length_max_deviation=1&subtitle_format=mxm&app_id=web-desktop-app-v1.0&usertoken=190511307254ae92ff84462c794732b84754b64a2f051121eff330&q_artist=${artist}&q_track=${title}`,
    );
    const response = await axios.get<LyricsSearch>(url, {
      headers: {
        Cookie: `AWSELB=55578B011601B1EF8BC274C33F9043CA947F99DCFF0A80541772015CA2B39C35C0F9E1C932D31725A7310BCAEB0C37431E024E2B45320B7F2C84490C2C97351FDE34690157`,
      },
    });

    if (
      response.data.message.body.macro_calls["track.subtitles.get"].message
        .header.status_code !== 200 ||
      !response.data.message.body.macro_calls["track.subtitles.get"]?.message
        ?.body?.subtitle_list?.length
    )
      return null;
    return response.data.message.body.macro_calls["track.subtitles.get"].message
      .body.subtitle_list[0].subtitle.subtitle_body;
  }
}
