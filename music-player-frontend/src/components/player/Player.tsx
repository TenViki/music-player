import React, { useEffect } from "react";
import { FiCast, FiChevronDown, FiList } from "react-icons/fi";
import { IoPause, IoPlay } from "react-icons/io5";
import { BACKEND_URL } from "../../api/auth";
import { Song } from "../../api/songs";
import { SocketContext } from "../../App";
import { getImageCover } from "../../utils/songs";
import { usePrevious } from "../../utils/usePrevious";
import Lyrics from "./Lyrics/Lyrics";
import DeviceCast, { DeviceType } from "./Menus/DeviceCast";
import SongInsights from "./Menus/SongInsights";
import "./player.scss";
import PlayerContent from "./PlayerContent";
import Queue from "./Queue";

interface PlayerProps {
  currentSong?: Song;
  lastSong?: Song;
  playlist: Song[];
  handleChangeSong: (song: Song) => void;
  setAvailable: (available: boolean) => void;
  devices: DeviceType[];
  setDevices: (devices: DeviceType[]) => void;
}

const Player: React.FC<PlayerProps> = ({
  currentSong,
  playlist,
  handleChangeSong,
  lastSong,
  setAvailable,
  devices,
  setDevices,
}) => {
  const socket = React.useContext(SocketContext);
  const [collapsed, setCollapsed] = React.useState(true);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [tapped, setTapped] = React.useState(false);
  const [repeat, setRepeat] = React.useState(false);
  const [inTransition, setInTransition] = React.useState(false);
  const [shuffle, setShuffle] = React.useState(false);
  const [volume, setVolume] = React.useState(1);

  const [deviceId, setDeviceId] = React.useState<string>("");

  const [insightsOpened, setInsightsOpened] = React.useState(false);
  const [castOpened, setCastOpened] = React.useState(false);

  const [queue, setQueue] = React.useState(playlist);

  const audio = React.useRef<HTMLAudioElement>(null);
  const [queueOpened, setQueueOpened] = React.useState(true);

  const handleCanplaythrough = () => {
    if (!audio.current) return;
    audio.current.currentTime = currentTime;
    audio.current.play();
    audio.current.removeEventListener("canplaythrough", handleCanplaythrough);
  };

  const handleStatusUpdate = (status: {
    device: string;
    song: string;
    shuffle: boolean;
    repeat: boolean;
    paused: boolean;
  }) => {
    setDeviceId(status.device);
    setShuffle(status.shuffle);
    setRepeat(status.repeat);
    setPaused(status.paused);

    if (status.device === socket?.id && status.device !== deviceId) {
      const song = playlist.find((song) => song.id === status.song);
      if (!song) return;

      if (!audio.current) return;
      audio.current.src = `${BACKEND_URL}/songs/${song.file}`;

      audio.current.addEventListener("canplaythrough", handleCanplaythrough);
    }

    if (status.song && status.song !== currentSong?.id) {
      const song = playlist.find((song) => song.id === status.song);
      song && handleChangeSong(song);
    }

    setAvailable(true);
  };

  const handleTimeUpdate = (time: { time: number; control: boolean }) => {
    if (time.control) {
      setCurrentTime(time.time);
      audio.current && (audio.current.currentTime = time.time);
    } else if (socket?.id !== deviceId) {
      !tapped && setCurrentTime(time.time);
    }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("status-update", handleStatusUpdate);
    socket.on("time-update", handleTimeUpdate);

    socket.emit("get-status");

    return () => {
      socket.off("status-update", handleStatusUpdate);
      socket.off("time-update", handleTimeUpdate);
    };
  }, [socket, playlist, deviceId, tapped, currentTime]);

  const handleTimeChange = () => {
    if (audio.current && deviceId !== socket?.id) audio.current.pause();
  };

  useEffect(() => {
    audio.current?.addEventListener("timeupdate", handleTimeChange);

    return () => {
      audio.current?.removeEventListener("timeupdate", handleTimeChange);
    };
  }, [audio, deviceId, socket]);

  // Next song function
  const nextSong = () => {
    if (queue.length) {
      const nextSong = queue[0];
      handleChangeSong(nextSong);
    }
  };

  // Previous song function
  const previousSong = () => {
    if (!audio.current) return;
    if (audio.current.currentTime > 5) {
      audio.current.currentTime = 0;
    } else {
      if (queue.length) {
        const previousSong = queue[queue.length - 1];
        handleChangeSong(previousSong);
      }
    }
  };

  // Process playlist, remove current song from queue
  const processPlaylist = (playlist: Song[]) => {
    const before = playlist.slice(0, playlist.indexOf(currentSong!));
    const after = playlist.slice(playlist.indexOf(currentSong!) + 1);
    return [...after, ...before];
  };

  const prevValues = usePrevious({ currentSong, shuffle, playlist });

  // When playlist is changed, update queue
  useEffect(() => {
    if (prevValues?.shuffle !== shuffle) return;
    setQueue(playlist);
  }, [playlist, shuffle]);

  // When current song is changed, make it src of audio and all this kind of stuff
  useEffect(() => {
    if (currentSong === prevValues?.currentSong) return;

    const device =
      deviceId && devices.find((d) => d.id === deviceId)
        ? deviceId
        : socket?.id;
    socket?.emit("set-status", {
      status: { song: currentSong?.id, device },
    });
    setAvailable(false);

    if (device === socket?.id) {
      if (!currentSong || !audio.current) return;
      audio.current.src = `${BACKEND_URL}/songs/${currentSong.file}`;
      audio.current.play();
    } else {
      audio.current?.pause();
    }
    setCurrentTime(0);
    setPaused(false);

    if (shuffle) {
      setQueue(processPlaylist([...queue, prevValues!.currentSong!]));
    } else {
      setQueue(processPlaylist(playlist));
    }
  }, [currentSong, shuffle, playlist, queue, socket, deviceId]);

  // Every second update current time
  useEffect(() => {
    const interval = setInterval(() => {
      if (deviceId === socket?.id) {
        !tapped && setCurrentTime(audio.current?.currentTime || 0);
        socket.emit("set-time", {
          control: false,
          time: audio.current?.currentTime || 0,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSong, tapped, audio, deviceId, socket]);

  // On song end
  const handleEnd = () => {
    if (!audio.current) return;
    if (repeat) {
      audio.current.currentTime = 0;
      audio.current.play();
    } else {
      nextSong();
    }
  };

  // Adds even listeners to audio
  useEffect(() => {
    audio.current?.addEventListener("ended", handleEnd);

    return () => audio.current?.removeEventListener("ended", handleEnd);
  }, [audio, repeat, queue]);

  // When paused state is changed, update audio
  useEffect(() => {
    if (!audio.current) return;
    if (paused) {
      audio.current.pause();
    } else {
      audio.current.play();
    }
  }, [paused]);

  // When song is changed, update background image with nice transition
  useEffect(() => {
    setInTransition(true);
    setTimeout(() => {
      setInTransition(false);
    }, 550);
  }, [lastSong]);

  const handleProgressUp = () => {
    if (!audio.current) return;
    setTapped(false);
    if (deviceId === socket?.id) {
      audio.current.currentTime = currentTime;
      audio.current.play();
    } else {
      socket?.emit("set-time", {
        control: true,
        time: currentTime,
      });
    }
    setPaused(false);
  };

  // When volume is changed, update audio
  useEffect(() => {
    if (!audio.current) return;
    audio.current.volume = volume;
  }, [volume]);

  const updatePaused = (paused: boolean) => {
    setPaused(paused);
    if (!socket) return;

    console.log("Emitting pause");
    socket.emit("set-status", {
      status: {
        paused,
      },
    });
  };

  // When shuffle is changed, we need to update the queue
  useEffect(() => {
    if (currentSong !== prevValues?.currentSong) return;
    if (!shuffle) setQueue(processPlaylist(playlist));
    else
      setQueue(
        [...playlist]
          .sort(() => Math.random() - 0.5)
          .filter((e) => e !== currentSong)
      );
  }, [shuffle, currentSong]);

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
            alt={currentSong.title}
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
              onClick={() => updatePaused(!paused)}
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

        <div className="playlist-header-icons">
          <div
            className="playlist-header-icon"
            onClick={() => setCastOpened(true)}
          >
            <FiCast />
          </div>
          <div
            className="playlist-header-icon"
            onClick={() => setInsightsOpened(true)}
          >
            <FiList />
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
            handleProgressDown={handleProgressUp}
            paused={paused}
            repeat={repeat}
            setRepeat={setRepeat}
            setTapped={setTapped}
            setPaused={setPaused}
            setCurrentTime={setCurrentTime}
            tapped={tapped}
            shuffle={shuffle}
            setShuffle={setShuffle}
            volume={volume}
            setVolume={setVolume}
            nextSong={nextSong}
            previousSong={previousSong}
          />
        )}
        <div className={`player-slider ${queueOpened ? "" : "switched"}`}>
          <div className="player-slider-item">
            <Queue queue={queue} onSelect={handleChangeSong} />
          </div>

          <div className="player-slider-item">
            <Lyrics
              currentSong={currentSong}
              audio={audio}
              currentTime={currentTime}
              deviceId={deviceId}
            />
          </div>
        </div>
        <div className="player-buttons">
          <button
            onClick={() => setQueueOpened(true)}
            className={queueOpened ? "active" : ""}
          >
            Queue
          </button>
          <button
            onClick={() => setQueueOpened(false)}
            className={queueOpened ? "" : "active"}
          >
            Lyrics
          </button>
        </div>
      </div>

      <SongInsights
        currentSong={currentSong}
        opened={insightsOpened}
        onClose={() => setInsightsOpened(false)}
      />

      <DeviceCast
        onClose={() => setCastOpened(false)}
        opened={castOpened}
        devices={devices}
        setDevices={setDevices}
        deviceId={deviceId}
      />
    </div>
  );
};

export default Player;
