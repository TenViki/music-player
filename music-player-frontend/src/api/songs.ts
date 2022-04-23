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

export interface SearchResult {
  id: string;
  name: string;
  duration_ms: number;

  album: {
    images: string[];
  };

  artists: string[];
}

export const getPlaylist = async (): Promise<Song[]> => {
  const data = await api.get<Song[]>("/songs", {
    headers: {
      Authorization: TokenManager.token,
    },
  });
  return data.data;
};

export const searchSongs = async (query: string): Promise<SearchResult[]> => {
  const data = await api.get<SearchResult[]>(`/songs/search/${query}`, {
    headers: {
      Authorization: TokenManager.token,
    },
  });
  return data.data;
};
