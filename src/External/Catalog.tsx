import { useEffect, useState } from "react";
import GameTile from "../Components/gameTile";
import "./Catalog.css";
import axios from "axios";
import Constants from "../Shared/Constants";
import { gamesModel } from "../Shared/Models";

const Catalog = () => {
  const [Games, setGames] = useState<gamesModel[]>([]);

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

  return (
    <div className="catalog-container">
      {Games.map((x) => (
        <div className="game-tile" key={x.GameId}>
          <GameTile
            gameName={x.Name}
            gameProfile={x.Thumbnail}
            pricesList={normalizePrices(x.Price)}
            infoMessage={
              x.Price.ByLevel
                ? "Prices are based on levels. Please select."
                : "Prices are based on time. Please select."
            }
          />
        </div>
      ))}
    </div>
  );
};

export default Catalog;
