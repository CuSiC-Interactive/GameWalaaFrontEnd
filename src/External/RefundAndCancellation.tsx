import React from "react";
import "./PolicyPages.css";

const RefundAndCancellation = () => {
  return (
    <div className="policy-page">
      <h1>Refund & Cancellation Policy</h1>
      <ul>
        <li>
          <strong>1. Customer Cancellations:</strong> Full refund for
          cancellations 24+ hours in advance.
        </li>
        <li>
          <strong>2. Late Cancellations:</strong> No refund for cancellations
          within 24 hours of playtime.
        </li>
        <li>
          <strong>3. Refund Processing:</strong> Eligible refunds processed
          within 5–7 business days.
        </li>
        <li>
          <strong>4. Cancellation by GameWalaa:</strong> If we cancel for any
          reason, you’ll get a full refund.
        </li>
        <li>
          <strong>5. Contact:</strong> Reach out at support@gamewalaa.com for
          help.
        </li>
      </ul>
    </div>
  );
};

export default RefundAndCancellation;
