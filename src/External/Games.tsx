import { Link } from "react-router-dom";
import "./Games.css";

const Games = () => {
  return (
    <div className="page-container">
      <h1 className="text">Please checkout our latest game.</h1>
      <div className="gameContainer">
        <iframe
          className="gameFrame"
          src="https://arcade.makecode.com/---run?id=S71204-47644-98182-17895"
          sandbox="allow-popups allow-forms allow-scripts allow-same-origin"
          allowFullScreen
        ></iframe>
      </div>
      <Link to="/keepie-uppie" className="playLink">
        ⚽ Play Keepie Uppie
      </Link>
    </div>
  );
};

export default Games;
