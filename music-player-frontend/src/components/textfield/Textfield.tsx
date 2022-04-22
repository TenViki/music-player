import React from "react";
import "./Textfield.scss";

interface TextfieldProps {
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "password" | "email" | "number" | "tel" | "search";
  placeholder: string;
  label: string;
  error?: string;
}

const Textfield: React.FC<TextfieldProps> = ({
  label,
  onChange,
  placeholder,
  type,
  value,
  error,
}) => {
  return (
    <div className={`textfield`}>
      {error && <div className="textfield-error">{error}</div>}
      <div className="textfield-label">{label}</div>
      <input
        className={`textfield-input ${error ? "error" : ""}`}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Textfield;
