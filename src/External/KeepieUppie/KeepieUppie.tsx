import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import { KeepieUppieGame, POWER_UPS, type HudState, type PopupTone } from "./game";
import "./KeepieUppie.css";

interface Popup {
  id: number;
  text: string;
  tone: PopupTone;
}

const initialHud: HudState = { state: "ready", score: 0, best: 0, combo: 0, powerUp: null };

const KeepieUppie = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<KeepieUppieGame | null>(null);
  const [hud, setHud] = useState<HudState>(initialHud);
  const [popups, setPopups] = useState<Popup[]>([]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let nextId = 0;
    const timers: number[] = [];
    const game = new KeepieUppieGame(mount, {
      onHud: setHud,
      onPopup: (text, tone) => {
        const id = nextId++;
        setPopups((prev) => [...prev.slice(-2), { id, text, tone }]);
        timers.push(window.setTimeout(() => setPopups((prev) => prev.filter((p) => p.id !== id)), 900));
      },
    });
    gameRef.current = game;

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        if (!e.repeat) game.tap();
      }
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      timers.forEach(clearTimeout);
      game.destroy();
      gameRef.current = null;
    };
  }, []);

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    gameRef.current?.tap();
  };

  return (
    <div className="ku-root" onPointerDown={handlePointerDown}>
      <div ref={mountRef} className="ku-canvas" />

      <div className="ku-hud">
        <Link to="/games" className="ku-back" onPointerDown={(e) => e.stopPropagation()}>
          ← Back
        </Link>
        <div className="ku-best">BEST {hud.best}</div>
        {hud.state !== "ready" && <div className="ku-score">{hud.score}</div>}
        {hud.combo >= 2 && hud.state === "playing" && <div className="ku-combo">Perfect streak x{hud.combo}</div>}
        {hud.powerUp && (
          <div className={`ku-power ku-power--${hud.powerUp.kind}`}>
            {POWER_UPS[hud.powerUp.kind].label} BALL · {hud.powerUp.secondsLeft}s
          </div>
        )}
      </div>

      <div className="ku-popups">
        {popups.map((p) => (
          <div key={p.id} className={`ku-popup ku-popup--${p.tone}`}>
            {p.text}
          </div>
        ))}
      </div>

      {hud.state === "ready" && (
        <div className="ku-panel">
          <h1>Keepie Uppie ⚽</h1>
          <p>Tap (or press Space) as the ball drops onto your boot to keep it up.</p>
          <ul>
            <li>
              <span className="ku-dot ku-dot--green" /> Green ring: kick now
            </li>
            <li>
              <span className="ku-dot ku-dot--gold" /> Gold ring: perfect, double points
            </li>
            <li>
              <span className="ku-dot ku-dot--big" /> BIG: huge, floaty, easy
            </li>
            <li>
              <span className="ku-dot ku-dot--small" /> MINI: tiny, fast, triple points
            </li>
          </ul>
          <p className="ku-hint">Bump the ball into an orb to grab a power up.</p>
          <div className="ku-cta">Tap to start</div>
        </div>
      )}

      {hud.state === "over" && (
        <div className="ku-panel">
          <h1>Dropped it!</h1>
          <div className="ku-final">{hud.score}</div>
          <p>{hud.score > 0 && hud.score >= hud.best ? "New best!" : `Best: ${hud.best}`}</p>
          <div className="ku-cta">Tap to play again</div>
        </div>
      )}
    </div>
  );
};

export default KeepieUppie;
