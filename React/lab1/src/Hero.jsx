function Hero() {
  return (
    <section
      id="hero"
      className="bg-dark text-white text-center py-5"
      style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
    >
      <div className="container">
        <p className="text-uppercase text-secondary">Software Engineer</p>
        <h1 className="display-4 fw-bold">Mohamed Sameh Elkholy</h1>
        <div className="mt-4">
          <a href="#projects" className="btn btn-outline-light me-2">View My Work</a>
          <a href="#contact" className="btn btn-light">Get in Touch</a>
        </div>
        {/* Social Icons */}
        <div className="mt-4 fs-4">
          <a href="https://github.com/mohamed-samehh" className="text-white me-3"><i className="fab fa-github"></i></a>
          <a href="https://linkedin.com/in/mohamed-sameh2011" className="text-white me-3"><i className="fab fa-linkedin"></i></a>
          <a href="mailto:mohamed.kholy2011@gmail.com" className="text-white"><i className="fas fa-envelope"></i></a>
        </div>
      </div>
    </section>
  );
}

export default Hero;