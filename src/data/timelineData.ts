export interface MilestoneItem {
  id: string;
  year: number;
  month: string;
  title: string;
  category: 'hackathon' | 'mentorship' | 'workshop' | 'collaboration' | 'platform';
  description: string;
  venue: string;
  metrics: {
    participants?: string;
    teams?: string;
    sponsors?: string;
    mentees?: string;
  };
  highlights: string[];
  sourceUrl?: string;
  verified: boolean;
  status: 'completed' | 'upcoming';
}

export const TIMELINE_MILESTONES: MilestoneItem[] = [
  {
    id: 'innovortex-1',
    year: 2023,
    month: 'September',
    title: 'InnoVortex Ideathon 2023',
    category: 'hackathon',
    description: 'Inaugural 2-day ideathon at the IGDTUW campus fostering cross-disciplinary innovation in AI, sustainability, and healthcare.',
    venue: 'IGDTUW Campus, Delhi',
    metrics: {
      participants: '150+',
      teams: '42',
      sponsors: 'IGDTUW Incubation Center',
    },
    highlights: [
      'Problem statements tackling urban mobility and green computing',
      'Mentorship sessions with senior engineering leaders',
      'Prize pool distributed to top 3 winning female engineering teams',
    ],
    sourceUrl: 'https://www.techneeds.live/',
    verified: true,
    status: 'completed',
  },
  {
    id: 'mlsa-meetup-2024',
    year: 2024,
    month: 'March',
    title: 'MLSA Meetup: Kickstart with Open Source',
    category: 'workshop',
    description: 'Collaborative deep-dive session in partnership with Microsoft Learn Student Ambassadors focusing on Git, GitHub workflows, and upstream contributing.',
    venue: 'Auditorium, IGDTUW',
    metrics: {
      participants: '80+',
    },
    highlights: [
      'Hands-on Git merge conflict resolution and pull request workflows',
      'Introduction to GirlScript Summer of Code (GSSoC) and Outreachy',
      'Live contribution to open-source student utility repositories',
    ],
    sourceUrl: 'https://www.techneeds.live/',
    verified: true,
    status: 'completed',
  },
  {
    id: 'innovortex-2',
    year: 2024,
    month: 'June',
    title: 'InnoVortex 2.0 Hackathon',
    category: 'hackathon',
    description: 'Expanded 36-hour hackathon edition incorporating dedicated hardware/IoT tracks alongside enterprise web and mobile development.',
    venue: 'IGDTUW Innovation Hall',
    metrics: {
      participants: '200+',
      teams: '56',
      sponsors: 'Student Chapters & Regional Partners',
    },
    highlights: [
      'Dual tracks: Hardware IoT prototypes and Full-Stack web solutions',
      'Live code reviews and sprint checkpoints by tech society alumni',
      'Over 40 working software repositories deployed by demo day',
    ],
    sourceUrl: 'https://www.techneeds.live/',
    verified: true,
    status: 'completed',
  },
  {
    id: 'sssc-freshers-2024',
    year: 2024,
    month: 'August',
    title: 'SSSC Freshers Orientation & Mentorship Cohort',
    category: 'mentorship',
    description: 'Launch of the Society Student Support Cell (SSSC) initiative to guide incoming first-year engineering students through college academics and early career roadmaps.',
    venue: 'IGDTUW Main Campus',
    metrics: {
      participants: '300+',
      mentees: '180+',
    },
    highlights: [
      '1-on-1 mentorship matching between senior students and freshers',
      'Curated learning tracks: Web Development, DSA, and Open Source',
      'Comprehensive campus navigation and tech opportunity guides',
    ],
    sourceUrl: 'https://assetmerkle.vercel.app/',
    verified: true,
    status: 'completed',
  },
  {
    id: 'mlsa-cloud-2024',
    year: 2024,
    month: 'November',
    title: 'MLSA Cloud Architecture & DevOps Webinar',
    category: 'workshop',
    description: 'Interactive webinar exploring Microsoft Azure cloud infrastructure, containerization, and modern serverless application deployments.',
    venue: 'Virtual (Teams & YouTube Live)',
    metrics: {
      participants: '120+',
    },
    highlights: [
      'Live provisioning of Azure App Services and PostgreSQL instances',
      'Automated CI/CD pipeline setup using GitHub Actions',
      'Free Azure student subscription credits distributed to attendees',
    ],
    sourceUrl: 'https://www.techneeds.live/',
    verified: true,
    status: 'completed',
  },
  {
    id: 'sssc-cohort-2-2025',
    year: 2025,
    month: 'February',
    title: 'SSSC Mentorship Round 2: Tech Specialization',
    category: 'mentorship',
    description: 'Second structured cohort of SSSC with specialized tracks in competitive programming, AI/ML fundamentals, and product design.',
    venue: 'IGDTUW Hybrid Campus',
    metrics: {
      mentees: '150+',
      participants: '220+',
    },
    highlights: [
      'Weekly peer-assisted code review sessions and mock contests',
      'Direct resume clinics and portfolio building guidance',
      'Cohort capstone project showcase judged by alumni engineers',
    ],
    sourceUrl: 'https://assetmerkle.vercel.app/',
    verified: true,
    status: 'completed',
  },
  {
    id: 'innovortex-3',
    year: 2025,
    month: 'September',
    title: 'InnoVortex 3.0 at IIIT Delhi',
    category: 'hackathon',
    description: 'Flagship multi-institution inter-college hackathon hosted at IIIT Delhi campus, gathering top collegiate talent across the Delhi NCR region.',
    venue: 'IIIT Delhi Campus & Hybrid',
    metrics: {
      participants: '350+',
      teams: '90+',
      sponsors: '12 Industry Sponsors',
    },
    highlights: [
      'Expanded venue partnership with IIIT Delhi',
      'Sponsorship tiers offering cloud credits and recruitment fast-tracks',
      'High-impact themes in AI safety, decentralized systems, and civic tech',
    ],
    sourceUrl: 'https://www.techneeds.live/',
    verified: true,
    status: 'completed',
  },
  {
    id: 'sssc-interview-prep-2026',
    year: 2026,
    month: 'January',
    title: 'SSSC Technical Interview Prep Sprint',
    category: 'mentorship',
    description: 'Intensive boot camp preparing pre-final and final year women engineers for summer internships and full-time technical assessments.',
    venue: 'IGDTUW Labs & Virtual',
    metrics: {
      participants: '200+',
      mentees: '120+',
    },
    highlights: [
      'System design fundamentals and low-level object modeling',
      'DSA mock interview series with past FAANG interns',
      'Behavioral interview coaching and salary negotiation strategies',
    ],
    sourceUrl: 'https://assetmerkle.vercel.app/',
    verified: true,
    status: 'completed',
  },
  {
    id: 'cs-fundamentals-sprint-2026',
    year: 2026,
    month: 'March',
    title: '21-Day CS Fundamentals Sprint',
    category: 'workshop',
    description: 'Cohort-based daily challenge series covering core computer science subjects: Operating Systems, DBMS, Computer Networks, and OOPS.',
    venue: 'TechNeeds Community Discord & GitHub',
    metrics: {
      participants: '400+',
    },
    highlights: [
      'Daily curated problem sets and conceptual revision sheets',
      'Leaderboard gamification and daily proof-of-work submissions',
      '85% completion rate among registered participants',
    ],
    sourceUrl: 'https://www.techneeds.live/',
    verified: true,
    status: 'completed',
  },
  {
    id: 'innerve-hacks-2026',
    year: 2026,
    month: 'May',
    title: 'INNERve Hacks Technical Track Partner',
    category: 'collaboration',
    description: 'Official technical track curation and problem statement design for IGDTUW\'s annual technical fest INNERve.',
    venue: 'IGDTUW Auditorium & Tech Arena',
    metrics: {
      participants: '500+',
    },
    highlights: [
      'Curated enterprise challenge statements in AI agentic workflows',
      'Live hardware display and interactive IoT demonstration booths',
      'Keynote addresses from leading women technology executives',
    ],
    sourceUrl: 'https://www.techneeds.live/',
    verified: true,
    status: 'completed',
  },
  {
    id: 'git-workshop-2026',
    year: 2026,
    month: 'September',
    title: 'Hands-on Git & Open Source Workshop',
    category: 'workshop',
    description: 'Practical command-line mastery session training 1st and 2nd year students on production Git workflows, rebasing, and open-source hygiene.',
    venue: 'Computer Lab 3, IGDTUW',
    metrics: {
      participants: '180+',
    },
    highlights: [
      'Branching strategies: Gitflow vs trunk-based development',
      'Live merge conflict drills in dedicated sandbox repositories',
      'Interactive Git visualization tools and terminal alias setups',
    ],
    sourceUrl: 'https://www.techneeds.live/',
    verified: true,
    status: 'completed',
  },
  {
    id: 'innovortex-4',
    year: 2026,
    month: 'November',
    title: 'InnoVortex 4.0: Next-Gen Autonomous Systems',
    category: 'hackathon',
    description: 'The premier national iteration of the InnoVortex hackathon series, spotlighting autonomous AI systems, climate tech, and distributed compute.',
    venue: 'Main Campus & Global Virtual Track',
    metrics: {
      participants: '500+ Applicants',
      teams: '120 Finalists',
      sponsors: '15+ Technology Partners',
    },
    highlights: [
      'Multi-track prize pools with dedicated industry mentorship',
      'On-site 24-hour hardware lab and high-performance compute access',
      'Flagship demo day streamed live across student tech communities',
    ],
    sourceUrl: 'https://www.techneeds.live/',
    verified: true,
    status: 'completed',
  },
  {
    id: 'society-growth-network-2026',
    year: 2026,
    month: 'December',
    title: 'Community Network Expansion: 1,200+ Members',
    category: 'collaboration',
    description: 'TechNeeds IGDTUW establishes active technical channels across Discord, WhatsApp, and LinkedIn, connecting current undergraduates with alumni leaders worldwide.',
    venue: 'Global Community Channels',
    metrics: {
      participants: '1,200+ Active Members',
    },
    highlights: [
      'Alumni working at top engineering firms mentoring current undergraduates',
      'Weekly tech discussions, paper readings, and job opportunity boards',
      'Cross-society hackathon team formation networks',
    ],
    sourceUrl: 'https://assetmerkle.vercel.app/',
    verified: true,
    status: 'completed',
  },
  {
    id: 'platform-v2-launch-2026',
    year: 2026,
    month: 'December',
    title: 'TechNeeds Digital Platform V2 Launch',
    category: 'platform',
    description: 'Launch of the modern web platform featuring real-time event registrations, cryptographic QR attendance check-in, community passports, and interactive 3D archives.',
    venue: 'techneeds.live',
    metrics: {
      participants: 'University-wide rollout',
    },
    highlights: [
      'HMAC-SHA256 signed dynamic QR code generation for tamper-proof entry',
      'Real-time organizer ticket scanning and live check-in audits',
      'Persistent WebGL 3D interface showcasing society history and opportunities',
    ],
    sourceUrl: 'https://www.techneeds.live/',
    verified: true,
    status: 'completed',
  },
];
