import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "../Admin/AdminDashboard";
import Home from "../External/Home";
import Catalog from "../External/Catalog";
import About from "../External/About";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Catalog" element={<Catalog />} />
        <Route path="/About" element={<About />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
