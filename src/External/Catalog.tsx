import { useEffect, useState } from "react";
import GameTile from "../Components/gameTile";
import FloatingActionButton from "../Components/FloatingActionButton";
import KonamiCodeModal from "../Components/KonamiCodeModal";
import "./Catalog.css";
import axios from "axios";
import Constants from "../Shared/Constants";
import { gamesModel } from "../Shared/Models";
import { loadRazorpayScript } from "../Utils/loadRazorpayScript";

const Catalog = () => {
  const [Games, setGames] = useState<gamesModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [konamiCodes, setKonamiCodes] = useState([
    { gameName: "Countra", gameId: "1", konamiCode: "asdfkh123" },
  ]);

  useEffect(() => {
    setKonamiCodes([
      { gameName: "Countra", gameId: "1", konamiCode: "asdfkh123" },
    ]);
  }, []);

  // const Games = [
  //   {
  //     Name: "Super Mario Bros",
  //     Thumbnail:
  //       "https://upload.wikimedia.org/wikipedia/en/0/03/Super_Mario_Bros._box.png",
  //     Price: {
  //       ByTime: [
  //         {
  //           Time: 10,
  //           Price: 50,
  //         },
  //         {
  //           Time: 20,
  //           Price: 100,
  //         },
  //       ],
  //       ByLevel: null,
  //     },
  //     GameId: 2,
  //   },
  //   {
  //     Name: "Super Mario Bros",
  //     Thumbnail:
  //       "https://upload.wikimedia.org/wikipedia/en/0/03/Super_Mario_Bros._box.png",
  //     Price: {
  //       ByTime: [
  //         {
  //           Time: 10,
  //           Price: 50,
  //         },
  //         {
  //           Time: 20,
  //           Price: 100,
  //         },
  //       ],
  //       ByLevel: null,
  //     },
  //     GameId: 2,
  //   },
  //   {
  //     Name: "Super Mario Bros",
  //     Thumbnail:
  //       "https://upload.wikimedia.org/wikipedia/en/0/03/Super_Mario_Bros._box.png",
  //     Price: {
  //       ByTime: [
  //         {
  //           Time: 10,
  //           Price: 50,
  //         },
  //         {
  //           Time: 20,
  //           Price: 100,
  //         },
  //       ],
  //       ByLevel: null,
  //     },
  //     GameId: 2,
  //   },
  // ];

  useEffect(() => {
    fetchGames();
  }, []);

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
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    // Fake order details for frontend testing only
    const options: any = {
      key: "rzp_test_1DP5mmOlF5G5ag", // Replace with your Razorpay test key
      amount: 50000, // Amount in paisa (₹500.00)
      currency: "INR",
      name: "Retro Arcade",
      description: `Payment for ${gameData.gameName}`,
      image: "https://yourdomain.com/logo.png", // optional
      handler: function (response: any) {
        alert("Payment Success! Payment ID: " + response.razorpay_payment_id);
        console.log(response);
        // You can send this ID to backend for verification
      },
      prefill: {
        name: "Anshul Sharma",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
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
        {Games.map(
          (
            x // Use parentheses () or nothing instead of {}
          ) => (
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
          )
        )}
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
