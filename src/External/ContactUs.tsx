import "./ContactUs.css";

const ContactUs = () => {
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xpwlvnlp", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        alert("Your message has been sent successfully! 🎉");
        form.reset();
      } else {
        alert("Oops! Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Network error. Please try again later.");
    }
  };

  return (
    <>
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-text">
            <h2>
              <span className="emoji">🕹️</span>
              {""}
              <span className="title-glow">Game On, Anytime!</span>
            </h2>
            <p className="sub-text">
              Want to book our arcade for a private event?
            </p>
            <p className="sub-text fade-in">
              Whatever’s on your mind — hit us up!
              <br />
              We’re just one message away from making it awesome.
            </p>
          </div>
          <form className="contact-form" onSubmit={(e) => handleSubmit(e)}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
            ></input>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
            ></input>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              required
            ></input>
            <textarea
              name="message"
              placeholder="Your Message"
              required
            ></textarea>
            <button>Send Message 🚀</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
