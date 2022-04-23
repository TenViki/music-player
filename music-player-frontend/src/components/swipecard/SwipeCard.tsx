import React, { useEffect } from "react";
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
  const [originY, setOriginY] = React.useState(0);
  const [currentY, setCurrentY] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [belowTreshold, setBelowTreshold] = React.useState(false);

  useEffect(() => {
    if (belowTreshold && "vibrate" in window.navigator) {
      window.navigator.vibrate(50);
    }
  }, [belowTreshold]);

  const handleOverlayClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.target as HTMLDivElement;
    if (target.classList.contains("swipecard-overlay")) {
      onClose();
    }
  };

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    console.log(cardRef.current?.scrollTop);
    if (cardRef.current?.scrollTop) return;
    setOriginY(e.touches[0].clientY);
    setDragging(true);
  };

  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!dragging) return;
    setCurrentY(e.touches[0].clientY);

    const moveScore =
      Math.max(currentY - originY, 0) / (cardRef.current?.clientHeight || 1);
    if (belowTreshold !== moveScore > closePercentage / 100) {
      setBelowTreshold(moveScore > closePercentage / 100);
    }
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!dragging) return;
    setOriginY(0);
    setCurrentY(0);
    setDragging(false);

    const moveScore =
      Math.max(currentY - originY, 0) / (cardRef.current?.clientHeight || 1);
    if (moveScore > closePercentage / 100) {
      onClose();
    }
  };

  return (
    <div
      className={`swipecard-overlay ${opened ? "active" : ""}`}
      onClick={handleOverlayClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className={`swipecard-container ${dragging ? "dragging" : ""}`}
        ref={cardRef}
        style={
          {
            "--transformBy": Math.max(0, currentY - originY),
          } as React.CSSProperties
        }
      >
        <div className="swipecard-line"></div>
        <div className="swipecard-content">{children}</div>
      </div>
    </div>
  );
};

export default SwipeCard;
