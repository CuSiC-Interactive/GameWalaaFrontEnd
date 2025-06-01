import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../External/Home";
import Catalog from "../External/Catalog";
import About from "../External/About";

const AppRoutes = () => {
  const router = Router;
  console.log(router);
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
