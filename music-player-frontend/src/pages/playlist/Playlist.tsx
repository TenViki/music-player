import React, { useEffect } from "react";
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
import { usePrevious } from "../../utils/usePrevious";
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

  const [next, setNext] = React.useState<Song | undefined>(undefined);
  const [available, setAvailable] = React.useState(true);

  const handleChangeSong = (song: Song) => {
    console.log("Setting next song");
    setNext(song);
  };

  const prev = usePrevious({ currentSong });

  useEffect(() => {
    console.info(
      "Current song changed",
      currentSong?.id,
      prev?.currentSong?.id,
      available
    );
    console.log(available, next?.title, currentSong?.title);
    if (
      !available ||
      currentSong !== prev?.currentSong ||
      currentSong?.id === next?.id
    )
      return;
    console.info("SETTING LAST SONG TO", currentSong?.title);
    setLastSong(currentSong);
    setTimeout(() => setCurrentSong(next), 10);
  }, [next, available, currentSong]);

  return (
    <div className="page" style={{ overflow: "auto" }}>
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
          <div className={`playlist ${currentSong ? "active" : ""}`}>
            {playlist.map((song) => (
              <PlaylistEntry
                song={song}
                key={song.id}
                onSelect={handleChangeSong}
              />
            ))}
            <Button
              text="Add a song"
              onClick={() => setSongSelectionOpened(true)}
            />
          </div>
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
        setAvailable={setAvailable}
      />
    </div>
  );
};

export default Playlist;
