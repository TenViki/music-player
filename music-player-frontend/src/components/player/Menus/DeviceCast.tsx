import React from "react";
import SwipeCard from "../../swipecard/SwipeCard";
import "./device-cast.scss";

interface DeviceCastProps {
  opened: boolean;
  onClose: () => void;
}

const DeviceCast: React.FC<DeviceCastProps> = ({ opened, onClose }) => {
  return (
    <SwipeCard opened={opened} onClose={onClose} closePercentage={50}>
      <div className="device-cast">
        <h2 className="title-small">Device Cast</h2>
      </div>
    </SwipeCard>
  );
};

export default DeviceCast;
