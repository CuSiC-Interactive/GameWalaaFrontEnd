const loadBoltScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (document.getElementById("bolt-script")) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "bolt-script";
    script.src = "https://sboxcheckout-static.citruspay.com/bolt/run/bolt.min.js";
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

export default loadBoltScript;
