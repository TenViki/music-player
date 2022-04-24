import Login from "./pages/login/Login";
import "./scss/styles.scss";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { TokenManager } from "./utils/tokenmanager";
import { Route, Routes, useNavigate } from "react-router";
import { useQuery } from "react-query";
import { meRequest, User } from "./api/auth";
import Playlist from "./pages/playlist/Playlist";
import { io, Socket } from "socket.io-client";
import { getDeviceType } from "./utils/device";

export const UserContext = React.createContext<{
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}>({ user: undefined, setUser: () => {} });

export const SocketContext = React.createContext<Socket | undefined>(undefined);

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();

  const { refetch: refetchUser } = useQuery("user", meRequest, {
    enabled: !!TokenManager.token && !user,
    onSuccess: setUser,
  });

  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    TokenManager.loadToken();
    refetchUser();
  }, []);

  useEffect(() => {
    if (!user) {
      socket?.disconnect();
      setSocket(undefined);
    }
    if (user) navigate("/playlist");

    if (!user || socket?.connected) return;
    const socketObj = io("http://10.0.0.16:5000");

    socketObj.on("auth-success", (data) => {
      console.log("Socket authorized!", data);
      setSocket(socketObj);
    });

    socketObj.emit("auth", { token: TokenManager.token });

    socketObj.on("error", (data) => {
      console.log("Socket error: ", data);
    });
  }, [user, socket]);

  useEffect(() => {
    if (!socket) return;

    // Get system name (for example: "Redmi note 8")
    const deviceAx = navigator?.userAgent?.match(/\(([^)]+)\)/);
    const deviceName = deviceAx?.[1];

    // Get device type (mobile, tablet, desktop)
    const deviceType = getDeviceType();

    socket.emit("register-device", {
      name: deviceName,
      type: deviceType,
    });
  }, [socket]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <SocketContext.Provider value={socket}>
        <div className="app">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/playlist" element={<Playlist />} />
          </Routes>
        </div>
      </SocketContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
