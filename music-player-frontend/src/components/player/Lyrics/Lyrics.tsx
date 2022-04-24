import React from "react";
import { Song } from "../../../api/songs";

interface LyricsProps {
  currentSong?: Song;
}

const Lyrics: React.FC<LyricsProps> = ({ currentSong }) => {
  return <div>Poggers</div>;
};

export default Lyrics;
