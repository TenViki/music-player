import Login from "./pages/login/Login";
import "./scss/styles.scss";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { TokenManager } from "./utils/tokenmanager";
import { Route, Routes, useNavigate } from "react-router";
import { useQuery } from "react-query";
import { meRequest, User } from "./api/auth";
import Playlist from "./pages/playlist/Playlist";

export const UserContext = React.createContext<{
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}>({ user: undefined, setUser: () => {} });

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();

  const { refetch: refetchUser } = useQuery("user", meRequest, {
    enabled: !!TokenManager.token,
    onSuccess: setUser,
  });

  useEffect(() => {
    TokenManager.loadToken();
    refetchUser();
  }, []);

  useEffect(() => {
    if (user) navigate("/playlist");
  }, [user]);

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
