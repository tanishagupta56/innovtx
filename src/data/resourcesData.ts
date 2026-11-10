export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'Programming' | 'DSA' | 'Web Development' | 'AI/ML' | 'Open Source' | 'CS Fundamentals' | 'Developer Tools' | 'Career';
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export const VERIFIED_RESOURCES: ResourceItem[] = [
  {
    id: 'cs-os-guide',
    title: 'Operating Systems & Concurrency Architecture',
    description: 'Comprehensive lecture notes on CPU scheduling algorithms, virtual memory paging, multithreading synchronization, and deadlock avoidance.',
    url: 'https://github.com',
    category: 'CS Fundamentals',
    tags: ['OS', 'Concurrency', 'Memory', 'Processes'],
    difficulty: 'Intermediate',
  },
  {
    id: 'dsa-cpp-stl',
    title: 'Modern C++ STL for Competitive Programming',
    description: 'Deep dive into std::vector, std::map, unordered_set, heaps, segment trees, and asymptotic analysis for collegiate coding contests.',
    url: 'https://github.com',
    category: 'DSA',
    tags: ['C++', 'STL', 'Algorithms', 'LeetCode'],
    difficulty: 'Intermediate',
  },
  {
    id: 'nextjs-fullstack',
    title: 'Production Next.js 14 App Router Blueprint',
    description: 'Production architecture patterns for server components, streaming SSR, Supabase authentication, and Tailwind CSS.',
    url: 'https://nextjs.org/docs',
    category: 'Web Development',
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind'],
    difficulty: 'Intermediate',
  },
  {
    id: 'git-oss-handbook',
    title: 'Git Upstream Mastery & Branch Hygiene',
    description: 'Practical guide to interactive rebasing, writing atomic commits, resolving complex merge conflicts, and contributing to open-source.',
    url: 'https://git-scm.com/book/en/v2',
    category: 'Open Source',
    tags: ['Git', 'GitHub', 'OpenSource', 'CLI'],
    difficulty: 'Beginner',
  },
  {
    id: 'ai-transformers-intro',
    title: 'Transformer Architectures & Attention Mechanisms',
    description: 'Mathematical intuition and PyTorch implementation of self-attention, multi-head attention, encoders, decoders, and LLM fine-tuning.',
    url: 'https://huggingface.co/learn',
    category: 'AI/ML',
    tags: ['AI', 'PyTorch', 'Transformers', 'LLM'],
    difficulty: 'Advanced',
  },
  {
    id: 'dbms-sql-internals',
    title: 'Relational Database Internals & B+ Trees',
    description: 'Storage engines, WAL logs, ACID transactions, isolation levels, index optimization, and query execution plans in PostgreSQL.',
    url: 'https://www.postgresql.org/docs/',
    category: 'CS Fundamentals',
    tags: ['DBMS', 'SQL', 'PostgreSQL', 'Indexing'],
    difficulty: 'Advanced',
  },
  {
    id: 'tech-interview-prep',
    title: 'Software Engineering Technical Interview Playbook',
    description: 'System design cheat sheets, behavioral STAR method answers, resume formatting guidelines, and mock interview checklists.',
    url: 'https://github.com',
    category: 'Career',
    tags: ['Interview', 'SystemDesign', 'Resume', 'FAANG'],
    difficulty: 'Intermediate',
  },
  {
    id: 'docker-containers-lab',
    title: 'Docker Containerization & Dev Environments',
    description: 'Building lean multi-stage Dockerfiles, managing volume persistence, and orchestrating local multi-service networks with Docker Compose.',
    url: 'https://docs.docker.com/',
    category: 'Developer Tools',
    tags: ['Docker', 'DevOps', 'Containers', 'Linux'],
    difficulty: 'Beginner',
  },
];
