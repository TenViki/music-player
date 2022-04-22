import { Slide, ToastContainer } from "react-toastify";
import Login from "./components/login/Login";
import "./scss/styles.scss";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { TokenManager } from "./utils/tokenmanager";
import { Route, Routes, useNavigate } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { useQuery } from "react-query";
import { meRequest, User } from "./api/auth";

export const UserContext = React.createContext<
  [User | undefined, React.Dispatch<React.SetStateAction<User | undefined>>]
>([undefined, () => {}]);

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
    if (user) navigate("/playlists");
  }, [user]);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <div className="app">
        <ToastContainer
          theme="dark"
          toastStyle={{ borderRadius: ".5rem" }}
          transition={Slide}
        />

        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </UserContext.Provider>
  );
}

export default App;
