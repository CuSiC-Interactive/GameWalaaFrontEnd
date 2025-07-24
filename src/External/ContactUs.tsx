import "./ContactUs.css";

const ContactUs = () => {
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
          <form
            className="contact-form"
            // action="https://formspree.io/f/your-form-id"
            // method="POST"
          >
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
