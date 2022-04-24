import React from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiRepeat,
  FiShuffle,
  FiVolume,
  FiVolume1,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";
import { IoPause, IoPlay } from "react-icons/io5";
import { Song } from "../../api/songs";
import { SocketContext } from "../../App";
import { formatTime, getImageCover } from "../../utils/songs";

interface PlayerContentProps {
  currentSong: Song;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  paused: boolean;
  setPaused: (paused: boolean) => void;
  repeat: boolean;
  setRepeat: (repeat: boolean) => void;
  tapped: boolean;
  setTapped: (tapped: boolean) => void;
  handleProgressDown: () => void;
  audio: HTMLAudioElement;
  shuffle: boolean;
  setShuffle: (shuffle: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  nextSong: () => void;
  previousSong: () => void;
}

const PlayerContent: React.FC<PlayerContentProps> = ({
  currentSong,
  setCurrentTime,
  currentTime,
  handleProgressDown,
  paused,
  setPaused,
  repeat,
  setRepeat,
  setTapped,
  audio,
  shuffle,
  setShuffle,
  volume,
  setVolume,
  nextSong,
  previousSong,
}) => {
  const socket = React.useContext(SocketContext);

  const updateShuffle = (shuffle: boolean) => {
    setShuffle(shuffle);
    if (!socket) return;

    socket.emit("set-status", {
      status: {
        shuffle,
      },
    });
  };

  const updateRepeat = (repeat: boolean) => {
    setRepeat(repeat);
    if (!socket) return;

    socket.emit("set-status", {
      status: {
        repeat,
      },
    });
  };

  return (
    <div className="player-song">
      <div className="player-cover">
        {getImageCover(currentSong?.cover || "")}
      </div>
      <div className="player-info">
        <div className="player-title">{currentSong?.title}</div>
        <div className="player-artist">{currentSong?.artist}</div>
      </div>

      <div className="player-volume">
        <input
          type="range"
          className="player-volume-bar"
          style={{
            backgroundSize: `${volume * 100}% 100%`,
          }}
          value={volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
          }}
          min={0}
          max={1}
          step={0.01}
        />

        <div className="player-volume-icon">
          {volume === 0 && <FiVolumeX />}
          {volume > 0 && volume <= 0.33 && <FiVolume />}
          {volume > 0.33 && volume <= 0.66 && <FiVolume1 />}
          {volume > 0.66 && volume <= 1 && <FiVolume2 />}
        </div>
      </div>

      <div className="player-progress">
        {formatTime(audio.currentTime || 0)}
        <input
          type="range"
          min={0}
          max={1}
          step={0.0001}
          className="player-progress-bar"
          style={{
            backgroundSize: `${
              (currentTime / currentSong.duration) * 100
            }% 100%`,
          }}
          value={(currentTime || 0) / currentSong.duration}
          onChange={(e) => {
            setCurrentTime(+e.target.value * currentSong.duration);
          }}
          onTouchEnd={handleProgressDown}
          onMouseUp={handleProgressDown}
          onTouchStart={() => setTapped(true)}
          onMouseDown={() => setTapped(true)}
        />
        {formatTime(currentSong?.duration)}
      </div>
      <div className="player-controls">
        <div
          className={`player-controls-icon ${shuffle ? "active" : ""}`}
          onClick={() => updateShuffle(!shuffle)}
        >
          <FiShuffle />
        </div>
        <div className="player-controls-icon" onClick={previousSong}>
          <FiChevronLeft />
        </div>
        <div
          className="player-controls-icon main"
          onClick={() => setPaused(!paused)}
        >
          {paused ? <IoPlay /> : <IoPause />}
        </div>
        <div className="player-controls-icon" onClick={nextSong}>
          <FiChevronRight />
        </div>
        <div
          className={`player-controls-icon ${repeat ? "active" : ""}`}
          onClick={() => updateRepeat(!repeat)}
        >
          <FiRepeat />
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;
