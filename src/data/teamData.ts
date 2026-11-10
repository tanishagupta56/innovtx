export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  category: 'leadership' | 'faculty' | 'lead' | 'core' | 'alumni';
  bio: string;
  year: number;
  is_alumni: boolean;
  linkedin_url?: string;
  github_url?: string;
}

export const VERIFIED_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'faculty-coordinator',
    name: 'Faculty Advisory Board',
    role: 'Faculty Coordinator & Patron',
    department: 'Department of Computer Science & Engineering',
    category: 'faculty',
    bio: 'Guiding academic synergy, institutional alignment, and university-wide technical initiatives at IGDTUW.',
    year: 2026,
    is_alumni: false,
    linkedin_url: 'https://www.linkedin.com/school/igdtuw-delhi/',
  },
  {
    id: 'vidusi-agarwal',
    name: 'Vidusi Agarwal',
    role: 'Cohort Lead — Web Development',
    department: 'Technical Engineering Wing',
    category: 'lead',
    bio: 'Lead mentor for the Web Development cohort at TechNeeds IGDTUW, guiding dozens of freshers through production frontend architectures and JavaScript fundamentals.',
    year: 2024,
    is_alumni: true,
    linkedin_url: 'https://www.linkedin.com/company/techneeds-igdtuw/',
    github_url: 'https://github.com',
  },
  {
    id: 'shefali-kaushal',
    name: 'Shefali Kaushal',
    role: 'Cohort Lead — DSA in C/C++',
    department: 'SSSC Mentorship Cadre',
    category: 'lead',
    bio: 'Lead mentor for Data Structures and Algorithms in C/C++, orchestrating weekly algorithmic problem-solving sprints and technical interview workshops.',
    year: 2024,
    is_alumni: true,
    linkedin_url: 'https://www.linkedin.com/company/techneeds-igdtuw/',
    github_url: 'https://github.com',
  },
  {
    id: 'president-cadre',
    name: 'Society President & Convener',
    role: 'President // Executive Council',
    department: 'Executive Governance',
    category: 'leadership',
    bio: 'Overseeing cross-departmental operations, external university collaborations, and strategic partnerships for InnoVortex and SSSC programs.',
    year: 2026,
    is_alumni: false,
    linkedin_url: 'https://www.linkedin.com/company/techneeds-igdtuw/',
  },
  {
    id: 'vice-president-tech',
    name: 'Vice President // Technical Operations',
    role: 'Vice President — Engineering',
    department: 'DEV_CORE Technical Wing',
    category: 'leadership',
    bio: 'Directing society web platforms, open-source repositories, and technical tracks across annual hackathons.',
    year: 2026,
    is_alumni: false,
    linkedin_url: 'https://www.linkedin.com/company/techneeds-igdtuw/',
  },
  {
    id: 'sssc-coordinator',
    name: 'Head of Mentorship & Student Support',
    role: 'SSSC Chief Coordinator',
    department: 'SSSC Cadre',
    category: 'lead',
    bio: 'Managing 1-on-1 mentorship pairings, freshers onboarding, resume review clinics, and career roadmap sessions.',
    year: 2026,
    is_alumni: false,
    linkedin_url: 'https://www.linkedin.com/company/techneeds-igdtuw/',
  },
  {
    id: 'corporate-outreach-head',
    name: 'Head of Corporate Relations & PR',
    role: 'Corporate Relations Lead',
    department: 'PARTNERSHIP_GRID',
    category: 'lead',
    bio: 'Managing alliances with corporate sponsors, developer communities, and hackathon judging panels.',
    year: 2026,
    is_alumni: false,
    linkedin_url: 'https://www.linkedin.com/company/techneeds-igdtuw/',
  },
  {
    id: 'creative-visual-lead',
    name: 'Head of Design & Visual Media',
    role: 'Creative Director',
    department: 'VISUAL_STUDIO',
    category: 'lead',
    bio: 'Leading brand identity, UI/UX prototyping, 3D spatial web design, and cinematic media production.',
    year: 2026,
    is_alumni: false,
    linkedin_url: 'https://www.linkedin.com/company/techneeds-igdtuw/',
  },
];
