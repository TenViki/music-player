import { Expose, Transform, Type } from "class-transformer";

class AlbumDto {
  @Transform(({ value }) => value.map((image) => image.url))
  @Expose()
  images: string[];
}

export class SpotifySongDto {
  @Transform(({ value }) => value.map((artist) => artist.name))
  @Expose()
  artists: string[];

  @Type(() => AlbumDto)
  @Expose()
  album: AlbumDto;

  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  duration_ms: number;
}
