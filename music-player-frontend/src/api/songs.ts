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
  base64: string
) => {
  return api.post("/songs", {
    title,
    artist,
    cover,
    base64,
  });
};
