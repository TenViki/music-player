import "./Button.scss";

interface ButtonProps {
  onClick?: () => void;
  text: string;
  color?: string;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  text,
  color,
  type,
  loading,
  disabled,
}) => {
  return (
    <button
      className="button"
      disabled={loading || disabled}
      style={{ backgroundColor: color }}
      onClick={onClick}
      type={type || "button"}
    >
      {loading ? <div className="button-loader" /> : text}
    </button>
  );
};

export default Button;
