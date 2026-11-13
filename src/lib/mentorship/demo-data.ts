/**
 * Default Seed Data for Mentorship Demo Mode.
 * Generated dynamically with relative timestamps so deadlines are always realistic.
 */

export function getInitialDemoData() {
  const now = Date.now();
  const in6Hours = new Date(now + 6 * 3600 * 1000).toISOString();
  const in2Days = new Date(now + 2 * 24 * 3600 * 1000).toISOString();
  const in3Days = new Date(now + 3 * 24 * 3600 * 1000).toISOString();
  const in5Days = new Date(now + 5 * 24 * 3600 * 1000).toISOString();
  const past2Days = new Date(now - 2 * 24 * 3600 * 1000).toISOString();
  const past4Days = new Date(now - 4 * 24 * 3600 * 1000).toISOString();

  const programs = [
    {
      id: 'prog-winter-2026',
      title: 'TechNeeds Winter Cohort 2026',
      description: 'Flagship engineering mentorship covering Modern Full-Stack Systems, React/Next.js Architecture, TypeScript, and Scalable Backend Design.',
      tech_tags: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Supabase'],
      start_date: new Date(now - 14 * 24 * 3600 * 1000).toISOString(),
      end_date: new Date(now + 45 * 24 * 3600 * 1000).toISOString(),
      status: 'active',
      created_at: new Date(now - 20 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date(now - 20 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'prog-spring-2027',
      title: 'Applied AI & Systems Engineering 2027',
      description: 'Advanced cohort on LLMs, agentic developer workflows, vector indexing, and high-concurrency microservices.',
      tech_tags: ['Python', 'PyTorch', 'Next.js', 'FastAPI', 'Vector DBs'],
      start_date: new Date(now + 60 * 24 * 3600 * 1000).toISOString(),
      end_date: new Date(now + 120 * 24 * 3600 * 1000).toISOString(),
      status: 'upcoming',
      created_at: new Date(now - 5 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date(now - 5 * 24 * 3600 * 1000).toISOString(),
    },
  ];

  const users = [
    {
      id: 'user-admin-demo',
      name: 'TechNeeds Director',
      role: 'admin',
      email: 'admin.demo@techneeds.live',
      enrollment_no: null,
      password: 'DemoAdmin@2026',
      password_hash: 'DemoAdmin@2026',
      program_ids: [],
      tags: ['Cadre Director', 'System Design'],
      interest_tags: [],
      created_at: new Date(now - 30 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'user-mentor-demo',
      name: 'Vidusi Agarwal',
      role: 'mentor',
      email: 'mentor.demo@techneeds.live',
      enrollment_no: null,
      password: 'DemoMentor@2026',
      password_hash: 'DemoMentor@2026',
      program_ids: ['prog-winter-2026'],
      tags: ['Lead Mentor', 'Full-Stack Systems', 'Cloud'],
      interest_tags: ['Full-Stack Web', 'System Design'],
      created_at: new Date(now - 25 * 24 * 3600 * 1000).toISOString(),
    },
    // Demo mentee
    {
      id: 'user-mentee-demo',
      name: 'Tanisha Gupta',
      role: 'mentee',
      email: 'mentee.demo@techneeds.live',
      enrollment_no: 'TN-2026-DEMO',
      password: 'DemoMentee@2026',
      password_hash: 'DemoMentee@2026',
      program_ids: ['prog-winter-2026'],
      tags: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
      interest_tags: ['Full-Stack Web', 'AI & Machine Learning'],
      avatar_config: {
        preset: 'Cyber Architect',
        accent: '#315EFF',
        seed: 'tanisha-gupta',
      },
      created_at: new Date(now - 12 * 24 * 3600 * 1000).toISOString(),
    },
    // 8 additional cohort mentees for rich leaderboard
    {
      id: 'user-mentee-1',
      name: 'Ananya Sharma',
      role: 'mentee',
      email: 'ananya.sharma@igdtuw.ac.in',
      enrollment_no: 'TN-2026-0101',
      password: 'Password@2026',
      password_hash: 'Password@2026',
      program_ids: ['prog-winter-2026'],
      tags: ['Frontend', 'React', 'WebGL'],
      interest_tags: ['Full-Stack Web', 'System Design'],
      avatar_config: { preset: 'Full-Stack Hacker', accent: '#B8D94C', seed: 'ananya' },
      created_at: new Date(now - 14 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'user-mentee-2',
      name: 'Rhea Kapoor',
      role: 'mentee',
      email: 'rhea.kapoor@igdtuw.ac.in',
      enrollment_no: 'TN-2026-0102',
      password: 'Password@2026',
      password_hash: 'Password@2026',
      program_ids: ['prog-winter-2026'],
      tags: ['Algorithms', 'C++', 'System Design'],
      interest_tags: ['Data Structures & Algorithms', 'System Design'],
      avatar_config: { preset: 'AI Researcher', accent: '#A855F7', seed: 'rhea' },
      created_at: new Date(now - 14 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'user-mentee-3',
      name: 'Sneha Verma',
      role: 'mentee',
      email: 'sneha.verma@igdtuw.ac.in',
      enrollment_no: 'TN-2026-0103',
      password: 'Password@2026',
      password_hash: 'Password@2026',
      program_ids: ['prog-winter-2026'],
      tags: ['TypeScript', 'Node.js', 'PostgreSQL'],
      interest_tags: ['Full-Stack Web', 'Cloud & DevOps'],
      avatar_config: { preset: 'Minimalist Dev', accent: '#00F5FF', seed: 'sneha' },
      created_at: new Date(now - 13 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'user-mentee-4',
      name: 'Kavya Nair',
      role: 'mentee',
      email: 'kavya.nair@igdtuw.ac.in',
      enrollment_no: 'TN-2026-0104',
      password: 'Password@2026',
      password_hash: 'Password@2026',
      program_ids: ['prog-winter-2026'],
      tags: ['Python', 'Data Science', 'AI'],
      interest_tags: ['AI & Machine Learning'],
      avatar_config: { preset: 'AI Researcher', accent: '#EC4899', seed: 'kavya' },
      created_at: new Date(now - 13 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'user-mentee-5',
      name: 'Ishita Singhal',
      role: 'mentee',
      email: 'ishita.singhal@igdtuw.ac.in',
      enrollment_no: 'TN-2026-0105',
      password: 'Password@2026',
      password_hash: 'Password@2026',
      program_ids: ['prog-winter-2026'],
      tags: ['Frontend', 'CSS', 'UI/UX'],
      interest_tags: ['Full-Stack Web'],
      avatar_config: { preset: 'Cyber Architect', accent: '#315EFF', seed: 'ishita' },
      created_at: new Date(now - 12 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'user-mentee-6',
      name: 'Diya Patel',
      role: 'mentee',
      email: 'diya.patel@igdtuw.ac.in',
      enrollment_no: 'TN-2026-0106',
      password: 'Password@2026',
      password_hash: 'Password@2026',
      program_ids: ['prog-winter-2026'],
      tags: ['Backend', 'APIs', 'Docker'],
      interest_tags: ['Cloud & DevOps'],
      avatar_config: { preset: 'Full-Stack Hacker', accent: '#F59E0B', seed: 'diya' },
      created_at: new Date(now - 12 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'user-mentee-7',
      name: 'Pooja Rao',
      role: 'mentee',
      email: 'pooja.rao@igdtuw.ac.in',
      enrollment_no: 'TN-2026-0107',
      password: 'Password@2026',
      password_hash: 'Password@2026',
      program_ids: ['prog-winter-2026'],
      tags: ['Security', 'Linux', 'Networks'],
      interest_tags: ['Cybersecurity'],
      avatar_config: { preset: 'Cyber Architect', accent: '#EF4444', seed: 'pooja' },
      created_at: new Date(now - 11 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'user-mentee-8',
      name: 'Meera Joshi',
      role: 'mentee',
      email: 'meera.joshi@igdtuw.ac.in',
      enrollment_no: 'TN-2026-0108',
      password: 'Password@2026',
      password_hash: 'Password@2026',
      program_ids: ['prog-winter-2026'],
      tags: ['Mobile', 'React Native'],
      interest_tags: ['Mobile Systems'],
      avatar_config: { preset: 'Minimalist Dev', accent: '#10B981', seed: 'meera' },
      created_at: new Date(now - 10 * 24 * 3600 * 1000).toISOString(),
    },
  ];

  const resources = [
    // 1. Quiz: in 6 hours (< 24h red pulse!)
    {
      id: 'res-quiz-1',
      program_id: 'prog-winter-2026',
      type: 'quiz',
      title: 'JavaScript Core & Async Patterns',
      description: 'Timed assessment testing deep mechanics: event loop microtasks, lexical scoping closures, and Promise execution orders.',
      deadline: in6Hours,
      max_score: 50,
      created_by: 'user-mentor-demo',
      created_at: new Date(now - 3 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date(now - 3 * 24 * 3600 * 1000).toISOString(),
      questions: [
        {
          id: 'q1',
          text: 'Which queue has higher priority in the JavaScript Event Loop when call stack clears?',
          options: ['Macrotask Queue (setTimeout)', 'Microtask Queue (Promise.then, queueMicrotask)', 'RequestAnimationFrame Queue', 'I/O Polling Queue'],
          correctAnswer: 1,
          points: 10,
        },
        {
          id: 'q2',
          text: 'What is the output of `typeof (function() {})` in ECMAScript?',
          options: ["'object'", "'function'", "'undefined'", "'prototype'"],
          correctAnswer: 1,
          points: 10,
        },
        {
          id: 'q3',
          text: 'What does `Object.freeze()` prevent compared to `Object.seal()`?',
          options: [
            'Prevents prototype mutation only',
            'Prevents modifying values of existing writable properties',
            'Allows adding new properties but prevents deletion',
            'None of the above',
          ],
          correctAnswer: 1,
          points: 10,
        },
        {
          id: 'q4',
          text: 'How does an arrow function determine its `this` reference?',
          options: [
            'Bound dynamically to the invoking caller',
            'Bound lexically from its enclosing execution context',
            'Always refers to the global object / window',
            'Bound to its own prototype instance',
          ],
          correctAnswer: 1,
          points: 10,
        },
        {
          id: 'q5',
          text: 'What does `Promise.allSettled()` return when one promise rejects?',
          options: [
            'Rejects immediately with the first error',
            'Resolves with an array of objects describing each promise outcome',
            'Returns undefined',
            'Throws an unhandled rejection event',
          ],
          correctAnswer: 1,
          points: 10,
        },
      ],
    },
    // 2. Quiz: in 5 days
    {
      id: 'res-quiz-2',
      program_id: 'prog-winter-2026',
      type: 'quiz',
      title: 'Git & Collaborative Engineering Workflows',
      description: 'Master branch synchronization, rebasing strategies, merge conflict resolution, and atomic commit design.',
      deadline: in5Days,
      max_score: 50,
      created_by: 'user-mentor-demo',
      created_at: new Date(now - 2 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date(now - 2 * 24 * 3600 * 1000).toISOString(),
      questions: [
        {
          id: 'q1',
          text: 'What is the fundamental difference between `git merge` and `git rebase`?',
          options: [
            'Rebase creates a 3-way merge commit; merge does not',
            'Rebase rewrites commit history onto the target tip; merge preserves exact chronological branch topology',
            'Merge is destructive and deletes branches permanently',
            'Rebase can only be used on remote branches',
          ],
          correctAnswer: 1,
          points: 10,
        },
        {
          id: 'q2',
          text: 'Which command safely records staged changes into a temporary stash stack without committing?',
          options: ['git stash push', 'git reset --soft', 'git commit --amend', 'git clean -fd'],
          correctAnswer: 0,
          points: 10,
        },
        {
          id: 'q3',
          text: 'What happens when you run `git reset --soft HEAD~1`?',
          options: [
            'Unstages and deletes all changes from the working directory',
            'Moves HEAD back one commit while keeping modifications staged in the index',
            'Force pushes to remote origin',
            'Reverts the commit with a reverse diff commit',
          ],
          correctAnswer: 1,
          points: 10,
        },
        {
          id: 'q4',
          text: 'What is a "Detached HEAD" state in Git?',
          options: [
            'A corrupt repository requiring re-clone',
            'HEAD points directly to a specific commit hash rather than a named branch reference',
            'A branch that has been deleted on the remote server',
            'A Git rebase conflict error',
          ],
          correctAnswer: 1,
          points: 10,
        },
        {
          id: 'q5',
          text: 'Which command applies a specific commit from another branch into your current branch?',
          options: ['git cherry-pick <commit-hash>', 'git checkout -b <commit>', 'git fetch --all', 'git rebase --onto'],
          correctAnswer: 0,
          points: 10,
        },
      ],
    },
    // 3. Quiz: past deadline (past 2 days)
    {
      id: 'res-quiz-3',
      program_id: 'prog-winter-2026',
      type: 'quiz',
      title: 'React Fundamentals & Component Architecture',
      description: 'Foundations of JSX transpilation, state reconciliation, fiber tree lifecycle, and hook purity rules.',
      deadline: past2Days,
      max_score: 50,
      created_by: 'user-mentor-demo',
      created_at: new Date(now - 10 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date(now - 10 * 24 * 3600 * 1000).toISOString(),
      questions: [
        {
          id: 'q1',
          text: 'Why must React state updater functions remain pure with no side effects?',
          options: [
            'React may invoke them multiple times during concurrent rendering passes',
            'To allow direct DOM mutation',
            'To prevent JavaScript garbage collection',
            'Pure functions run inside Web Workers only',
          ],
          correctAnswer: 0,
          points: 10,
        },
        {
          id: 'q2',
          text: 'What is the role of the `key` prop in dynamic lists in React?',
          options: [
            'Applies CSS styling to list nodes',
            'Helps React identify which items have changed, added, or removed during reconciliation',
            'Binds event handlers to the window object',
            'Prevents re-renders entirely',
          ],
          correctAnswer: 1,
          points: 10,
        },
        {
          id: 'q3',
          text: 'When does the cleanup function returned by `useEffect` execute?',
          options: [
            'Only once when the entire application terminates',
            'Before the component unmounts and before re-running the effect on dependency change',
            'Immediately before the JSX renders on screen',
            'After each requestAnimationFrame call',
          ],
          correctAnswer: 1,
          points: 10,
        },
        {
          id: 'q4',
          text: 'What is the purpose of `useMemo`?',
          options: [
            'Caches function definitions between renders',
            'Memoizes the result of a calculation between re-renders until dependencies change',
            'Manages persistent server sessions',
            'Synchronizes React state with localStorage automatically',
          ],
          correctAnswer: 1,
          points: 10,
        },
        {
          id: 'q5',
          text: 'What is React StrictMode designed to help developers identify?',
          options: [
            'Syntax errors during build time',
            'Side-effects in render functions, deprecated lifecycle methods, and unexpected unmount behaviors',
            'CSS layout shifts on mobile devices',
            'TypeScript interface mismatches',
          ],
          correctAnswer: 1,
          points: 10,
        },
      ],
    },
    // 4. Project: in 3 days
    {
      id: 'res-proj-1',
      program_id: 'prog-winter-2026',
      type: 'project',
      title: 'Interactive Portfolio Website with Next.js',
      description: 'Build and deploy a responsive personal portfolio featuring modern micro-interactions, responsive typography, and lighthouse scores above 95.',
      problem_statement: 'Design and publish a production-grade portfolio showcasing your engineering proof-of-work. Requirements: Next.js App Router, Tailwind CSS, clean semantic HTML, mobile responsiveness, and automated continuous deployment via Vercel.',
      guidelines: 'Submit both your public GitHub repository link and the live production URL. Provide brief documentation on performance optimizations applied.',
      deadline: in3Days,
      max_score: 100,
      created_by: 'user-mentor-demo',
      created_at: new Date(now - 7 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date(now - 7 * 24 * 3600 * 1000).toISOString(),
    },
    // 5. Project: past deadline (past 4 days)
    {
      id: 'res-proj-2',
      program_id: 'prog-winter-2026',
      type: 'project',
      title: 'Production REST API & Database Integration',
      description: 'Architect a secure RESTful API service featuring JWT authentication, role-based access control, and database relationship persistence.',
      problem_statement: 'Implement an end-to-end backend service handling user authentication, parameterized queries, custom middleware, and comprehensive unit tests.',
      guidelines: 'Provide repository link with API schema documentation (OpenAPI or Postman collection). Deployed API endpoint must be testable via HTTP clients.',
      deadline: past4Days,
      max_score: 100,
      created_by: 'user-mentor-demo',
      created_at: new Date(now - 14 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date(now - 14 * 24 * 3600 * 1000).toISOString(),
    },
    // 6. Video: in 2 days
    {
      id: 'res-vid-1',
      program_id: 'prog-winter-2026',
      type: 'video',
      title: 'Next.js 14 App Router & Server Components Crash Course',
      description: 'In-depth tutorial breaking down server vs client boundaries, streaming with React Suspense, and edge revalidations.',
      video_url: 'https://www.youtube.com/watch?v=wm5gMKuwSYk',
      deadline: in2Days,
      max_score: 25,
      created_by: 'user-mentor-demo',
      created_at: new Date(now - 4 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date(now - 4 * 24 * 3600 * 1000).toISOString(),
    },
  ];

  const submissions = [
    // Demo mentee progress:
    // 1. Quiz 3 (past): graded 45/50
    {
      id: 'sub-mentee-q3',
      resource_id: 'res-quiz-3',
      mentee_id: 'user-mentee-demo',
      status: 'graded',
      answers: { q1: 0, q2: 1, q3: 1, q4: 1, q5: 0 }, // 4 correct, 1 wrong = 40 or 45 pts
      link: null,
      score: 45,
      feedback: 'Great grasp of React reconciliation and useEffect lifecycle cleanups.',
      submitted_at: new Date(now - 3 * 24 * 3600 * 1000).toISOString(),
      created_at: new Date(now - 3 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date(now - 2 * 24 * 3600 * 1000).toISOString(),
    },
    // 2. Project 2 (past): graded 92/100 with mentor feedback
    {
      id: 'sub-mentee-p2',
      resource_id: 'res-proj-2',
      mentee_id: 'user-mentee-demo',
      status: 'graded',
      answers: null,
      link: 'https://api-service-demo.vercel.app',
      repo_url: 'https://github.com/tanisha/scalable-rest-api',
      demo_url: 'https://api-service-demo.vercel.app',
      notes: 'Implemented with Next.js route handlers, Supabase Postgres tables, input validation with Zod, and rate-limiting headers.',
      score: 92,
      feedback: 'Outstanding architecture! Clean route handlers and robust schema validations. Minor improvement: add automated integration tests in GitHub Actions.',
      submitted_at: new Date(now - 5 * 24 * 3600 * 1000).toISOString(),
      created_at: new Date(now - 5 * 24 * 3600 * 1000).toISOString(),
      updated_at: new Date(now - 4 * 24 * 3600 * 1000).toISOString(),
    },
    // 3. Project 1 (due in 3 days): submitted awaiting grade
    {
      id: 'sub-mentee-p1',
      resource_id: 'res-proj-1',
      mentee_id: 'user-mentee-demo',
      status: 'submitted',
      answers: null,
      link: 'https://portfolio-tanisha.vercel.app',
      repo_url: 'https://github.com/tanisha/developer-portfolio',
      demo_url: 'https://portfolio-tanisha.vercel.app',
      notes: 'Built with Next.js App Router, Tailwind CSS, Framer Motion transitions, and Three.js hero canvas. 98+ Lighthouse scores across all metrics.',
      score: null,
      feedback: null,
      submitted_at: new Date(now - 12 * 3600 * 1000).toISOString(),
      created_at: new Date(now - 12 * 3600 * 1000).toISOString(),
      updated_at: new Date(now - 12 * 3600 * 1000).toISOString(),
    },

    // Submissions for other 8 cohort mentees for varied leaderboard
    // Ananya Sharma (Top 1): 50 + 45 + 50 + 95 + 98 + 25 = 363 pts
    { id: 'sub-1-1', resource_id: 'res-quiz-1', mentee_id: 'user-mentee-1', status: 'graded', score: 50, submitted_at: new Date(now - 2 * 3600 * 1000).toISOString() },
    { id: 'sub-1-2', resource_id: 'res-quiz-2', mentee_id: 'user-mentee-1', status: 'graded', score: 45, submitted_at: new Date(now - 1 * 24 * 3600 * 1000).toISOString() },
    { id: 'sub-1-3', resource_id: 'res-quiz-3', mentee_id: 'user-mentee-1', status: 'graded', score: 50, submitted_at: new Date(now - 3 * 24 * 3600 * 1000).toISOString() },
    { id: 'sub-1-4', resource_id: 'res-proj-1', mentee_id: 'user-mentee-1', status: 'graded', score: 95, submitted_at: new Date(now - 2 * 24 * 3600 * 1000).toISOString() },
    { id: 'sub-1-5', resource_id: 'res-proj-2', mentee_id: 'user-mentee-1', status: 'graded', score: 98, submitted_at: new Date(now - 5 * 24 * 3600 * 1000).toISOString() },
    { id: 'sub-1-6', resource_id: 'res-vid-1',  mentee_id: 'user-mentee-1', status: 'graded', score: 25, submitted_at: new Date(now - 4 * 24 * 3600 * 1000).toISOString() },

    // Rhea Kapoor (Top 2): 45 + 45 + 45 + 90 + 90 + 25 = 340 pts
    { id: 'sub-2-1', resource_id: 'res-quiz-1', mentee_id: 'user-mentee-2', status: 'graded', score: 45, submitted_at: new Date(now - 3 * 3600 * 1000).toISOString() },
    { id: 'sub-2-2', resource_id: 'res-quiz-2', mentee_id: 'user-mentee-2', status: 'graded', score: 45, submitted_at: new Date(now - 1 * 24 * 3600 * 1000).toISOString() },
    { id: 'sub-2-3', resource_id: 'res-quiz-3', mentee_id: 'user-mentee-2', status: 'graded', score: 45, submitted_at: new Date(now - 3 * 24 * 3600 * 1000).toISOString() },
    { id: 'sub-2-4', resource_id: 'res-proj-1', mentee_id: 'user-mentee-2', status: 'graded', score: 90, submitted_at: new Date(now - 2 * 24 * 3600 * 1000).toISOString() },
    { id: 'sub-2-5', resource_id: 'res-proj-2', mentee_id: 'user-mentee-2', status: 'graded', score: 90, submitted_at: new Date(now - 5 * 24 * 3600 * 1000).toISOString() },
    { id: 'sub-2-6', resource_id: 'res-vid-1',  mentee_id: 'user-mentee-2', status: 'graded', score: 25, submitted_at: new Date(now - 3 * 24 * 3600 * 1000).toISOString() },

    // Sneha Verma (Top 3): 40 + 45 + 40 + 88 + 85 + 25 = 323 pts
    { id: 'sub-3-1', resource_id: 'res-quiz-1', mentee_id: 'user-mentee-3', status: 'graded', score: 40, submitted_at: new Date(now - 4 * 3600 * 1000).toISOString() },
    { id: 'sub-3-2', resource_id: 'res-quiz-2', mentee_id: 'user-mentee-3', status: 'graded', score: 45, submitted_at: new Date(now - 1 * 24 * 3600 * 1000).toISOString() },
    { id: 'sub-3-3', resource_id: 'res-quiz-3', mentee_id: 'user-mentee-3', status: 'graded', score: 40, submitted_at: new Date(now - 3 * 24 * 3600 * 1000).toISOString() },
    { id: 'sub-3-4', resource_id: 'res-proj-1', mentee_id: 'user-mentee-3', status: 'graded', score: 88, submitted_at: new Date(now - 1 * 24 * 3600 * 1000).toISOString() },
    { id: 'sub-3-5', resource_id: 'res-proj-2', mentee_id: 'user-mentee-3', status: 'graded', score: 85, submitted_at: new Date(now - 5 * 24 * 3600 * 1000).toISOString() },
    { id: 'sub-3-6', resource_id: 'res-vid-1',  mentee_id: 'user-mentee-3', status: 'graded', score: 25, submitted_at: new Date(now - 2 * 24 * 3600 * 1000).toISOString() },

    // Kavya Nair (Rank 4): 40 + 45 + 85 + 25 = 195 pts
    { id: 'sub-4-2', resource_id: 'res-quiz-2', mentee_id: 'user-mentee-4', status: 'graded', score: 40, submitted_at: new Date(now - 1 * 24 * 3600 * 1000).toISOString() },
    { id: 'sub-4-3', resource_id: 'res-quiz-3', mentee_id: 'user-mentee-4', status: 'graded', score: 45, submitted_at: new Date(now - 3 * 24 * 3600 * 1000).toISOString() },
    { id: 'sub-4-5', resource_id: 'res-proj-2', mentee_id: 'user-mentee-4', status: 'graded', score: 85, submitted_at: new Date(now - 5 * 24 * 3600 * 1000).toISOString() },
    { id: 'sub-4-6', resource_id: 'res-vid-1',  mentee_id: 'user-mentee-4', status: 'graded', score: 25, submitted_at: new Date(now - 2 * 24 * 3600 * 1000).toISOString() },

    // Ishita Singhal: 45 + 80 = 125 pts
    { id: 'sub-5-3', resource_id: 'res-quiz-3', mentee_id: 'user-mentee-5', status: 'graded', score: 45, submitted_at: new Date(now - 3 * 24 * 3600 * 1000).toISOString() },
    { id: 'sub-5-5', resource_id: 'res-proj-2', mentee_id: 'user-mentee-5', status: 'graded', score: 80, submitted_at: new Date(now - 5 * 24 * 3600 * 1000).toISOString() },

    // Diya Patel: 40 + 75 = 115 pts
    { id: 'sub-6-3', resource_id: 'res-quiz-3', mentee_id: 'user-mentee-6', status: 'graded', score: 40, submitted_at: new Date(now - 3 * 24 * 3600 * 1000).toISOString() },
    { id: 'sub-6-5', resource_id: 'res-proj-2', mentee_id: 'user-mentee-6', status: 'graded', score: 75, submitted_at: new Date(now - 5 * 24 * 3600 * 1000).toISOString() },

    // Pooja Rao: 35 + 25 = 60 pts
    { id: 'sub-7-3', resource_id: 'res-quiz-3', mentee_id: 'user-mentee-7', status: 'graded', score: 35, submitted_at: new Date(now - 3 * 24 * 3600 * 1000).toISOString() },
    { id: 'sub-7-6', resource_id: 'res-vid-1',  mentee_id: 'user-mentee-7', status: 'graded', score: 25, submitted_at: new Date(now - 2 * 24 * 3600 * 1000).toISOString() },

    // Meera Joshi: 25 pts
    { id: 'sub-8-6', resource_id: 'res-vid-1',  mentee_id: 'user-mentee-8', status: 'graded', score: 25, submitted_at: new Date(now - 1 * 24 * 3600 * 1000).toISOString() },
  ];

  return {
    programs,
    users,
    resources,
    submissions,
  };
}
