import React, { useEffect } from "react";
import { SocketContext } from "../../../App";
import SwipeCard from "../../swipecard/SwipeCard";
import "./device-cast.scss";

interface DeviceCastProps {
  opened: boolean;
  onClose: () => void;
}

interface DeviceType {
  id: string;
  type: string;
  name: string;
}

const DeviceCast: React.FC<DeviceCastProps> = ({ opened, onClose }) => {
  const socket = React.useContext(SocketContext);

  const handleDeviceUpdate = (devices: DeviceType[]) => {
    console.log("Device update: ", devices);
  };

  useEffect(() => {
    if (!socket) return;
    console.log("Registering events");

    socket.on("device-update", handleDeviceUpdate);

    return () => {
      socket.off("device-update", handleDeviceUpdate);
    };
  }, [socket]);

  return (
    <SwipeCard opened={opened} onClose={onClose} closePercentage={50}>
      <div className="device-cast">
        <h2 className="title-small">Device Cast</h2>
      </div>
    </SwipeCard>
  );
};

export default DeviceCast;
