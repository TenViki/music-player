import React, { useEffect } from "react";
import { Song } from "../../api/songs";
import { formatTime, getImageCover } from "../../utils/songs";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiRepeat,
  FiShuffle,
} from "react-icons/fi";
import "./player.scss";
import { BACKEND_URL } from "../../api/auth";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { IoPause, IoPlay } from "react-icons/io5";

interface PlayerProps {
  currentSong?: Song;
  playlist: Song[];
}

const Player: React.FC<PlayerProps> = ({ currentSong, playlist }) => {
  const [collapsed, setCollapsed] = React.useState(true);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  const audio = React.useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!currentSong || !audio.current) return;
    audio.current.src = `${BACKEND_URL}/songs/${currentSong.file}`;
    audio.current.play();

    const interval = setInterval(() => {
      setCurrentTime(audio.current?.currentTime || 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSong]);

  useEffect(() => {
    if (!audio.current) return;
    if (paused) {
      audio.current.pause();
    } else {
      audio.current.play();
    }
  }, [paused]);

  if (!currentSong)
    return (
      <div
        className={`player ${collapsed ? "collapsed" : ""} ${
          currentSong ? "active" : ""
        }`}
      ></div>
    );

  return (
    <div
      className={`player ${collapsed ? "collapsed" : ""} ${
        currentSong ? "active" : ""
      }`}
    >
      <audio ref={audio} />
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

          <div className="player-progress">
            {formatTime(audio.current?.currentTime || 0)}
            <input
              type="range"
              min={0}
              max={1}
              step={0.0001}
              className="player-progress-bar"
              value={(currentTime || 0) / currentSong.duration}
              onChange={(e) => {
                setCurrentTime(+e.target.value * currentSong.duration);
              }}
              onMouseUp={() => {
                if (!audio.current) return;
                audio.current.currentTime = currentTime;
              }}
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
            <div className="player-controls-icon">
              <FiRepeat />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
