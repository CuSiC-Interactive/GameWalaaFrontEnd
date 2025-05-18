import "./gameTile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

export type GameTileProps = {
  gameName: string;
  gameProfile: string;
  pricesList: {
    value: string;
  }[];
  infoMessage: string;
};

const GameTile = ({
  gameName,
  gameProfile,
  pricesList,
  infoMessage,
}: GameTileProps) => {
  console.log(pricesList);
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
      <div className="info-text">
        <FontAwesomeIcon className="info-icon" icon={faCircleInfo} />
        <span>{infoMessage}</span>
      </div>
      <div className="controls-notch-area">
        <select id="cart-select-notch" aria-placeholder="Select">
          {pricesList.map((x: { value: string }, ind: number) => (
            <option key={`price-option-${x.value}-${ind}`} value={x.value}>
              {x.value}
            </option>
          ))}
        </select>

        <button id="cart-button-notch">Play</button>
      </div>
    </div>
  );
};

export default GameTile;
