import { Module } from "@nestjs/common";
import { SpotifyService } from "./spotify.service";

@Module({
  exports: [SpotifyService],
  providers: [SpotifyService],
})
export class SpotifyModule {}
