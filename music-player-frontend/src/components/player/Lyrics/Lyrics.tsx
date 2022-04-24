import React, { useEffect } from "react";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { useQuery } from "react-query";
import { getLyrics, Song } from "../../../api/songs";
import { SocketContext } from "../../../App";
import "./lyrics.scss";

interface LyricsProps {
  currentSong?: Song;
  audio: React.RefObject<HTMLAudioElement | null>;
  deviceId: string;
  currentTime: number;
}

const Lyrics: React.FC<LyricsProps> = ({
  currentSong,
  audio,
  deviceId,
  currentTime,
}) => {
  const { data: lyrics, isLoading } = useQuery(
    ["lyrics", currentSong?.id],
    () => getLyrics(currentSong!.id),
    {
      enabled: currentSong !== undefined,
    }
  );

  const [latency, setLatency] = React.useState(0);

  const lyricsRef = React.useRef<(HTMLDivElement | null)[]>([]);
  const lyricsWrapperRef = React.useRef<HTMLDivElement | null>(null);
  const socket = React.useContext(SocketContext);

  const [currentLyricsIndex, setCurrentLyricsIndex] = React.useState(0);

  useEffect(() => {
    const scrollTop = lyricsRef.current[currentLyricsIndex]?.offsetTop;
    if (!scrollTop) return;
    lyricsWrapperRef.current?.scrollTo({
      top: scrollTop - 100,
      behavior: "smooth",
    });
  }, [currentLyricsIndex]);

  const getActiveLyrics = (currentTime: number): number => {
    if (!lyrics) return -1;

    for (const i in lyrics) {
      const lyric = lyrics[i];
      const nextLyric = lyrics[+i + 1];
      if (
        lyric.time.total <= currentTime &&
        (nextLyric?.time?.total || currentSong?.duration || 0) > currentTime
      ) {
        return +i;
      }
    }

    return -1;
  };

  const onTimeChange = () => {
    if (audio.current) {
      setCurrentLyricsIndex(getActiveLyrics(audio.current.currentTime));
    }
  };

  useEffect(() => {
    if (!audio.current) return;
    if (deviceId !== socket?.id) return;

    audio.current.addEventListener("timeupdate", onTimeChange);

    return () => {
      audio.current?.removeEventListener("timeupdate", onTimeChange);
    };
  }, [lyrics, deviceId, socket]);

  useEffect(() => {
    if (deviceId === socket?.id) return;
    if (!lyrics) return;

    setCurrentLyricsIndex(getActiveLyrics(currentTime - latency / 1000));
  }, [lyrics, currentTime, deviceId, socket]);

  const handleLatency = (obj: { timestamp: number }) =>
    setLatency(Date.now() - obj.timestamp);

  useEffect(() => {
    if (!socket) return;
    const interval = setInterval(() => {
      socket.emit("latency", {
        timestamp: Date.now(),
      });
    }, 5000);

    socket.on("latency", handleLatency);

    return () => {
      clearInterval(interval);
      socket.off("latency", handleLatency);
    };
  }, [socket]);

  useEffect(() => {
    console.log(latency);
  }, [latency]);

  useEffect(() => {
    lyricsWrapperRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [lyrics]);

  if (isLoading) return <div className="lyrics-loading">Loading...</div>;

  if (lyrics)
    return (
      <div className="player-lyrics" ref={lyricsWrapperRef}>
        {lyrics.map((lyric, i) => (
          <div
            key={i}
            ref={(el) => (lyricsRef.current[i] = el)}
            className={`lyrics-line ${
              i === currentLyricsIndex ? "active" : ""
            }`}
          >
            {lyric.text ? lyric.text : <BsMusicNoteBeamed />}
          </div>
        ))}
      </div>
    );

  return (
    <div className="lyrics-laoding">We couldn't find lyrics for this song</div>
  );
};

export default Lyrics;
