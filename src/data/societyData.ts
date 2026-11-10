export interface Department {
  id: string;
  name: string;
  codename: string;
  description: string;
  focusAreas: string[];
  leadRole: string;
  icon: string;
}

export interface Initiative {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  status: 'ACTIVE' | 'UPCOMING' | 'FLAGSHIP';
  metrics: string;
  tags: string[];
  link: string;
}

export interface StatItem {
  number: string;
  label: string;
  detail: string;
}

export const SOCIETY_STATS: StatItem[] = [
  { number: '1,200+', label: 'Active Members', detail: 'Passionate women engineers & technocrats across batches' },
  { number: '50+', label: 'Mentors & Speakers', detail: 'Industry leaders from top tech firms & academic institutions' },
  { number: '10+', label: 'Flagship Cohorts', detail: 'Structured programs spanning full-stack, AI/ML, and mentorship' },
  { number: '100+', label: 'Workshops & Events', detail: 'Hackathons, coding sprints, webinars, and hands-on boot camps' },
];

export const SOCIETY_DEPARTMENTS: Department[] = [
  {
    id: 'tech',
    name: 'Technical Engineering Wing',
    codename: 'DEV_CORE',
    description: 'The architectural heart of TechNeeds, building internal platforms, mentoring students in full-stack web, mobile, DevOps, and decentralized systems.',
    focusAreas: ['Full-Stack Web (Next.js/React)', 'Autonomous AI & Agents', 'Cloud Systems & Kubernetes', 'Open Source Upstreaming'],
    leadRole: 'Technical Lead & Engineering Mentors',
    icon: 'Terminal',
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning Cell',
    codename: 'INTELLIGENCE_LAB',
    description: 'Explores cutting-edge deep learning, LLMs, computer vision, and predictive modeling with real-world research and community workshops.',
    focusAreas: ['Applied Machine Learning', 'Natural Language Processing', 'Deep Learning Architectures', 'Kaggle & Hackathon Sprints'],
    leadRole: 'AI/ML Lead & Research Fellows',
    icon: 'Cpu',
  },
  {
    id: 'sssc',
    name: 'Society Student Support Cell',
    codename: 'SSSC_CADRE',
    description: 'Dedicated student mentorship wing pairing freshers with seasoned seniors for academic navigation, internship prep, and technical roadmaps.',
    focusAreas: ['Freshers Guidance & Onboarding', 'DSA & System Design Sprints', 'Resume Clinics & Mock Interviews', 'Peer-to-Peer Cohorts'],
    leadRole: 'SSSC Coordinators & Senior Mentors',
    icon: 'Shield',
  },
  {
    id: 'creative',
    name: 'Design & Visual Systems',
    codename: 'VISUAL_STUDIO',
    description: 'Crafts the sensory identity of TechNeeds, merging brutalist editorial aesthetics, 3D spatial web design, and interactive motion typography.',
    focusAreas: ['WebGL & 3D Interaction', 'Brand Systems & Typography', 'Editorial UI/UX Prototyping', 'Cinematic Motion Graphics'],
    leadRole: 'Creative Director & Design Leads',
    icon: 'Sparkles',
  },
  {
    id: 'corporate',
    name: 'Corporate Relations & Outreach',
    codename: 'PARTNERSHIP_GRID',
    description: 'Drives strategic alliances with industry sponsors, developer ecosystems, hackathon sponsors, and inter-university networks.',
    focusAreas: ['Industry Sponsorships', 'Hackathon Logistics & Venue', 'Speaker Relations', 'Community Partnerships'],
    leadRole: 'Head of Corporate Affairs',
    icon: 'Network',
  },
];

export const SOCIETY_INITIATIVES: Initiative[] = [
  {
    id: 'innovortex',
    title: 'InnoVortex Hackathon',
    subtitle: 'National Collegiate Innovation Arena',
    description: 'Our annual flagship hackathon challenging university students across India to build transformative solutions in AI, Climate Tech, and Enterprise software.',
    status: 'FLAGSHIP',
    metrics: '4 Editions · 1,200+ Participants · ₹2.5L+ Prize Pool',
    tags: ['Hackathon', 'Innovation', 'Cross-College', 'Hardware & Web'],
    link: '/timeline#innovortex',
  },
  {
    id: 'sssc-mentorship',
    title: 'SSSC Mentorship Cohort',
    subtitle: 'Peer-to-Peer Engineering Catalyst',
    description: 'A structured 12-week fellowship matching freshers and sophomores with pre-final and final-year mentors for roadmap execution and interview prep.',
    status: 'ACTIVE',
    metrics: '300+ Mentees Guided · 95% Placement & Internship Conversion',
    tags: ['Mentorship', 'DSA', 'Interview Prep', 'Career Roadmaps'],
    link: '/initiatives#sssc',
  },
  {
    id: 'cs-sprint',
    title: '21-Day CS Fundamentals Sprint',
    subtitle: 'Core Engineering Rigor',
    description: 'Intensive daily challenge series breaking down Operating Systems, Database Management Systems, Networks, and Low-Level System Design.',
    status: 'ACTIVE',
    metrics: '400+ Active Daily Coders · 85% Completion Rate',
    tags: ['Academics', 'Core CS', 'Daily Sprints', 'Peer Review'],
    link: '/initiatives#cs-sprint',
  },
  {
    id: 'open-source-drive',
    title: 'Open Source Kickstart & GSSoC',
    subtitle: 'Codebase Contribution Cohort',
    description: 'Guided open-source pathway teaching git hygiene, architectural exploration, and first pull request submissions to global repositories.',
    status: 'UPCOMING',
    metrics: '80+ First-Time PRs Merged · GSSoC & Hacktoberfest Top Rankers',
    tags: ['Open Source', 'Git', 'GitHub', 'Community'],
    link: '/initiatives#open-source',
  },
];

export const FAQS = [
  {
    q: 'Who can join TechNeeds IGDTUW?',
    a: 'Any enrolled student of Indira Gandhi Delhi Technical University for Women (IGDTUW) across all branches (CSE, IT, ECE, AI/ML, MAE, Architecture) is eligible to join recruitment drives and community cohorts.',
  },
  {
    q: 'Do I need prior coding experience to join?',
    a: 'Not at all. Our SSSC (Society Student Support Cell) offers beginner tracks specifically designed for freshers with zero prior programming experience to build strong fundamentals.',
  },
  {
    q: 'How does the event check-in system work?',
    a: 'Registered members receive a cryptographic, HMAC-signed dynamic QR ticket in their dashboard. Organizers scan and verify attendance on-site using the platform scanner.',
  },
  {
    q: 'How can external organizations partner with TechNeeds?',
    a: 'Organizations can collaborate through hackathon sponsorships, guest speaker sessions, recruitment pipelines, and technical workshops by contacting our Corporate Relations wing.',
  },
];
