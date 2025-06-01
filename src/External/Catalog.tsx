import { useEffect, useState } from "react";
import GameTile from "../Components/gameTile";
import FloatingActionButton from "../Components/FloatingActionButton";
import KonamiCodeModal from "../Components/KonamiCodeModal";
import "./Catalog.css";
import axios from "axios";
import Constants from "../Shared/Constants";
import { gamesModel } from "../Shared/Models";
import loadBoltScript from "../Utils/loadBoltScript";
import { generatePayUHash } from "../Utils/generatePayUHash";

const Catalog = () => {
  const [Games, setGames] = useState<gamesModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [konamiCodes, setKonamiCodes] = useState([
    { gameName: "Countra", gameId: "1", konamiCode: "asdfkh123" },
  ]);

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
    const selectedPrice = gameData.selectedPrice;
    const match = selectedPrice.match(/₹(\d+)/);
    const price = match ? parseInt(match[1]) : null;

    // load payu sdk
    const boltLoaded = await loadBoltScript();
    if (!boltLoaded) {
      alert("PayU SDK failed to load.");
      return;
    }

    const tnxid = `txn_${Date.now()}`;
    const amount = price?.toString();
    const productInfo = gameData.gameName;
    const firstName = "TestUser";
    const email = "test@gmail.com";

    const hash = generatePayUHash(
      "gtKFFx",
      tnxid,
      amount || "0",
      productInfo,
      firstName,
      email,
      "eCwWELxi"
    );

    const payuPayload = {
      key: "gtKFFx",
      tnxid,
      amount,
      firstName,
      email,
      phone: "9999999999",
      productInfo,
      surl: "http://localhost:3000/success", // success route
      furl: "http://localhost:3000/failure", // failure route
      hash,
    };

    window.bolt.launch(payuPayload, {
      responseHandler: function (response: any) {
        console.log("Payment Response:", response);
        if (response.response.txnStatus === "SUCCESS") {
          // Optionally update backend
          alert("Payment Successful!");
        } else {
          alert("Payment Failed.");
        }
      },
      catchException: function (e: any) {
        console.error(e);
        alert("Payment Exception");
      },
    });
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
