import "./App.css";
import Footer from "./Components/Footer";
import Navbar from "./External/Navbar";
import AppRoutes from "./routes/AppRoutes";
import ReactGA from "react-ga4";
import { BrowserRouter as Router } from "react-router-dom";
import Constants from "./Shared/Constants";

function App() {
  ReactGA.initialize(Constants.googleAnalytics);
  return (
    <div className="app-wrapper">
      <Router>
        <Navbar />
        <div className="app-content">
          <AppRoutes />
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
