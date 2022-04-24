import React from "react";
import { IconType } from "react-icons";
import {
  FiBarChart2,
  FiClock,
  FiDatabase,
  FiFile,
  FiHeadphones,
  FiRadio,
  FiSettings,
} from "react-icons/fi";
import { Song } from "../../../api/songs";
import { formatSize } from "../../../utils/files";
import { formatTime } from "../../../utils/songs";
import SwipeCard from "../../swipecard/SwipeCard";
import "./song-insights.scss";

interface SongInsightsProps {
  currentSong?: Song;
  opened: boolean;
  onClose: () => void;
}

interface InfoGridItemProps {
  label: string;
  value: string | number;
  Icon: IconType;
  width?: number;
}

const InfoGrid: React.FC<InfoGridItemProps> = ({
  label,
  value,
  Icon,
  width,
}) => {
  return (
    <div
      className="info-grid-item"
      style={
        width
          ? {
              gridColumn: `1 / span ${width}`,
            }
          : {}
      }
    >
      <div className="info-grid-item-icon">
        <Icon />
      </div>
      <div className="info-grid-item-text">
        <div className="info-grid-item-label">{label}</div>
        <div className="info-grid-item-value">{value}</div>
      </div>
    </div>
  );
};

const SongInsights: React.FC<SongInsightsProps> = ({
  currentSong,
  onClose,
  opened,
}) => {
  return (
    <SwipeCard opened={opened} onClose={onClose} closePercentage={50}>
      <div className="song-insights">
        <h2 className="title-small">Song insights</h2>

        {currentSong && (
          <div className="info-grid">
            <InfoGrid
              label="Channels"
              value={currentSong.channels}
              Icon={FiHeadphones}
            />

            <InfoGrid
              label="Size"
              value={formatSize(currentSong.size)}
              Icon={FiDatabase}
            />

            <InfoGrid
              label="Duration"
              value={formatTime(currentSong.duration)}
              Icon={FiClock}
            />

            <InfoGrid
              label="Bitrate"
              value={currentSong.bitrate / 1000 + " kbps"}
              Icon={FiRadio}
            />

            <InfoGrid
              label="Sample rate"
              value={currentSong.sampleRate / 1000 + " kHz"}
              Icon={FiBarChart2}
            />

            <InfoGrid
              label="Format"
              value={currentSong.format}
              Icon={FiSettings}
            />

            <InfoGrid
              label="File name"
              width={2}
              value={currentSong.file}
              Icon={FiFile}
            />
          </div>
        )}
      </div>
    </SwipeCard>
  );
};

export default SongInsights;
