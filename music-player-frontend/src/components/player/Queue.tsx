import React from "react";
import { Song } from "../../api/songs";
import PlaylistEntry from "../playlist/PlaylistEntry";

interface QueueProps {
  queue: Song[];
  onSelect: (song: Song) => void;
}

const Queue: React.FC<QueueProps> = ({ queue, onSelect }) => {
  return (
    <div className="player-queue clickable">
      {queue.map((song, index) => (
        <PlaylistEntry onSelect={onSelect} song={song} key={index} />
      ))}
    </div>
  );
};

export default Queue;
