// src/components/RetroGameEmbed.tsx
import "./OnlineGames.css";

const OnlineGames = () => {
  return (
    <div className="gameContainer">
      <iframe
        className="gameFrame"
        src="https://arcade.makecode.com/---embed?id=S71204-47644-98182-17895"
        frameBorder="0"
        sandbox="allow-popups allow-forms allow-scripts allow-same-origin"
      ></iframe>
    </div>
  );
};

export default OnlineGames;
