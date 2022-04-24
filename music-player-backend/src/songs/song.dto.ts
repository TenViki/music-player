import { Expose, Transform } from "class-transformer";

export class SongDto {
  @Expose()
  id: string;
  @Expose()
  title: string;
  @Expose()
  artist: string;
  @Expose()
  duration: number;
  @Expose()
  cover: string;
  @Expose()
  bitrate: number;
  @Expose()
  sampleRate: number;
  @Expose()
  size: number;
  @Expose()
  lossless: boolean;
  @Expose()
  file: string;
  @Expose()
  channels: number;
  @Expose()
  format: string;
  @Expose()
  @Transform(({ value }) => (value ? true : false))
  lyrics: boolean;
}
