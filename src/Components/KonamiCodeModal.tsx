import { useEffect, useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";
import "./KonamiCodeModal.css";

export type KonamiCodeItem = {
  gameName: string;
  gameId: string;
  konamiCode: string;
};

export type KonamiCodeModalProps = {
  codes: KonamiCodeItem[];
  isOpen: boolean;
  onClose: () => void;
};

const KonamiCodeModal = ({ codes, isOpen, onClose }: KonamiCodeModalProps) => {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setCopiedStates({});
  }, [isOpen, codes]);

  const handleCopyCode = (gameId: string, code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopiedStates((prev) => ({ ...prev, [gameId]: true }));
        setTimeout(() => {
          setCopiedStates((prev) => ({ ...prev, [gameId]: false }));
        }, 2000);
      })
      .catch((err) => {
        console.log("Failed copying", err);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Active Games</h2>
        {codes.length === 0 ? (
          <p>No Active games right now. Please buy first!!</p>
        ) : (
          <div className="code-list">
            {codes.map((x) => (
              <div className="code-item" key={x.gameId}>
                <p className="game-title-modal">{x.gameName}</p>
                <div className="code-value-modal-wrapper">
                  <span className="konami-code-modal">{x.konamiCode}</span>
                  <button
                    className={`copy-button-modal ${
                      copiedStates[x.gameId] ? "copied" : ""
                    }`}
                    onClick={() => handleCopyCode(x.gameId, x.konamiCode)}
                  >
                    {copiedStates[x.gameId] ? <FaCheck /> : <FaCopy />}
                  </button>
                </div>
                <p className="code-instructions-modal">
                  Enter the konami code into the arcade machine.
                </p>
              </div>
            ))}
          </div>
        )}
        {/* Close Button (X icon) */}
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default KonamiCodeModal;
