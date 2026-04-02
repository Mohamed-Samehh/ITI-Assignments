function Contact() {
  return (
    <section id="contact" className="py-5 bg-dark text-white">
      <div className="container text-center">
        <h2 className="text-uppercase text-secondary mb-2" style={{ fontSize: "14px" }}>Get in Touch</h2>
        <h3 className="fw-bold mb-4">Let's Work Together</h3>
        <p className="col-md-6 mx-auto mb-5">
          I'm interested in freelance opportunities and open to full-time positions.
          If you have a project that needs coding or a team that needs a developer, feel free to contact me.
        </p>
        <div className="row justify-content-center g-4">
          <div className="col-md-3">
            <i className="fas fa-envelope fs-2 mb-2"></i>
            <p>mohamed.kholy2011@gmail.com</p>
          </div>
          <div className="col-md-3">
            <i className="fas fa-phone fs-2 mb-2"></i>
            <p>+20 1123870300</p>
          </div>
          <div className="col-md-3">
            <i className="fas fa-map-marker-alt fs-2 mb-2"></i>
            <p>Cairo, Egypt</p>
          </div>
        </div>
        <div className="mt-4 fs-3">
          <a href="https://github.com/mohamed-samehh" className="text-white me-3"><i className="fab fa-github"></i></a>
          <a href="https://linkedin.com" className="text-white me-3"><i className="fab fa-linkedin"></i></a>
          <a href="https://twitter.com" className="text-white me-3"><i className="fab fa-twitter"></i></a>
        </div>
      </div>
    </section>
  );
}

export default Contact;