import React, { useEffect } from "react";
import "./swipecard.scss";

interface SwipeCardProps {
  opened: boolean;
  onClose: () => void;
  closePercentage: number;
  children: React.ReactNode;
  fullheight?: boolean;
  hiddenOverflow?: boolean;
  scrollContentRef?: React.RefObject<HTMLDivElement>;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  opened,
  onClose,
  closePercentage,
  children,
  fullheight,
  hiddenOverflow,
  scrollContentRef,
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

  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (cardRef.current?.scrollTop || scrollContentRef?.current?.scrollTop)
      return;

    // If event is touch
    if ("touches" in e) {
      setOriginY(e.touches[0].clientY);
    } else {
      setOriginY(e.clientY);
    }

    setDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dragging) return;

    setCurrentY("touches" in e ? e.touches[0].clientY : e.clientY);

    const moveScore =
      Math.max(currentY - originY, 0) / (cardRef.current?.clientHeight || 1);
    if (belowTreshold !== moveScore > closePercentage / 100) {
      setBelowTreshold(moveScore > closePercentage / 100);
    }
  };

  const onTouchEnd = () => {
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
        className={`swipecard-container ${dragging ? "dragging" : ""} ${
          fullheight ? "fullheight" : ""
        }`}
        ref={cardRef}
        style={
          {
            "--transformBy": Math.max(0, currentY - originY),
            overflow: hiddenOverflow ? "hidden" : "",
          } as React.CSSProperties
        }
      >
        <div className="swipecard-line"></div>
        <div
          className="swipecard-content"
          style={{ overflow: hiddenOverflow ? "hidden" : "" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;
