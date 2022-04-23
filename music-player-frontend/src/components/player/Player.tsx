import React from "react";
import { Song } from "../../api/songs";

interface PlayerProps {
  currentSong?: Song;
  playlist: Song[];
}

const Player: React.FC<PlayerProps> = ({ currentSong, playlist }) => {
  const [collapsed, setCollapsed] = React.useState(true);

  return (
    <div className={`player ${collapsed ? "collapsed" : ""}`}>
      <div className="player-header">
        <div className="player-header-cover">{currentSong?.cover}</div>
      </div>
    </div>
  );
};

export default Player;
