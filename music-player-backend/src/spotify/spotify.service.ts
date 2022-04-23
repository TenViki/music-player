import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import axios from "axios";
import { Cron, CronExpression } from "@nestjs/schedule";
import { SpotifySearch } from "src/types/spotify-search.type";
import SpotifyDLCore from "spotifydl-core";
import SpotifyFetcher from "spotifydl-core/dist/Spotify";

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
  }

  async search(query: string) {
    const url = `https://api.spotify.com/v1/search?q=${query}&type=track`;
    const response = await axios.get<SpotifySearch>(url, {
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
}
