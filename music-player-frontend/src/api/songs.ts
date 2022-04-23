import { TokenManager } from "../utils/tokenmanager";
import { api, User } from "./auth";

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  cover: string;
  bitrate: number;
  sampleRate: number;
  size: number;
  lossless: boolean;
  file: string;
}

export const createSong = (
  title: string,
  artist: string,
  cover: string,
  base64: string,
  onProgress: (progress: number) => void
) => {
  return api.post<Song>(
    "/songs",
    {
      title,
      artist,
      cover,
      base64,
    },
    {
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(progress);
      },
      headers: {
        Authorization: TokenManager.token,
      },
    }
  );
};
