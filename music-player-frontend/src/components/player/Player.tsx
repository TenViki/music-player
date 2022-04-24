import React, { useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { IoPause, IoPlay } from "react-icons/io5";
import { BACKEND_URL } from "../../api/auth";
import { Song } from "../../api/songs";
import { getImageCover } from "../../utils/songs";
import "./player.scss";
import PlayerContent from "./PlayerContent";
import Queue from "./Queue";

interface PlayerProps {
  currentSong?: Song;
  lastSong?: Song;
  playlist: Song[];
  handleChangeSong: (song: Song) => void;
}

const Player: React.FC<PlayerProps> = ({
  currentSong,
  playlist,
  handleChangeSong,
  lastSong,
}) => {
  const [collapsed, setCollapsed] = React.useState(true);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [tapped, setTapped] = React.useState(false);
  const [repeat, setRepeat] = React.useState(false);
  const [inTransition, setInTransition] = React.useState(false);

  const [queue, setQueue] = React.useState(playlist);

  const audio = React.useRef<HTMLAudioElement>(null);

  const processPlaylist = (playlist: Song[]) => {
    const before = playlist.slice(0, playlist.indexOf(currentSong!));
    const after = playlist.slice(playlist.indexOf(currentSong!) + 1);
    return [...after, ...before];
  };

  useEffect(() => {
    if (!currentSong || !audio.current) return;
    audio.current.src = `${BACKEND_URL}/songs/${currentSong.file}`;
    audio.current.play();
    setCurrentTime(0);
    setPaused(false);
    setQueue(processPlaylist(playlist));
  }, [currentSong]);

  useEffect(() => {
    const interval = setInterval(() => {
      !tapped && setCurrentTime(audio.current?.currentTime || 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSong, tapped, audio]);

  const handleEnd = () => {
    if (!audio.current) return;
    if (repeat) {
      audio.current.currentTime = 0;
      audio.current.play();
    }
  };

  useEffect(() => {
    audio.current?.addEventListener("ended", handleEnd);

    return () => audio.current?.removeEventListener("ended", handleEnd);
  }, [audio, repeat]);

  useEffect(() => {
    if (!audio.current) return;
    if (paused) {
      audio.current.pause();
    } else {
      audio.current.play();
    }
  }, [paused]);

  useEffect(() => {
    setInTransition(true);
    setTimeout(() => {
      setInTransition(false);
    }, 550);
  }, [lastSong]);

  const handleProgressDown = () => {
    if (!audio.current) return;
    setTapped(false);
    audio.current.currentTime = currentTime;
    audio.current.play();
    setPaused(false);
  };

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
      <div
        className={`player-background-transition ${
          inTransition ? "transitioning" : ""
        }`}
      >
        <img src={lastSong?.cover} alt="" />
      </div>
      <div className="player-background">
        {currentSong?.cover && (
          <img
            className="player-background-image"
            src={currentSong.cover}
            alt=""
          />
        )}
      </div>
      <div className="player-background-blur"></div>
      <div className="player-header">
        <div className="player-header-cover">
          {getImageCover(currentSong?.cover || "")}
        </div>
        <div className="play-header-content">
          <div className="player-header-upper">
            <div className="player-header-info">{currentSong?.title}</div>
            <div
              className="player-header-controls"
              onClick={() => setPaused(!paused)}
            >
              {paused ? <IoPlay /> : <IoPause />}
            </div>
          </div>
          <div className="player-header-progress">
            <div
              className="player-header-progress-bar"
              style={{
                width: `${(currentTime / currentSong.duration) * 100}%`,
              }}
            />
          </div>
        </div>

        <div
          className="playlist-header-toggle"
          onClick={() => setCollapsed(!collapsed)}
        >
          <FiChevronDown />
        </div>
      </div>

      <div className="player-content">
        {audio.current && (
          <PlayerContent
            audio={audio.current!}
            currentSong={currentSong}
            currentTime={currentTime}
            handleProgressDown={handleProgressDown}
            paused={paused}
            repeat={repeat}
            setRepeat={setRepeat}
            setTapped={setTapped}
            setPaused={setPaused}
            setCurrentTime={setCurrentTime}
            tapped={tapped}
          />
        )}
        <Queue queue={queue} onSelect={handleChangeSong} />
      </div>
    </div>
  );
};

export default Player;
