import { useEffect, useState } from "react";
import GameTile from "../Components/gameTile";
import FloatingActionButton from "../Components/FloatingActionButton";
import KonamiCodeModal from "../Components/KonamiCodeModal";
import "./Catalog.css";
import axios from "axios";
import Constants from "../Shared/Constants";
import {
  gamesModel,
  GamePaymentData,
  GamePrice,
  PriceByLevel,
  PriceByTime,
} from "../Shared/Models";
import { loadRazorpayScript } from "../Utils/loadRazorpayScript";
import logo from "/cusic-logo.png";
import Modal from "../Components/Modal";

type KonamiCode = {
  gameName: string;
  gameId: string;
  konamiCode: string;
};

const Catalog = () => {
  const [Games, setGames] = useState<gamesModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [konamiCodes, setKonamiCodes] = useState<KonamiCode[]>([]);
  const [showArcadeIdModal, setShowArcadeIdModal] = useState(false);
  

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const arcadeId = params.get('arcade_id');

    if (arcadeId) {
      sessionStorage.setItem('arcade_id', arcadeId);
    }

    fetchGames();

    const savedCodes = localStorage.getItem("konamiCodes");
    if (savedCodes) {
      try {
        const parsedCodes = JSON.parse(savedCodes);
        if (Array.isArray(parsedCodes)) {
          setKonamiCodes(parsedCodes);
        }
      } catch (error) {
        console.error("Failed to parse konamiCodes from localStorage", error);
      }
    }
  }, []);

  const fetchGames = async () => {
    try {
      if(sessionStorage.getItem("arcade_id") !== null) {
      const response = await axios.get(
        `${Constants.baseUrl}/${Constants.games}?id=${sessionStorage.getItem("arcade_id")}`
      );
      setGames(response.data.games);
    }
    else {
      const response = await axios.get(
        `${Constants.baseUrl}/${Constants.games}?id=`
      );
      setGames(response.data.games);
    }    
    } catch (error) {
      // Previously swallowed silently, which left the catalog blank with no
      // clue why. Surface it at least in the console.
      console.error("Failed to fetch games catalogue", error);
    }
  };

  // if that game is not there in the arcade list stop the payment

  const normalizePrices = (price: GamePrice) => {
    if (price.ByLevel) {
      return price.ByLevel.map((p: PriceByLevel) => ({
        value: `${p.Level} Levels - ₹${p.Price}`,
        Based: "Level",
      }));
    } else if (price.ByTime) {
      return price.ByTime.map((p: PriceByTime) => ({
        value: `${p.Time} mins - ₹${p.Price}`,
        Based: "Time",
      }));
    }
    return [];
  };

  const handleSubmit = (arcadeId?: string) => {console.log("Arcade ID submitted:", arcadeId);

      if(arcadeId) {
        sessionStorage.setItem('arcade_id', arcadeId);
        fetchGames();
      }
    }

  const handleGamePayment = async (gameData: GamePaymentData) => {
    // The `!` keeps the existing behaviour: if the label does not match, this
    // throws rather than passing NaN on to the payment call. See note about
    // level-based prices in normalizePrices.
    const gamePrice = Number(gameData.selectedPrice.match(/₹\s*(\d+)/)![1]);
    const timeInMins = Number(gameData.selectedPrice.match(/(\d+)\s*mins/)![1]);

    const arcadeId = sessionStorage.getItem('arcade_id');

    if (arcadeId === null) {
      setShowArcadeIdModal(true);
    }

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const price = gamePrice * 100;

    const result = await axios.get(
      `${Constants.baseUrl}/${Constants.fetchOrder}/${sessionStorage.getItem('arcade_id')}/${price}`
    );

    const order_id: number = result.data.details.id;
    const currency: string = result.data.details.currency;

    const options: RazorpayOptions = {
      key: Constants.razorpay_keyId,
      currency: currency,
      name: Constants.razorpay_default,
      order_id: order_id,
      description: `Payment for ${gameData.gameName}`,
      image: logo,

      handler: async (response) => {
        const date = new Date();
        const data = {
          paymentDetails: {
            orderCreationId: order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          },
          gameStatus:{
            arcadeId: sessionStorage.getItem('arcade_id'),
            name: gameData.gameName,
            gameId: Number(gameData.gameId),
            price: gamePrice,
            isTimed: true,
            levels: 0,
            currentTime: date.toISOString(),
            played: false,
            playTime: timeInMins,
            paymentId: response.razorpay_payment_id,
          }
        };

        await axios.post(
          `${Constants.baseUrl}/${Constants.orderDetails}`,
          data
        );
        setKonamiCodes([]);
      },
      theme: {
        color: "#FDD226",
      },
    };

    new window.Razorpay(options).open();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="game-catalog-page">
      <div className="physical-arcade-info">
        <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
        Below listed games are for our physical arcades only. Please scan the QR code at the arcade to access the catalog and play the games.</div>
      <div className="catalog-container">
        {Games.map((x) => (
          <div className="game-tile" key={x.GameId}>
            <GameTile
              gameId={x.GameId}
              gameName={x.Name}
              gameProfile={x.Thumbnail}
              pricesList={normalizePrices(x.Price)}
              infoMessage={
                x.Price.ByLevel
                  ? "Prices are based on levels. Please select."
                  : "Prices are based on time. Please select."
              }
              handleGamePayment={handleGamePayment}
            />
          </div>
        ))}
      </div>
        <Modal
      isOpen={showArcadeIdModal}
      onClose={() => setShowArcadeIdModal(false)}
      onSubmit={handleSubmit}
      title="Enter Arcade ID"
      children={"Arcade ID is missing. Please access the catalog through the arcade QR, or enter the arcade ID below to continue."}
      showInput={true}
    ></Modal>
      <KonamiCodeModal
        codes={konamiCodes}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      ></KonamiCodeModal>

      <FloatingActionButton
        onClick={handleOpenModal}
        count={konamiCodes.length}
      />
    </div>
  );
};

export default Catalog;
