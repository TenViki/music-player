import React from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { UserContext } from "../../App";
import Button from "../../components/button/Button";
import { TokenManager } from "../../utils/tokenmanager";
import "./playlist.scss";
import noData from "../../assets/no_data.svg";

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

      <div className="page-content">
        {playlist.length === 0 ? (
          <div className="empty-playlist">
            <img src={noData} alt="" />
            <h2>Your playlist is empty</h2>
            <Button text="Upload a song" onClick={() => {}} />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Playlist;
