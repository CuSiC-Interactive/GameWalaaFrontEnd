import React from "react";
import "./PolicyPages.css";

const TermsAndConditions = () => {
  return (
    <div className="policy-page">
      <h1>Terms & Conditions</h1>
      <p>
        Welcome to GameWalaa! These terms and conditions outline the rules and
        regulations for using our website.
      </p>
      <ul>
        <li>
          <strong>1. Services:</strong> We offer online retro arcade game
          booking and gameplay experiences.
        </li>
        <li>
          <strong>2. Payments:</strong> All payments are processed securely.
          Confirmation is sent via email/SMS.
        </li>
        <li>
          <strong>3. User Responsibilities:</strong> No abuse, hacks, or illegal
          activity allowed on our platform.
        </li>
        <li>
          <strong>4. IP & Content:</strong> All game assets and content are
          owned by GameWalaa.
        </li>
        <li>
          <strong>5. Changes:</strong> We may update these terms without notice.
          Please check periodically.
        </li>
      </ul>
    </div>
  );
};

export default TermsAndConditions;
