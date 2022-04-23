import React from "react";
import { formatSize } from "../../utils/size";
import Button from "../button/Button";
import SwipeCard from "../swipecard/SwipeCard";
import Textfield from "../textfield/Textfield";
import "./filepicker.scss";

interface FilePickerProps {
  file: File | null;
  setFile: (file: File | null) => void;
  onClose: () => void;
}

const FilePicker: React.FC<FilePickerProps> = ({ file, onClose, setFile }) => {
  const [artist, setArtist] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [cover, setCover] = React.useState("");

  return (
    <SwipeCard
      opened={file ? true : false}
      onClose={() => setFile(null)}
      closePercentage={20}
    >
      <div className="file-picker">
        <h2>File infomration</h2>
        <div className="file-info">
          <div className="file-info-line">
            File name: <span>{file ? file.name : "No file selected"}</span>
          </div>
          <div className="file-info-line">
            File size: <span>{file ? formatSize(file.size) : 0}</span>
          </div>

          <Textfield
            value={title}
            placeholder="Enter song title"
            label="Title"
            onChange={setTitle}
          />

          <Textfield
            value={title}
            placeholder="Enter song title"
            label="Title"
            onChange={setTitle}
          />

          <Textfield
            value={artist}
            placeholder="Enter artist"
            label="Artist"
            onChange={setArtist}
          />

          <Textfield
            value={cover}
            placeholder="Enter cover URL"
            label="Cover URL"
            onChange={setCover}
          />

          <Button text="Upload" onClick={() => setFile(null)} />
        </div>
      </div>
    </SwipeCard>
  );
};

export default FilePicker;
