import React from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { UserContext } from "../../App";
import Button from "../../components/button/Button";
import { TokenManager } from "../../utils/tokenmanager";
import "./playlist.scss";
import noData from "../../assets/no_data.svg";
import FilePicker from "../../components/filepicker/FilePicker";
import { useQuery } from "react-query";
import { getPlaylist } from "../../api/songs";
import PlaylistEntry from "../../components/playlist/PlaylistEntry";

const Playlist = () => {
  const { setUser, user } = React.useContext(UserContext);
  const { data: playlist } = useQuery(["playlist", user?.id], getPlaylist, {
    enabled: !!user,
    initialData: [],
  });
  const navigate = useNavigate();

  const [file, setFile] = React.useState<File | null>(null);

  const handleFileSelect = async () => {
    // Open file select dialog window
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "audio/*";
    input.click();

    input.onchange = async () => {
      if (!input.files) return;
      const file = input.files[0];
      if (!file) return;
      setFile(file);

      input.remove();
    };
  };

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
        {!playlist || playlist.length === 0 ? (
          <div className="empty-playlist">
            <img src={noData} alt="" />
            <h2>Your playlist is empty</h2>
            <Button text="Upload a song" onClick={handleFileSelect} />
          </div>
        ) : (
          <>
            {playlist.map((song) => (
              <PlaylistEntry song={song} />
            ))}
            <Button text="Upload a song" onClick={handleFileSelect} />
          </>
        )}
      </div>

      <FilePicker file={file} setFile={setFile} onClose={() => setFile(null)} />
    </div>
  );
};

export default Playlist;
