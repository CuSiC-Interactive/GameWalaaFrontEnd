import "./App.css";
import Navbar from "./External/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <AppRoutes />
      </Router>
    </>
  );
}

export default App;
