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

const Catalog = () => {
  const [Games, setGames] = useState<gamesModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [konamiCodes, setKonamiCodes] = useState([
    { gameName: "Countra", gameId: "1", konamiCode: "asdfkh123" },
  ]);
  const [paymentReponse, setPaymentReponse] = useState();

  useEffect(() => {
    setKonamiCodes([
      { gameName: "Countra", gameId: "1", konamiCode: "asdfkh123" },
    ]);
  }, []);

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
    // console.log(gameData);
    const price = 1 * 100;
    const timeInMins = gameData.selectedPrice.match(/(\d+)\s*mins/)[1];
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const result = await axios.get(
      `${Constants.baseUrl}/${Constants.fetchOrder}/${price}`
    );
    console.log(result);
    const order_id: number = result.data.details.id;
    const currency: string = result.data.details.currency;
    // const data = {
    //   orderCreationId: "order_R6QeTM4CRlY6O881",
    //   razorpayPaymentId: "pay_R6QepYU4ehG0GM",
    //   razorpayOrderId: "order_R6QeTM4CRlY6O881",
    //   razorpaySignature:
    //     "d09ac8a3f223d4dce22a2f85049413e5249e86768eb8b0d212aeb89990d83bbd",
    // };
    // const date = new Date();
    // const data2 = {
    //   name: gameData.gameName,
    //   gameId: Number(gameData.gameId),
    //   price: 50,
    //   isTimed: true,
    //   levels: 0,
    //   currentTime: date.toISOString(),
    //   played: false,
    //   playTime: Number(timeInMins),
    //   paymentId: "pay_R6QepYU4ehG0GM",
    // };
    // try {
    //   const result = await axios.post(
    //     `${Constants.baseUrl}/${Constants.orderDetails}`,
    //     data
    //   );

    //   // this only runs if the above succeeds
    //   const result2 = await axios.post(
    //     `${Constants.baseUrl}/${Constants.gameStatus}`,
    //     data2
    //   );

    //   console.log("Both succeeded:", result.data, result2.data);
    // } catch (error) {
    //   console.error("Error in first or second API:", error);
    // }

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
          price: 50,
          isTimed: true,
          levels: 0,
          currentTime: date.toISOString(),
          played: false,
          playTime: Number(timeInMins),
          paymentId: response.razorpay_payment_id,
        };

        const result = await axios.post(
          `${Constants.baseUrl}/${Constants.orderDetails}`,
          data
        );

        // this only runs if the above succeeds
        const result2 = await axios.post(
          `${Constants.baseUrl}/${Constants.gameStatus}`,
          data2
        );

        console.log("data", result2);
      },
      theme: {
        color: "#3399cc",
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
