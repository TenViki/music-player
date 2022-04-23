import axios from "axios";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { SearchResult, searchSongs } from "../../api/songs";
import { formatSize, getBase64 } from "../../utils/files";
import Button from "../button/Button";
import SwipeCard from "../swipecard/SwipeCard";
import Textfield from "../textfield/Textfield";
import "./song-search.scss";
import SongSearchEntry from "./SongSearchEntry";

interface FilePickerProps {
  opened: boolean;
  onClose: () => void;
}

const SongSearch: React.FC<FilePickerProps> = ({ onClose, opened }) => {
  const [oldSearch, setOldSearch] = React.useState("");
  const [search, setSearch] = React.useState("");

  const [results, setResults] = React.useState<SearchResult[]>([]);

  useEffect(() => {
    // If search is changed, request new songs
    const intervalId = setInterval(async () => {
      if (search !== oldSearch && search !== "") {
        console.log(search, oldSearch);
        setOldSearch(search);
        const songs = await searchSongs(search);
        setResults(songs);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [search, oldSearch]);

  return (
    <SwipeCard
      opened={opened}
      onClose={onClose}
      closePercentage={20}
      fullheight
    >
      <div className="song-search">
        <h2>Add song</h2>

        <Textfield
          placeholder="Search for a song"
          value={search}
          onChange={setSearch}
        />

        <div className="song-search-results">
          {results.map((result) => (
            <SongSearchEntry song={result} />
          ))}
        </div>
      </div>
    </SwipeCard>
  );
};

export default SongSearch;
