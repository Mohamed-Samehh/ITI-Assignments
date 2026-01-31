export interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubLink?: string;
  liveLink?: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Experience {
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string;
  logo: string;
}

export interface Education {
  institution: string;
  degree: string;
  duration: string;
  logo: string;
}

export interface Certification {
  title: string;
  issuer: string;
  issueDate: string;
  badgeUrl: string;
  certificateUrl: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  cvUrl: string;
}
