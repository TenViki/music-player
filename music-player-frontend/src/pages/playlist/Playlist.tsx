import React from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { UserContext } from "../../App";
import Button from "../../components/button/Button";
import { TokenManager } from "../../utils/tokenmanager";

export interface Song {
  id: string;
  coverUrl: string;
  artist: string;
  title: string;
  duration: number;
}

const Playlist = () => {
  const [playlist, setPlaylist] = React.useState<string[]>([]);
  const { user, setUser } = React.useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Your Playlist</h1>
        <Button
          text="Log out"
          onClick={() => {
            setUser(undefined);
            TokenManager.deleteToken();
            navigate("/");
            toast.success("Logged out successfully");
          }}
          color="#c0392b"
        />
      </div>
    </div>
  );
};

export default Playlist;
