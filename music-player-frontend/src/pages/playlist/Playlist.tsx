import React from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { UserContext } from "../../App";
import Button from "../../components/button/Button";
import { TokenManager } from "../../utils/tokenmanager";
import "./playlist.scss";
import noData from "../../assets/no_data.svg";
import SongSearch from "../../components/filepicker/SongSearch";
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

  const [songSelectionOpened, setSongSelectionOpened] = React.useState(false);

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
            <Button
              text="Add a song"
              onClick={() => setSongSelectionOpened(true)}
            />
          </div>
        ) : (
          <>
            {playlist.map((song) => (
              <PlaylistEntry song={song} />
            ))}
            <Button
              text="Add a song"
              onClick={() => setSongSelectionOpened(true)}
            />
          </>
        )}
      </div>

      <SongSearch
        opened={songSelectionOpened}
        onClose={() => setSongSelectionOpened(false)}
      />
    </div>
  );
};

export default Playlist;
