import React from "react";
import { Song } from "../../api/songs";
import PlaylistEntry from "../playlist/PlaylistEntry";

interface QueueProps {
  queue: Song[];
}

const Queue: React.FC<QueueProps> = ({ queue }) => {
  return (
    <div className="player-queue">
      {queue.map((song, index) => (
        <PlaylistEntry onSelect={() => {}} song={song} key={index} />
      ))}
    </div>
  );
};

export default Queue;
