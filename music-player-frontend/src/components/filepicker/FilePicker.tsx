import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import { createSong } from "../../api/songs";
import { formatSize, getBase64 } from "../../utils/files";
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
  const [loading, setLoading] = React.useState(false);
  const [statusText, setStatusText] = React.useState("");

  const handleUpload: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    // Convert file buffer to base64
    try {
      setStatusText("Processing...");
      const base64 = await getBase64(file);
      const response = await createSong(
        title,
        artist,
        cover,
        base64,
        (number) => setStatusText(`Uploading... ${number}%`)
      );

      console.log(response.data);
      toast.success("Uploaded successfully");
    } catch (error: any) {
      if (axios.isAxiosError(error)) toast.error(error.response?.data.message);
      else toast.error(error.message);
    }

    setStatusText("");
    setLoading(false);
    onClose();
    setArtist("");
    setTitle("");
    setCover("");
  };

  return (
    <SwipeCard
      opened={file ? true : false}
      onClose={() => setFile(null)}
      closePercentage={20}
    >
      <div className="file-picker">
        <h2>File infomration</h2>
        <form className="file-info" onSubmit={handleUpload}>
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

          <Button
            text={statusText || "Upload"}
            type="submit"
            disabled={loading}
          />
        </form>
      </div>
    </SwipeCard>
  );
};

export default FilePicker;
