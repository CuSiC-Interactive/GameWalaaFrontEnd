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
  //     gameName: "Super Mario Bros",
  //     gamePoster:
  //       "https://upload.wikimedia.org/wikipedia/en/0/03/Super_Mario_Bros._box.png",
  //     gamePriceList: ["1004", "200"],
  //   },
  //   {
  //     gameName: "Tekken 3",
  //     gamePoster:
  //       "https://m.media-amazon.com/images/M/MV5BMWJhYjI0MDYtMWM0ZC00NGM1LTkxNzYtYWI3MjI5YTQ0NjgxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
  //     gamePriceList: ["1004", "200"],
  //   },
  //   {
  //     gameName: "Street Fighter II Turbo",
  //     gamePoster:
  //       "https://m.media-amazon.com/images/M/MV5BMjQzOTU0MjAtZGRiMC00NWRjLWI0N2QtOGRjMjZhY2QwMTI4XkEyXkFqcGc@._V1_.jpg",
  //     gamePriceList: ["1004", "200"],
  //   },
  //   {
  //     gameName: "Tetris",
  //     gamePoster:
  //       "https://cdn.displate.com/artwork/270x380/2023-09-17/1aabfd497b3da3db4a5ae605e348b9a7_0141e0849f2c2e61e81d27d1d0ce2d5d.jpg",
  //     gamePriceList: ["1004", "200"],
  //   },
  //   {
  //     gameName: "Sonic The Hedgehog",
  //     gamePoster:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo5ckSjAWMkULdsQ9HC31BothtKlaUhhtN5g&s",
  //     gamePriceList: ["1004", "200"],
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
      }));
    } else if (price.ByTime) {
      return price.ByTime.map((p: any) => ({
        value: `${p.Time} mins - ₹${p.Price}`,
      }));
    }
    return [];
  };

  return (
    <div className="catalog-container">
      {Games.map(
        (
          x // Use parentheses () or nothing instead of {}
        ) => (
          <div className="game-tile" key={x.GameId}>
            <GameTile
              gameName={x.Name}
              gameProfile={x.Thumbnail}
              pricesList={normalizePrices(x.Price)}
            />
          </div>
        )
      )}
    </div>
  );
};

export default Catalog;
