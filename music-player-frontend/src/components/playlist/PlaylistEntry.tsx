import React from "react";
import { Song } from "../../api/songs";
import { formatTime, getImageCover } from "../../utils/songs";
import "./playlist-entry.scss";
import lyrics from "../../assets/lyrics.svg";
import { doParentsHaveClass } from "../../utils/usePrevious";

interface PlaylistEntryProps {
  song: Song;
  onSelect: (song: Song) => void;
}

const PlaylistEntry: React.FC<PlaylistEntryProps> = ({ song, onSelect }) => {
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // if path to target contains class dragging, do nothing

    if (
      doParentsHaveClass(target, "dragging") ||
      !doParentsHaveClass(target, "clickable")
    )
      return;

    onSelect(song);
  };

  return (
    <div className="playlist-entry" onClick={handleClick}>
      <div className="playlist-entry-cover">{getImageCover(song.cover)}</div>
      <div className="playlist-entry-info">
        <div className="playlist-entry-title">{song.title}</div>
        <div className="playlist-entry-artist">{song.artist}</div>
      </div>

      {song.lyrics && (
        <div className="playlist-entry-lyrics">
          <img src={lyrics} alt="Lyrics" />
        </div>
      )}

      <div className="playlist-entry-time">{formatTime(song.duration)}</div>
    </div>
  );
};

export default PlaylistEntry;
