import { IsString } from "class-validator";

export class UploadSongDto {
  @IsString()
  title: string;

  @IsString()
  artist: string;

  @IsString()
  base64: string;
}
