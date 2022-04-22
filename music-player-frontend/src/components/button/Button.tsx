import "./Button.scss";

interface ButtonProps {
  onClick: () => void;
  text: string;
  color?: string;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  text,
  color,
  type,
  loading,
}) => {
  return (
    <button
      className="button"
      disabled={loading}
      style={{ backgroundColor: color }}
      onClick={onClick}
      type={type || "button"}
    >
      {loading ? <div className="button-loader" /> : text}
    </button>
  );
};

export default Button;
