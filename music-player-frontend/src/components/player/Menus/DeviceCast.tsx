import React, { useEffect } from "react";
import { SocketContext } from "../../../App";
import SwipeCard from "../../swipecard/SwipeCard";
import "./device-cast.scss";

interface DeviceCastProps {
  opened: boolean;
  onClose: () => void;
}

const DeviceCast: React.FC<DeviceCastProps> = ({ opened, onClose }) => {
  const socket = React.useContext(SocketContext);
  const handleDeviceConnect = (device: {
    id: string;
    type: string;
    name: string;
  }) => {
    console.log("Device connected: ", device);
  };

  const handleDeviceDisconnect = (device: {
    id: string;
    type: string;
    name: string;
  }) => {
    console.log("Device disconnected: ", device);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("device-connect", handleDeviceConnect);
    socket.on("device-disconnect", handleDeviceDisconnect);

    return () => {
      socket.off("device-connect", handleDeviceConnect);
      socket.off("device-disconnect", handleDeviceDisconnect);
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
