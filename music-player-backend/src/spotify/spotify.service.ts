import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import axios from "axios";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class SpotifyService implements OnApplicationBootstrap {
  private accessToken: string;

  onApplicationBootstrap() {
    this.refreshToken();
  }

  @Cron(CronExpression.EVERY_HOUR)
  async refreshToken() {
    console.log(process.env.SPOTIFY_CLIENT_ID);

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
      console.log(this.accessToken, response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error retrieving spotify access token",
          error.response.data,
        );
      }
    }
  }
}
