export {};

// Minimal ambient typings for the Razorpay checkout script, which is loaded at
// runtime by loadRazorpayScript() and attaches itself to window. These cover
// only the fields this app actually uses, not the full Razorpay SDK surface.
//
// They live inside `declare global` so they can be used anywhere without an
// import, the same way Window itself is available.

declare global {
  /** Payload Razorpay hands back to the success handler. */
  interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }

  /** Options passed when opening the checkout. */
  interface RazorpayOptions {
    key: string;
    currency: string;
    name: string;
    order_id: number;
    description: string;
    image: string;
    handler: (response: RazorpayResponse) => void | Promise<void>;
    theme?: {
      color: string;
    };
  }

  interface RazorpayInstance {
    open: () => void;
  }

  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
