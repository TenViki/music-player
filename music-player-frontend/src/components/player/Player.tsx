import React from "react";
import { Song } from "../../api/songs";
import { getImageCover } from "../../utils/songs";
import { FiChevronDown } from "react-icons/fi";
import "./player.scss";

interface PlayerProps {
  currentSong?: Song;
  playlist: Song[];
}

const Player: React.FC<PlayerProps> = ({ currentSong, playlist }) => {
  const [collapsed, setCollapsed] = React.useState(true);

  return (
    <div
      className={`player ${collapsed ? "collapsed" : ""} ${
        currentSong ? "active" : ""
      }`}
    >
      <div className="player-background">
        {currentSong?.cover && (
          <img
            className="player-background-image"
            src={currentSong.cover}
            alt=""
          />
        )}
      </div>
      <div className="player-header">
        <div className="player-header-cover">
          {getImageCover(currentSong?.cover || "")}
        </div>
        <div className="player-header-info">{currentSong?.title}</div>
        <div
          className="playlist-header-toggle"
          onClick={() => setCollapsed(!collapsed)}
        >
          <FiChevronDown />
        </div>
      </div>

      <div className="player-content">
        <div className="player-song">
          <div className="player-cover">
            {getImageCover(currentSong?.cover || "")}
          </div>
          <div className="player-info">
            <div className="player-title">{currentSong?.title}</div>
            <div className="player-artist">{currentSong?.artist}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
