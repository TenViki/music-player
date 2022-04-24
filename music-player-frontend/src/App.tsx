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

export const UserContext = React.createContext<{
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}>({ user: undefined, setUser: () => {} });

export const SocketContext = React.createContext<Socket | undefined>(undefined);

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();

  const { refetch: refetchUser } = useQuery("user", meRequest, {
    enabled: !!TokenManager.token,
    onSuccess: setUser,
  });

  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    TokenManager.loadToken();
    refetchUser();
  }, []);

  useEffect(() => {
    console.log("User updated:", user);
    if (!user) {
      console.log("Disconnecting socket", socket?.id);
      socket?.disconnect();
      setSocket(undefined);
    }
    if (user) navigate("/playlist");

    if (!user || socket?.connected) return;
    const socketObj = io("http://localhost:5000");
    console.log("Conencting with socket");

    socketObj.on("auth-success", (data) => {
      console.log("Socket authorizated!");
      setSocket(socketObj);
    });

    socketObj.emit("auth", { token: TokenManager.token });

    socketObj.on("error", (data) => {
      console.log("Socket error: ", data);
    });
  }, [user, socket]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/playlist" element={<Playlist />} />
        </Routes>
      </div>
    </UserContext.Provider>
  );
}

export default App;
