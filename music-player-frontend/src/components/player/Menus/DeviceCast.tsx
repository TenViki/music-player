import React, { useEffect } from "react";
import { SocketContext } from "../../../App";
import SwipeCard from "../../swipecard/SwipeCard";
import Device from "./Device";
import "./device-cast.scss";

interface DeviceCastProps {
  opened: boolean;
  onClose: () => void;
  devices: DeviceType[];
  setDevices: (devices: DeviceType[]) => void;
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
}) => {
  const socket = React.useContext(SocketContext);

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
            />
          ))}
        </div>
      </div>
    </SwipeCard>
  );
};

export default DeviceCast;
