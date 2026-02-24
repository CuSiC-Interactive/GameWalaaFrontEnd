import React, { useState, ReactNode } from "react";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (arcadeId?: string) => void;
  title?: string;
  showInput?: boolean;
  children?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Arcade Modal",
  showInput = false,
  children,
}) => {
  const [arcadeId, setArcadeId] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(showInput ? arcadeId : undefined);
    }
    setArcadeId("");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">{title}</h2>

        {children}

        {showInput && (
          <input
            type="text"
            className="modal-input"
            placeholder="Enter Arcade ID"
            value={arcadeId}
            onChange={(e) => setArcadeId(e.target.value)}
          />
        )}

        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
