import { useEffect, useState } from "react";
import GameTile from "../Components/gameTile";
import FloatingActionButton from "../Components/FloatingActionButton";
import KonamiCodeModal from "../Components/KonamiCodeModal";
import "./Catalog.css";
import axios from "axios";
import Constants from "../Shared/Constants";
import { gamesModel } from "../Shared/Models";
import { loadRazorpayScript } from "../Utils/loadRazorpayScript";
import logo from "/cusic-logo.png";

type KonamiCode = {
  gameName: string;
  gameId: string;
  konamiCode: string;
};

const Catalog = () => {
  const [Games, setGames] = useState<gamesModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [konamiCodes, setKonamiCodes] = useState<KonamiCode[]>([]);

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
      const response = await axios.get(
        `${Constants.baseUrl}/${Constants.games}/?arcadeId=${sessionStorage.getItem('arcade_id')}`
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
    if (!sessionStorage.getItem('arcade_id')) {
      // alert("Arcade ID is missing. Please access the catalog through the arcade QR, or enter the arcade ID below to continue.");
      // return;
      // keep a modal instead of alert, an input box inside it to enter the id.
      // as id is entered, save it to session storage and close the modal
      // repopulate the games list with the new arcade id as well, check if selected game in the list, 
      // if so let user proceed with payment, if not prompt him "Selected game is not available in this arcade".
      // as we proceed for payment, pass the arcade id as query param in saveOrders API
      // when api returns the valid orderId, proceed for the payment via rzrpay and pass arcadeId again in saveGameDetails api.
      // that's it, api will invoke the service to pass the metadata of game to arcade via pub sub (MQTT).
    }

    const result = await axios.get(
        `${Constants.baseUrl}/${Constants.fetchOrder}/${price}?arcadeId=${sessionStorage.getItem('arcade_id')}`
    );

    const order_id: number = result.data.details.id;
    const currency: string = result.data.details.currency;

    const options: any = {
      key: Constants.razorpay_keyId,
      currency: currency,
      name: Constants.razorpay_default,
      order_id: order_id,
      description: `Payment for ${gameData.gameName}`,
      image: logo,
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
        setKonamiCodes([]);
        // this only runs if the above succeeds
        const result = await axios.post(
          `${Constants.baseUrl}/${Constants.gameStatus}`,
          data2
        );

        const konami = {
          gameName: gameData.gameName,
          gameId: gameData.gameId,
          konamiCode: result.data.Code,
        };

        setKonamiCodes((prev) => {
          const updated = [...prev, konami];
          localStorage.setItem("konamiCodes", JSON.stringify(updated));
          return updated;
        });
      },
      theme: {
        color: "#FDD226",
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
