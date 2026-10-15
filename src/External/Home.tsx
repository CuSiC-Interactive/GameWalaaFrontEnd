import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const Home = () => {
  const navigate = useNavigate();
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const navigateToGames = () => {
    navigate("/games");
  };

  const toggleFullscreen = () => {
    const el = gameContainerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      el.requestFullscreen?.();
    }
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
          <p>Check out some of our most popular titles.</p>
          <div className="game-list">
            {/* Replace with your actual game list/components */}
            <div className="game-item" onClick={navigateToGames}>
              <span className="game-title">Bat Basher</span>
            </div>

            <div className="game-embed-card">
              <h3 className="game-embed-title">Bring Your Own Chai</h3>
              <div className="game-embed-container" ref={gameContainerRef}>
                <iframe
                  className="game-embed-frame"
                  src="https://shadowbaby22.github.io/Bring-Your-Own-Chai/"
                  title="Bring Your Own Chai - playable game"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  loading="lazy"
                  allowFullScreen
                ></iframe>
                <button
                  type="button"
                  className="game-embed-fullscreen"
                  onClick={toggleFullscreen}
                  aria-label="Toggle fullscreen"
                  title="Fullscreen"
                >
                  ⛶
                </button>
              </div>
            </div>
          </div>
        </section>
        {/* About GameWalaa Section */}
      </div>
    </>
  );
};

export default Home;
