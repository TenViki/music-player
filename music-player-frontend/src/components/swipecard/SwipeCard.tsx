import React from "react";
import "./swipecard.scss";

interface SwipeCardProps {
  opened: boolean;
  onClose: () => void;
  closePercentage: number;
  children: React.ReactNode;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  opened,
  onClose,
  closePercentage,
  children,
}) => {
  const handleOverlayClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.target as HTMLDivElement;
    if (target.classList.contains("swipecard-overlay")) {
      onClose();
    }
  };

  return (
    <div
      className={`swipecard-overlay ${opened ? "active" : ""}`}
      onClick={handleOverlayClick}
    >
      <div className="swipecard-container">
        <div className="swipecard-line"></div>
        <div className="swipecard-content">{children}</div>
      </div>
    </div>
  );
};

export default SwipeCard;
