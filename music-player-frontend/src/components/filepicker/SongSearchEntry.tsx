import React from "react";
import { SearchResult } from "../../api/songs";
import { formatTime, getImageCover } from "../../utils/songs";

interface SongSearchEntryProps {
  song: SearchResult;
}

const SongSearchEntry: React.FC<SongSearchEntryProps> = ({ song }) => {
  return (
    <div className="song-search-entry">
      <div className="song-search-cover">
        {getImageCover(song.album.images[0])}
      </div>
      <div className="song-search-info">
        <div className="song-search-title">{song.name}</div>
        <div className="song-search-artist">{song.artists.join(", ")}</div>
      </div>
      <div className="song-search-duration">
        {formatTime(song.duration_ms / 1000)}
      </div>
    </div>
  );
};

export default SongSearchEntry;
