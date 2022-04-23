import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import axios from "axios";
import { Cron, CronExpression } from "@nestjs/schedule";
import { SpotifySearch } from "src/types/spotify-search.type";

@Injectable()
export class SpotifyService implements OnApplicationBootstrap {
  private accessToken: string;

  onApplicationBootstrap() {
    this.refreshToken();
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
}
