// portfolio-data.ts
// Simple export of portfolio data as plain objects/arrays (no models, no service)

export const PROJECTS = [
  {
    title: 'Financial Advisor',
    description: 'AI-Powered Financial Advisor',
    technologies: ['Angular', 'Bootstrap', 'Flutter'],
    githubLink: 'https://github.com/Mohamed-Samehh/Financial-Advisor',
    liveLink: '',
  },
  {
    title: 'Spec Recommender',
    description: 'BUE Specialization Recommender',
    technologies: ['React', 'Vite', 'Node.js', 'Express'],
    githubLink: 'https://github.com/Mohamed-Samehh/BUE-Spec-Path',
    liveLink: '',
  },
  {
    title: 'PeerLink-Mobile',
    description: 'Social Media Mobile Application',
    technologies: ['Flutter', 'Laravel', 'MySQL'],
    githubLink: 'https://github.com/Mohamed-Samehh/PeerLink-Mobile',
    liveLink: '',
  },
  {
    title: 'Blog',
    description: 'Backend for Blog Website',
    technologies: ['Laravel', 'MySQL'],
    githubLink: 'https://github.com/Mohamed-Samehh/Blog',
    liveLink: 'https://mohamed-samehh.github.io/Recipe-Finder/',
  },
  {
    title: 'Recipe Finder',
    description: 'Cooking Recipes Website',
    technologies: ['Angular', 'Bootstrap'],
    githubLink: 'https://github.com/Mohamed-Samehh/Recipe-Finder',
    liveLink: '',
  },
];

export const SKILLS = [
  {
    category: 'Frontend Development',
    items: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'TypeScript', 'Angular', 'React'],
  },
  {
    category: 'Backend Development',
    items: ['PHP', 'Laravel', 'Node.js', 'Express.js', 'Flask'],
  },
  {
    category: 'Database & DevOps',
    items: ['SQL', 'MySQL', 'MongoDB', 'Docker', 'AWS', 'Linux', 'Git', 'GitHub'],
  },
  {
    category: 'Programming Languages',
    items: ['Python', 'Java', 'C++', 'C#', 'C'],
  },
  {
    category: 'AI/ML',
    items: ['AI Integration', 'ML Frameworks'],
  },
  {
    category: 'Languages',
    items: ['English (B2)', 'Arabic (Native)'],
  },
];

export const EXPERIENCES = [
  {
    company: 'Mercor',
    position: 'Software Engineer',
    duration: 'June 2025 - November 2025',
    location: 'Mercor (Contract) • Remote',
    description: `Contributed to Amazon's software engineering projects by debugging code, creating unit tests, and enhancing workflows. Set up Docker-based testing environments and documented development processes.`,
    logo: 'https://mohamed-samehh.netlify.app/assets/Mercor.png',
  },
  {
    company: 'Elsewedy Electric',
    position: 'AI Engineer',
    duration: 'August 2025 - September 2025',
    location: 'Elsewedy Electric (Internship) • Cairo, Egypt',
    description: `Developed chatbot systems powered by RAG, delivering AI-driven solutions such as a Document Processor for querying and summarizing documents, an AI Chatbot trained on web-scraped company data, and a Smart Customer Service Chatbot with speech-to-text integration.`,
    logo: 'https://mohamed-samehh.netlify.app/assets/Elsewedy.png',
  },
  {
    company: 'Nafis Technologies',
    position: 'Backend Developer',
    duration: 'July 2024 - September 2024',
    location: 'Nafis Technologies (Internship) • Cairo, Egypt',
    description: `Engaged in hands-on training and development of projects using the Laravel backend framework, gaining comprehensive experience in building robust and scalable web applications.`,
    logo: 'https://mohamed-samehh.netlify.app/assets/Nafis.png',
  },
  {
    company: 'Digis Squared',
    position: 'Frontend Developer',
    duration: 'May 2024 - September 2024',
    location: 'Digis Squared (Internship) • Cairo, Egypt',
    description: `Contributed to the front-end development of 'KATANA', an advanced network performance management platform, using Angular for building responsive and dynamic user interfaces.`,
    logo: 'https://mohamed-samehh.netlify.app/assets/Digis.svg',
  },
];

export const EDUCATION = [
  {
    institution: 'Information Technology Institute (ITI)',
    degree: 'Open Source Application Development (9-Month Program)',
    duration: 'Oct 2025 – Jul 2026',
    logo: 'https://mohamed-samehh.netlify.app/assets/ITI.png',
  },
  {
    institution: 'The British University in Egypt',
    degree: "Bachelor's in Informatics and Computer Science",
    duration: '2021 - 2025',
    logo: 'https://mohamed-samehh.netlify.app/assets/BUE.png',
  },
  {
    institution: 'London South Bank University',
    degree: 'Partner Institution',
    duration: '2021 - 2025',
    logo: 'https://mohamed-samehh.netlify.app/assets/LSBU.png',
  },
];

export const CERTIFICATIONS = [
  {
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services (AWS)',
    issueDate: 'Issued Jan 2026',
    badgeUrl:
      'https://mohamed-samehh.netlify.app/assets/AWS%20Certified%20Cloud%20Practitioner%20Badge.png',
    certificateUrl: 'https://www.credly.com/badges/39548ef7-7ea9-4158-af5e-00b052f83c6f/public_url',
  },
];

export const CONTACT_INFO = {
  email: 'mohamed.kholy2011@gmail.com',
  phone: '+20 1123870300',
  location: 'Cairo, Egypt',
  linkedin: 'https://linkedin.com/in/mohamed-sameh2011',
  github: 'https://github.com/Mohamed-Samehh',
  cvUrl: 'https://mohamed-samehh.netlify.app/assets/Mohamed-Sameh-CV.pdf',
};
