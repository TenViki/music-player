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
  channels: number;
  format: string;
  lyrics: boolean;
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

export interface Lyrics {
  text: string;
  time: {
    total: number;
    minutes: number;
    seconds: number;
    hundredths: number;
  };
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

export const addSong = async (songId: string): Promise<Song> => {
  const data = await api.post<Song>(
    `/songs`,
    {
      id: songId,
    },
    {
      headers: {
        Authorization: TokenManager.token,
      },
      timeout: 30000,
    }
  );
  return data.data;
};

export const getLyrics = async (songId: string) => {
  const data = await api.get<Lyrics[] | null>(`/songs/lyrics/${songId}`, {
    headers: {
      Authorization: TokenManager.token,
    },
  });
  return data.data;
};
