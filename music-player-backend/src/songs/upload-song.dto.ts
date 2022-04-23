import { IsOptional, IsString } from "class-validator";

export class AddSongDto {
  @IsString()
  id: string;
}
