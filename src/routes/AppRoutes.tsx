import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import ReactGA from "react-ga4";
import Home from "../External/Home";
import Catalog from "../External/Catalog";
import About from "../External/About";
import TermsAndConditions from "../External/TermsAndConditons";
import RefundPolicy from "../External/PrivacyPolicy";
import ContactUs from "../External/ContactUs";
import { useEffect } from "react";
import Games from "../External/Games";
import Shop from "../External/shop/Shop";

const AppRoutes = () => {
  const router = Router;
  console.log(router);

  const location = useLocation();
  useEffect(() => {
    ReactGA.send({
      hitType: "pageView",
      page: location.pathname + location.search,
    });
  }, [location]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Catalog" element={<Catalog />} />
        <Route path="/About" element={<About />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<RefundPolicy />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/games" element={<Games />} />
        <Route path="/shop" element={<Shop/>}/>
      </Routes>
    </>
  );
};

export default AppRoutes;
