import React from "react";
import { DeviceType } from "./DeviceCast";
import {
  AiOutlineDesktop,
  AiOutlineMobile,
  AiOutlineTablet,
} from "react-icons/ai";

interface DeviceCastProps {
  device: DeviceType;
  socketId: string;
  onSelect: (device: DeviceType) => void;
}

const Device: React.FC<DeviceCastProps> = ({ device, socketId, onSelect }) => {
  return (
    <div className="device" onClick={() => onSelect(device)}>
      <div className="device-icon">
        {device.type === "desktop" && <AiOutlineDesktop />}
        {device.type === "tablet" && <AiOutlineTablet />}
        {device.type === "mobile" && <AiOutlineMobile />}
      </div>

      <div className="device-info">
        <div className="device-type">
          {device.type.charAt(0).toUpperCase() + device.type.slice(1)}
          {device.id === socketId && <span className="device-id"> (You)</span>}
        </div>
        <div className="device-name">{device.name}</div>
      </div>
    </div>
  );
};

export default Device;
