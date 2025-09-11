import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const navigateToGames = () => {
    navigate("/games");
  };
  return (
    <>
      <div className="home-page-container">
        {/* Centered Welcome Section */}
        <section className="hero-section">
          <h1 className="welcome-text">Welcome to ArcadeWala!</h1>
          <p className="tagline">Your Retro Arcade Adventure Starts Here.</p>
        </section>

        {/* Featured Games Section */}
        <section className="featured-games-section">
          <h2>Featured Games</h2>
          <p>Check out some of our most popular retro titles.</p>
          <div className="game-list">
            {/* Replace with your actual game list/components */}
            <div className="game-item" onClick={navigateToGames}>
              <span className="game-title">Bat Basher</span>
            </div>
          </div>
        </section>
        {/* About GameWalaa Section */}
      </div>
    </>
  );
};

export default Home;
