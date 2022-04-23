import React from "react";
import Button from "../button/Button";
import SwipeCard from "../swipecard/SwipeCard";
import Textfield from "../textfield/Textfield";

interface FilePickerProps {
  file: File | null;
  setFile: (file: File | null) => void;
  onClose: () => void;
}

const FilePicker: React.FC<FilePickerProps> = ({ file, onClose, setFile }) => {
  return (
    <SwipeCard
      opened={file ? true : false}
      onClose={() => {}}
      closePercentage={50}
    >
      <div className="file-picker">
        <h2>File infomration</h2>
        <div className="file-info">
          <div className="file-info-line">
            File name: <span>{file ? file.name : "No file selected"}</span>
          </div>
          <div className="file-info-line">
            File size: <span>{file ? file.size : 0}</span>
          </div>

          <Textfield
            value=""
            placeholder="Enter artist"
            label="Artist"
            onChange={() => {}}
          />

          <Textfield
            value=""
            placeholder="Enter cover URL"
            label="Cover URL"
            onChange={() => {}}
          />

          <Button text="Upload" onClick={() => setFile(null)} />
        </div>
      </div>
    </SwipeCard>
  );
};

export default FilePicker;
