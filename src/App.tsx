import "./App.css";
import Footer from "./Components/Footer";
import Navbar from "./External/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
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
