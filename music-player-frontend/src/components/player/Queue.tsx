import React from "react";
import { Song } from "../../api/songs";

interface QueueProps {
  queue: Song[];
}

const Queue: React.FC<QueueProps> = ({ queue }) => {
  return (
    <div>
      {queue.map((song, index) => (
        <div key={index}>{song.title}</div>
      ))}
    </div>
  );
};

export default Queue;
