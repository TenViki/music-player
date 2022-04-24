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
  activeDevice: string;
}

const Device: React.FC<DeviceCastProps> = ({
  device,
  socketId,
  onSelect,
  activeDevice,
}) => {
  return (
    <div
      className={`device ${activeDevice === device.id ? "active" : ""}`}
      onClick={() => onSelect(device)}
    >
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
      {activeDevice === device.id && (
        <div className={"device-icon-bar"}>
          <span />
          <span />
          <span />
        </div>
      )}
    </div>
  );
};

export default Device;
