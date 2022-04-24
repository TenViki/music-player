export interface LyricsSearch {
  message: Message;
}

export interface Message {
  header: Header;
  body: Body;
}

export interface Header {
  status_code: number;
}

export interface Body {
  macro_calls: MacroCalls;
}

export interface MacroCalls {
  "track.subtitles.get": TrackSubtitlesGet;
}

export interface TrackSubtitlesGet {
  message: Message2;
}

export interface Message2 {
  header: Header2;
  body: Body2;
}

export interface Header2 {
  status_code: number;
}

export interface Body2 {
  subtitle_list: SubtitleList[];
}

export interface SubtitleList {
  subtitle: Subtitle;
}

export interface Subtitle {
  subtitle_body: string;
}
