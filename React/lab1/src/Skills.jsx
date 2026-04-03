function SkillCategory(props) {
  return (
    <div className="col-md-4 mb-4">
      <h5 className="fw-bold">{props.title}</h5>
      <div className="d-flex flex-wrap gap-2">
        {props.skills.map((skill) => (
          <span key={skill} className="badge bg-secondary fs-6">{skill}</span>
        ))}
      </div>
    </div>
  );
}

function Skills() {
  return (
    <section id="skills" className="py-5 bg-dark text-white">
      <div className="container">
        <h2 className="text-center mb-2 text-uppercase text-secondary" style={{ fontSize: "14px" }}>My Expertise</h2>
        <h3 className="text-center fw-bold mb-5">Skills</h3>
        <div className="row">
          <SkillCategory title="Frontend" skills={["HTML", "CSS", "Bootstrap", "JavaScript", "TypeScript", "Angular", "React"]} />
          <SkillCategory title="Backend" skills={["PHP", "Laravel", "Node.js", "Express.js", "Django", "Flask"]} />
          <SkillCategory title="Database" skills={["SQL", "MySQL", "MongoDB"]} />
          <SkillCategory title="DevOps" skills={["Docker", "AWS", "Linux", "CI/CD", "Git", "GitHub"]} />
          <SkillCategory title="Languages" skills={["Python", "Java", "C++", "C#", "C"]} />
        </div>
      </div>
    </section>
  );
}

export default Skills;