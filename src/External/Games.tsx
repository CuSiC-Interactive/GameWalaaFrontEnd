// src/pages/PlayRetro.tsx or wherever you're rendering
import React from "react";
import OnlineGames from "../Components/OnlineGames";

const Games = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Play Retro Games</h1>
      <OnlineGames />
    </div>
  );
};

export default Games;
