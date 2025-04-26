import GameTile from "../Components/gameTile";
import "./Catalog.css";

const Catalog = () => {
  const Games = [
    {
      gameName: "Super Mario Bros",
      gamePoster:
        "https://upload.wikimedia.org/wikipedia/en/0/03/Super_Mario_Bros._box.png",
      gamePriceList: "₹1,004",
    },
    {
      gameName: "Tekken 3",
      gamePoster:
        "https://m.media-amazon.com/images/M/MV5BMWJhYjI0MDYtMWM0ZC00NGM1LTkxNzYtYWI3MjI5YTQ0NjgxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      gamePriceList: "₹1,259",
    },
    {
      gameName: "Street Fighter II Turbo",
      gamePoster:
        "https://m.media-amazon.com/images/M/MV5BMjQzOTU0MjAtZGRiMC00NWRjLWI0N2QtOGRjMjZhY2QwMTI4XkEyXkFqcGc@._V1_.jpg",
      gamePriceList: "$58.51",
    },
    {
      gameName: "Tetris",
      gamePoster:
        "https://cdn.displate.com/artwork/270x380/2023-09-17/1aabfd497b3da3db4a5ae605e348b9a7_0141e0849f2c2e61e81d27d1d0ce2d5d.jpg",
      gamePriceList: "$34.34",
    },
    {
      gameName: "Sonic The Hedgehog",
      gamePoster:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo5ckSjAWMkULdsQ9HC31BothtKlaUhhtN5g&s",
      gamePriceList: "₹4,329",
    },
  ];
  return Games.map((x) => (
    <div className="catalog-container">
      <GameTile
        key={x.gameName} // It's good practice to add a unique key when mapping
        gameName={x.gameName}
        gameProfile={x.gamePoster}
        pricesList={x.gamePriceList}
      />
    </div>
  ));
};

export default Catalog;
