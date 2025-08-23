import { Link } from "react-router-dom";
import "./Footer.css"; // Make sure the path is correct
import { loadRazorpayScript } from "../Utils/loadRazorpayScript";

const Footer = () => {
  const chaiTreat = async () => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const options: any = {
      key: "rzp_test_1DP5mmOlF5G5ag",
      amount: 50000,
      currency: "INR",
      name: "Chai Pila Do ☕",
      description:
        "💖 Thanks for supporting us! Your tip keeps the games running.",
      image: "https://yourdomain.com/logo.png",
      handler: function (response: any) {
        alert("Payment Success! Payment ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "Anonymous",
        email: "",
        contact: "",
      },
      notes: {
        message: "Support for Retro Arcade",
      },
      theme: {
        color: "#F37254",
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  return (
    <footer className="footer">
      <Link to="/About">About</Link>
      <Link to="/terms-and-conditions">Terms & Conditions</Link>
      <Link to="/privacy-policy">Privacy Policy</Link>
      <span className="chaiTreat" onClick={chaiTreat}>
        Chai Treat
      </span>
    </footer>
  );
};

export default Footer;
