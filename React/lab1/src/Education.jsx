function EducationCard(props) {
  return (
    <div className="col-md-4 text-center mb-4">
      <img src={props.logo} alt={props.school} height="60" className="mb-3" />
      <h5 className="fw-bold">{props.school}</h5>
      <p className="text-muted mb-1">{props.degree}</p>
      <small className="text-secondary">{props.years}</small>
    </div>
  );
}

function Education() {
  return (
    <section id="education" className="py-5">
      <div className="container">
        <h2 className="text-center mb-2 text-uppercase text-secondary" style={{ fontSize: "14px" }}>Background</h2>
        <h3 className="text-center fw-bold mb-5">Education</h3>
        <div className="row justify-content-center">
          <EducationCard
            logo="https://mohamed-samehh.netlify.app/assets/ITI.png"
            school="Information Technology Institute (ITI)"
            degree="Open Source Application Development (9-Month Program)"
            years="Oct 2025 – Jul 2026"
          />
          <EducationCard
            logo="https://mohamed-samehh.netlify.app/assets/BUE.png"
            school="The British University in Egypt"
            degree="Bachelor's in Informatics and Computer Science"
            years="2021 – 2025"
          />
          <EducationCard
            logo="https://mohamed-samehh.netlify.app/assets/LSBU.png"
            school="London South Bank University"
            degree="Partner Institution"
            years="2021 – 2025"
          />
        </div>
      </div>
    </section>
  );
}

export default Education;