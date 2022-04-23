import React from "react";
import { Song } from "../../api/songs";
import { formatTime, getImageCover } from "../../utils/songs";
import "./playlist-entry.scss";

interface PlaylistEntryProps {
  song: Song;
  onSelect: (song: Song) => void;
}

const PlaylistEntry: React.FC<PlaylistEntryProps> = ({ song, onSelect }) => {
  return (
    <div className="playlist-entry" onClick={() => onSelect(song)}>
      <div className="playlist-entry-cover">{getImageCover(song.cover)}</div>
      <div className="playlist-entry-info">
        <div className="playlist-entry-title">{song.title}</div>
        <div className="playlist-entry-artist">{song.artist}</div>
      </div>

      <div className="playlist-entry-time">{formatTime(song.duration)}</div>
    </div>
  );
};

export default PlaylistEntry;
