import "./gameTile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";

export type GameTileProps = {
  gameName: string;
  gameProfile: string;
  pricesList: {
    value: string;
  }[];
  infoMessage: string;
  gameId: number;
  handleGamePayment: (gameData: any) => void;
};

const GameTile = ({
  gameName,
  gameProfile,
  pricesList,
  infoMessage,
  gameId,
  handleGamePayment,
}: GameTileProps) => {
  const { register, handleSubmit } = useForm();

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
      <form
        className="controls-notch-area"
        onSubmit={handleSubmit(handleGamePayment)}
      >
        <input type="hidden" value={gameName} {...register("gameName")} />
        <input type="hidden" value={gameId} {...register("gameId")} />
        <select
          id="cart-select-notch"
          {...register("selectedPrice", { required: true })}
        >
          {pricesList.map((x: { value: string }, ind: number) => (
            <option key={`price-option-${x.value}-${ind}`} value={x.value}>
              {x.value}
            </option>
          ))}
        </select>

        <button id="cart-button-notch" type="submit">
          Play
        </button>
      </form>
    </div>
  );
};

export default GameTile;
