// ─────────────────────────────────────────────────────────────
//  MENTOR DATA — edit this file to add / change mentors.
//  To add a mentor: copy one { ... } block, paste it below,
//  and change the details. Photos go in:  public/mentors/
// ─────────────────────────────────────────────────────────────

export type Mentor = {
  id: string;
  name: string;
  branch: string;
  year: string;
  role: string; // short title shown on the card, e.g. "Full-Stack Mentor"
  tagline: string;
  photo: string; // real photo, e.g. "/mentors/ananya.jpg"
  avatar?: string; // 3D / cartoon avatar. Leave out to auto-generate one.
  strengths: string[];
  weaknesses: string[]; // shown as "Currently levelling up"
  techStack: string[];
  expertise: { area: string; level: number }[]; // level: 0 to 100
  advantages: string[];
  achievements: string[];
  hackathons: string[];
  projects: { name: string; description: string; link?: string }[];
  internships: { company: string; role: string; period: string }[];
  links: { label: string; url: string }[]; // GitHub, LeetCode, LinkedIn...
  interests: string[];
  mentorsIn: string[];
};

// SAMPLE DATA — replace with your real mentors before going live.
export const mentors: Mentor[] = [
  {
    id: "mentor-1",
    name: "Aadhya Verma",
    branch: "CSE core",
    year: "3rd Year",
    role: "Full-Stack Mentor",
    tagline: "Turning ideas into shipped products, one commit at a time.",
    photo: "/mentors/mentor-1.jpg",
    // avatar: "/mentors/mentor-1-avatar.png",
    strengths: ["System design", "React & Next.js", "Debugging under pressure"],
    weaknesses: ["Competitive programming speed", "DevOps pipelines"],
    techStack: ["Next.js", "TypeScript", "Tailwind", "Node.js", "Supabase", "Git"],
    expertise: [
      { area: "Frontend", level: 92 },
      { area: "Backend", level: 78 },
      { area: "UI / UX", level: 70 },
      { area: "DSA", level: 65 },
    ],
    advantages: [
      "Explains concepts with real project examples",
      "Quick code reviews with clear feedback",
      "Available for weekly 1:1 sessions",
    ],
    achievements: ["Google Developer Student Club core member", "Top 5% on LeetCode contests"],
    hackathons: ["Smart India Hackathon 2025 – Finalist", "HackIGDTUW 2025 – Winner"],
    projects: [
      { name: "CampusConnect", description: "Event and club management platform for colleges." },
      { name: "StudyBuddy AI", description: "AI-powered notes summariser for students." },
    ],
    internships: [{ company: "Tech Startup Pvt. Ltd.", role: "Frontend Intern", period: "May – Jul 2026" }],
    links: [
      { label: "GitHub", url: "https://github.com/" },
      { label: "LeetCode", url: "https://leetcode.com/" },
      { label: "LinkedIn", url: "https://www.linkedin.com/" },
    ],
    interests: ["Open source", "UI animation", "Hackathons"],
    mentorsIn: ["Web development", "Git & GitHub", "Hackathon prep", "Portfolio building"],
  },
  {
    id: "mentor-2",
    name: "Charushi",
    branch: "IT",
    year: "3th Year",
    role: "AI / ML Mentor",
    tagline: "Making machine learning less magical and more practical.",
    photo: "/mentors/mentor-2.jpg",
    strengths: ["Python", "Machine learning", "Data visualisation"],
    weaknesses: ["Mobile development", "CSS layouts"],
    techStack: ["Python", "PyTorch", "scikit-learn", "Pandas", "FastAPI", "SQL"],
    expertise: [
      { area: "Machine Learning", level: 90 },
      { area: "Data Analysis", level: 85 },
      { area: "Backend APIs", level: 72 },
      { area: "DSA", level: 80 },
    ],
    advantages: [
      "Step-by-step roadmaps for beginners",
      "Strong research and paper-reading guidance",
      "Patient with first-time coders",
    ],
    achievements: ["Research paper accepted at a national conference", "Kaggle Expert"],
    hackathons: ["Microsoft Imagine Cup 2025 – Regional Finalist"],
    projects: [
      { name: "CropCare", description: "Plant disease detection from leaf images." },
      { name: "SentiScope", description: "Real-time sentiment analysis dashboard." },
    ],
    internships: [{ company: "Analytics Firm", role: "ML Intern", period: "Jun – Aug 2025" }],
    links: [
      { label: "GitHub", url: "https://github.com/" },
      { label: "Kaggle", url: "https://www.kaggle.com/" },
      { label: "LinkedIn", url: "https://www.linkedin.com/" },
    ],
    interests: ["Research", "Data storytelling", "Chess"],
    mentorsIn: ["Python basics", "Intro to ML", "Kaggle competitions", "Research papers"],
  },
];
