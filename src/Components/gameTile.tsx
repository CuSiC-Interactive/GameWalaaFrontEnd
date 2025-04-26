import "./gameTile.css";
import gameImage from "../Images/game.jpg";
import { image } from "framer-motion/m";

export type GameTileProps = {
  gameName: string;
  gameProfile: string;
  pricesList: any;
};

const GameTile = ({ gameName, gameProfile, pricesList }: GameTileProps) => {
  return (
    <div className="game-cartridge">
      <div className="cartridge-top-cutout"></div>
      <div className="cartridge-top">
        <span className="brand-text">{gameName}</span>
      </div>
      <div className="label-area">
        <div className="label-sticker">
          <div className="sticker-main">
            <img
              src={gameProfile}
              alt="Main Content Image"
              className="main-image"
            />
          </div>
        </div>
      </div>
      <div className="cartridge-bottom-notch"></div>
      <div className="controls-notch-area">
        <select id="cart-select-notch">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
        <button id="cart-button-notch">Play</button>
      </div>
    </div>
  );
};

export default GameTile;
