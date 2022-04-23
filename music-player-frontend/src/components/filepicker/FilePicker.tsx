import React from "react";

interface FilePickerProps {
  file: File | null;
  setFile: (file: File | null) => void;
  onClose: () => void;
}

const FilePicker: React.FC<FilePickerProps> = ({ file, onClose, setFile }) => {
  return <div>FilePicker</div>;
};

export default FilePicker;
