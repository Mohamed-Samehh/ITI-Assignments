function About() {
  return (
    <section id="about" className="py-5">
      <div className="container">
        <h2 className="text-center mb-2 text-uppercase text-secondary" style={{ fontSize: "14px" }}>About Me</h2>
        <h3 className="text-center fw-bold mb-4">Who am I?</h3>
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <p>
              As a software engineer in the tech industry, I have established knowledge and
              capabilities in software development as a full-stack developer. I have further
              developed my technical competence through academic education and hands-on
              projects in various environments.
            </p>
            <p>
              I consider myself flexible and client-oriented, with an analytical and creative
              approach to problem-solving. I am ready to add value to both independent endeavors
              and teams within dynamic company environments.
            </p>
            <a
              href="https://mohamed-samehh.netlify.app/assets/Mohamed-Sameh-CV.pdf"
              className="btn btn-dark mt-2"
              download
            >
              Download CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;