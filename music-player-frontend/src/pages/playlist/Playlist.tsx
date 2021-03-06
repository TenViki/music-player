import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getPlaylist, Song } from "../../api/songs";
import { SocketContext, UserContext } from "../../App";
import noData from "../../assets/no_data.svg";
import Button from "../../components/button/Button";
import SongSearch from "../../components/filepicker/SongSearch";
import { DeviceType } from "../../components/player/Menus/DeviceCast";
import Player from "../../components/player/Player";
import PlaylistEntry from "../../components/playlist/PlaylistEntry";
import PlaylistEntryWrapper from "../../components/playlist/PlaylistEntryWrapper";
import { TokenManager } from "../../utils/tokenmanager";
import { usePrevious } from "../../utils/usePrevious";
import "./playlist.scss";

const Playlist = () => {
  const { setUser, user } = React.useContext(UserContext);
  const [playlist, setPlaylist] = React.useState<Song[]>([]);
  useQuery(["playlist", user?.id], getPlaylist, {
    enabled: !!user,
    initialData: [],
    onSuccess: setPlaylist,
  });
  const navigate = useNavigate();
  const [devices, setDevices] = React.useState<DeviceType[]>([]);
  const socket = React.useContext(SocketContext);

  const [dragging, setDragging] = React.useState(-1);

  const [songSelectionOpened, setSongSelectionOpened] = React.useState(false);
  const [currentSong, setCurrentSong] = React.useState<Song | undefined>(
    undefined
  );
  const [lastSong, setLastSong] = React.useState<Song | undefined>(undefined);

  const [next, setNext] = React.useState<Song | undefined>(undefined);
  const [available, setAvailable] = React.useState(true);

  const handleChangeSong = (song: Song | null) => {
    setNext(song || undefined);
  };

  const prev = usePrevious({ currentSong });

  const handleplaylistAdd = (song: Song) => {
    setPlaylist((prev) => [...prev, song]);
  };

  const handlePlaylistRemove = (song: Song) => {
    setPlaylist((prev) => prev.filter((s) => s.id !== song.id));
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("device-update", setDevices);
    socket.on("playlist-add", handleplaylistAdd);
    socket.on("playlist-remove", handlePlaylistRemove);
    socket.emit("get-devices");

    return () => {
      socket.off("device-update", setDevices);
      socket.off("playlist-add", handleplaylistAdd);
      socket.off("playlist-remove", handlePlaylistRemove);
    };
  }, [socket]);

  useEffect(() => {
    if (
      !available ||
      currentSong !== prev?.currentSong ||
      currentSong?.id === next?.id
    )
      return;
    if (!next) socket?.emit("set-status", { status: { song: "" } });
    setLastSong(currentSong);
    setTimeout(() => setCurrentSong(next), 100);
  }, [next, available, currentSong, socket]);

  return (
    <div className="page" style={{ overflowY: "auto" }}>
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
            {playlist.map((song, i) => (
              <PlaylistEntryWrapper
                close={dragging}
                setClosed={setDragging}
                index={i}
                key={song.id}
                songId={song.id}
              >
                <PlaylistEntry song={song} onSelect={handleChangeSong} />
              </PlaylistEntryWrapper>
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

      {devices.length && (
        <Player
          playlist={playlist || []}
          currentSong={currentSong}
          handleChangeSong={handleChangeSong}
          lastSong={lastSong}
          setAvailable={setAvailable}
          devices={devices}
          setDevices={setDevices}
          available={available}
        />
      )}
    </div>
  );
};

export default Playlist;
