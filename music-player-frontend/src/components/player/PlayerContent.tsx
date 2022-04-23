import React from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiRepeat,
  FiShuffle,
} from "react-icons/fi";
import { IoPause, IoPlay } from "react-icons/io5";
import { Song } from "../../api/songs";
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
  tapped,
  setTapped,
  audio,
}) => {
  return (
    <div className="player-content">
      <div className="player-song">
        <div className="player-cover">
          {getImageCover(currentSong?.cover || "")}
        </div>
        <div className="player-info">
          <div className="player-title">{currentSong?.title}</div>
          <div className="player-artist">{currentSong?.artist}</div>
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
          <div className="player-controls-icon">
            <FiShuffle />
          </div>
          <div className="player-controls-icon">
            <FiChevronLeft />
          </div>
          <div
            className="player-controls-icon main"
            onClick={() => setPaused(!paused)}
          >
            {paused ? <IoPlay /> : <IoPause />}
          </div>
          <div className="player-controls-icon">
            <FiChevronRight />
          </div>
          <div
            className={`player-controls-icon ${repeat ? "active" : ""}`}
            onClick={() => setRepeat(!repeat)}
          >
            <FiRepeat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;
