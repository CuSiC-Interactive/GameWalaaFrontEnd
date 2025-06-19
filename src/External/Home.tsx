import "./Home.css";

const Home = () => {
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
            <div className="game-item">
              <span className="game-title">Pixel Runner</span>
            </div>
            <div className="game-item">
              <span className="game-title">Space Invaders X</span>
            </div>
            <div className="game-item">
              <span className="game-title">Block Breaker 9000</span>
            </div>
          </div>
        </section>
        {/* About GameWalaa Section */}
      </div>
    </>
  );
};

export default Home;
