import React, { useEffect } from "react";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { useQuery } from "react-query";
import { getLyrics, Song } from "../../../api/songs";
import "./lyrics.scss";

interface LyricsProps {
  currentSong?: Song;
  audio: React.RefObject<HTMLAudioElement | null>;
}

const Lyrics: React.FC<LyricsProps> = ({ currentSong, audio }) => {
  const { data: lyrics, isLoading } = useQuery(
    ["lyrics", currentSong?.id],
    () => getLyrics(currentSong!.id),
    {
      enabled: currentSong !== undefined,
    }
  );

  const lyricsRef = React.useRef<(HTMLDivElement | null)[]>([]);
  const lyricsWrapperRef = React.useRef<HTMLDivElement | null>(null);

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
        nextLyric.time.total > currentTime
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

    audio.current.addEventListener("timeupdate", onTimeChange);
    lyricsWrapperRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    return () => {
      audio.current!.removeEventListener("timeupdate", onTimeChange);
    };
  }, [audio, lyrics]);

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
