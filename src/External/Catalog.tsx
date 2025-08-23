import { useEffect, useState } from "react";
import GameTile from "../Components/gameTile";
import FloatingActionButton from "../Components/FloatingActionButton";
import KonamiCodeModal from "../Components/KonamiCodeModal";
import "./Catalog.css";
import axios from "axios";
import Constants from "../Shared/Constants";
import { gamesModel } from "../Shared/Models";
import { loadRazorpayScript } from "../Utils/loadRazorpayScript";
// import logo from ".../dist/cusic-logo.png";

type KonamiCode = {
  gameName: string;
  gameId: string;
  konamiCode: string;
};

const Catalog = () => {
  const [Games, setGames] = useState<gamesModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [konamiCodes, setKonamiCodes] = useState<KonamiCode[]>([]);
  const [paymentReponse, setPaymentReponse] = useState();

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {});

  const fetchGames = async () => {
    try {
      const response = await axios.get(
        `${Constants.baseUrl}/${Constants.games}`
      );
      setGames(response.data.games);
    } catch (error) {}
  };

  const normalizePrices = (price: any) => {
    if (price.ByLevel) {
      return price.ByLevel.map((p: any) => ({
        value: `${p.Level} Levels - ₹${p.Price}`,
        Based: "Level",
      }));
    } else if (price.ByTime) {
      return price.ByTime.map((p: any) => ({
        value: `${p.Time} mins - ₹${p.Price}`,
        Based: "Time",
      }));
    }
    return [];
  };

  const handleGamePayment = async (gameData: any) => {
    const gamePrice = Number(gameData.selectedPrice.match(/₹\s*(\d+)/)[1]);
    const timeInMins = Number(gameData.selectedPrice.match(/(\d+)\s*mins/)[1]);

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const price = gamePrice * 100;
    const result = await axios.get(
      `${Constants.baseUrl}/${Constants.fetchOrder}/${price}`
    );

    const order_id: number = result.data.details.id;
    const currency: string = result.data.details.currency;

    const options: any = {
      key: Constants.razorpay_keyId,
      currency: currency,
      name: Constants.razorpay_default,
      order_id: order_id,
      description: `Payment for ${gameData.gameName}`,
      // image: logo,
      handler: async (response: any) => {
        const date = new Date();
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        const data2 = {
          name: gameData.gameName,
          gameId: Number(gameData.gameId),
          price: gamePrice,
          isTimed: true,
          levels: 0,
          currentTime: date.toISOString(),
          played: false,
          playTime: timeInMins,
          paymentId: response.razorpay_payment_id,
        };

        await axios.post(
          `${Constants.baseUrl}/${Constants.orderDetails}`,
          data
        );

        // this only runs if the above succeeds
        const result = await axios.post(
          `${Constants.baseUrl}/${Constants.gameStatus}`,
          data2
        );

        const konami = {
          gameName: gameData.gameName,
          gameId: gameData.gameId,
          konamiCode: result.data.code,
        };
        setKonamiCodes((prev) => [...prev, konami]);
      },
      theme: {
        color: "#F37254",
      },
    };

    new (window as any).Razorpay(options).open();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="game-catalog-page">
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
