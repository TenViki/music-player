import React, { useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiLoader } from "react-icons/fi";
import { SocketContext } from "../../../App";
import SwipeCard from "../../swipecard/SwipeCard";
import Device from "./Device";
import "./device-cast.scss";

interface DeviceCastProps {
  opened: boolean;
  onClose: () => void;
  devices: DeviceType[];
  setDevices: (devices: DeviceType[]) => void;
  deviceId: string;
}

export interface DeviceType {
  id: string;
  type: string;
  name: string;
}

const DeviceCast: React.FC<DeviceCastProps> = ({
  opened,
  onClose,
  devices,
  deviceId,
}) => {
  const socket = React.useContext(SocketContext);

  const handleSelectDevice = (device: DeviceType) => {
    socket?.emit("set-status", { status: { device: device.id } });
  };

  return (
    <SwipeCard
      opened={opened}
      onClose={onClose}
      closePercentage={20}
      fullheight
    >
      <div className="device-cast">
        <h2 className="title-small">Device Cast</h2>
        <div className="devices">
          {devices.map((device) => (
            <Device
              key={device.id}
              device={device}
              socketId={socket?.id || ""}
              onSelect={handleSelectDevice}
              activeDevice={deviceId}
            />
          ))}
        </div>

        <div className="device-cast-footer">
          <AiOutlineLoading3Quarters />
          Looking for other devices...
        </div>
      </div>
    </SwipeCard>
  );
};

export default DeviceCast;
