import React from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getPlaylist, Song } from "../../api/songs";
import { UserContext } from "../../App";
import noData from "../../assets/no_data.svg";
import Button from "../../components/button/Button";
import SongSearch from "../../components/filepicker/SongSearch";
import Player from "../../components/player/Player";
import PlaylistEntry from "../../components/playlist/PlaylistEntry";
import { TokenManager } from "../../utils/tokenmanager";
import "./playlist.scss";

const Playlist = () => {
  const { setUser, user } = React.useContext(UserContext);
  const { data: playlist } = useQuery(["playlist", user?.id], getPlaylist, {
    enabled: !!user,
    initialData: [],
  });
  const navigate = useNavigate();

  const [songSelectionOpened, setSongSelectionOpened] = React.useState(false);
  const [currentSong, setCurrentSong] = React.useState<Song | undefined>(
    undefined
  );
  const [lastSong, setLastSong] = React.useState<Song | undefined>(undefined);

  const handleChangeSong = (song: Song) => {
    setLastSong(currentSong);
    setTimeout(() => setCurrentSong(song), 10);
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
            <Button
              text="Add a song"
              onClick={() => setSongSelectionOpened(true)}
            />
          </div>
        ) : (
          <>
            {playlist.map((song) => (
              <PlaylistEntry
                song={song}
                key={song.id}
                onSelect={setCurrentSong}
              />
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

      <Player
        playlist={playlist || []}
        currentSong={currentSong}
        handleChangeSong={handleChangeSong}
        lastSong={lastSong}
      />
    </div>
  );
};

export default Playlist;
