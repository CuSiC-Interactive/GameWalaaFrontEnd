import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../External/Home";
import Catalog from "../External/Catalog";
import About from "../External/About";
import TermsAndConditions from "../External/TermsAndConditons";
import RefundPolicy from "../External/PrivacyPolicy";

const AppRoutes = () => {
  const router = Router;
  console.log(router);
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Catalog" element={<Catalog />} />
        <Route path="/About" element={<About />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<RefundPolicy />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
