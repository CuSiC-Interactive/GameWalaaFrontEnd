import { icon } from "@fortawesome/fontawesome-svg-core";
import "./FloatingActionButton.css";
import React from "react";

export type FloatingActionButtonProps = {
  onClick: () => void;
  count?: number;
  icon?: React.ReactNode;
};

const FloatingActionButton = ({
  onClick,
  count,
  icon,
}: FloatingActionButtonProps) => {
  return (
    <button className="fab" onClick={onClick}>
      {icon || (
        <span
          className="fab-default-icon"
          role="img"
          aria-label="Gamepad emoji"
        >
          🎮
        </span>
      )}
      {count !== undefined && count > 0 && (
        <span className="fab-badge">{count}</span>
      )}
    </button>
  );
};

export default FloatingActionButton;
