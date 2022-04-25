import React, { useEffect } from "react";
import { FiTrash } from "react-icons/fi";
import { deleteSong } from "../../api/songs";
import { usePrevious } from "../../utils/usePrevious";
import "./playlist-entry-wrapper.scss";

interface PlaylistEntryWrapperProps {
  children: React.ReactNode;
  close: number;
  setClosed: (closed: number) => void;
  index: number;
  songId: string;
}

const PlaylistEntryWrapper: React.FC<PlaylistEntryWrapperProps> = ({
  children,
  close,
  setClosed,
  index,
  songId,
}) => {
  const [currentX, setCurrentX] = React.useState(0);
  const [originX, setOriginX] = React.useState(0);
  const [opened, setOpened] = React.useState(false);
  const [draggingSelf, setDraggingSelf] = React.useState(false);

  useEffect(() => {
    if (index !== close) setOpened(false);
  }, [close]);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setOriginX("touches" in e ? e.touches[0].clientX : e.clientX);
    setCurrentX("touches" in e ? e.touches[0].clientX : e.clientX);
    setDraggingSelf(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!draggingSelf) return;

    setCurrentX("touches" in e ? e.touches[0].clientX : e.clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!opened && currentX - originX > 64) {
      setClosed(index);
      setOpened(true);
    }
    if (opened && currentX - originX < -64) setOpened(false);

    setDraggingSelf(false);
  };

  return (
    <div className={`playlist-entry-wrapper`}>
      <div
        className={`plalist-entry-delete ${draggingSelf ? "dragging" : ""} ${
          opened ? "opened" : ""
        }`}
        onClick={() => deleteSong(songId)}
        style={
          draggingSelf || opened
            ? {
                opacity: opened
                  ? 1 - (originX - currentX) / 64
                  : (currentX - originX - 32) / 64,
              }
            : {}
        }
      >
        <FiTrash />
      </div>
      <div
        style={
          {
            "--transformBy": opened
              ? Math.min(0, Math.max(-64 - 16, currentX - originX))
              : Math.max(0, Math.min(64 + 16, currentX - originX)),
          } as React.CSSProperties
        }
        className={`playlist-entry-content ${draggingSelf ? "dragging" : ""} ${
          Math.abs(currentX - originX) < 16 ? "clickable" : ""
        } ${opened ? "opened" : ""}`}
        onTouchStart={handleTouchStart}
        onMouseDown={handleTouchStart}
        onTouchMove={handleTouchMove}
        onMouseMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseUp={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
};

export default PlaylistEntryWrapper;
