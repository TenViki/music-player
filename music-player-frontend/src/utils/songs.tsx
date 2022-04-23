import { BsMusicNoteBeamed } from "react-icons/bs";

export const noData = (
  <div className="no-cover">
    <BsMusicNoteBeamed />
  </div>
);

export const getImageCover = (cover: string) => {
  return cover ? <img src={cover} /> : noData;
};

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;
  return `${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
};
