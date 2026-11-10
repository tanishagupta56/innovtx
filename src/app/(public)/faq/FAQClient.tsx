'use client';

import React, { useState } from 'react';

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_DATABASE: FAQItem[] = [
  // 1. About TechNeeds
  {
    id: 'faq-about-1',
    category: 'About TechNeeds',
    question: 'What is TechNeeds IGDTUW?',
    answer: 'TechNeeds is the official technology society at Indira Gandhi Delhi Technical University for Women. We focus on bridging academic theory with hands-on systems engineering, high-stakes hackathons, and structured peer mentorship.',
  },
  {
    id: 'faq-about-2',
    category: 'About TechNeeds',
    question: 'Where is the society based?',
    answer: 'We are based on the main historic campus of IGDTUW in Kashmere Gate, Delhi 110006. Our initiatives serve undergraduate women engineers across CSE, IT, ECE, AI/ML, and Mechanical branches.',
  },
  // 2. Membership
  {
    id: 'faq-mem-1',
    category: 'Membership',
    question: 'Who is eligible to join TechNeeds as a member?',
    answer: 'Any enrolled student of IGDTUW across any academic year and engineering discipline is eligible to create an account, participate in our cohorts, and attend events.',
  },
  {
    id: 'faq-mem-2',
    category: 'Membership',
    question: 'Is there any membership fee?',
    answer: 'No. TechNeeds is completely non-profit and student-led. All student memberships, cohort participation, and event passes are 100% free of cost.',
  },
  // 3. Events
  {
    id: 'faq-evt-1',
    category: 'Events',
    question: 'What is InnoVortex?',
    answer: 'InnoVortex is our flagship annual 36-hour hackathon. Having completed 4 successful editions, it attracts over 1,200 applicants and features problem tracks in Autonomous AI, Climate Tech, and Distributed Systems.',
  },
  {
    id: 'faq-evt-2',
    category: 'Events',
    question: 'How do cryptographic event passes work?',
    answer: 'When you register for an event, our platform generates an HMAC-SHA256 cryptographically signed dynamic QR pass stored in your student dashboard. On-site organizers scan and verify this pass for tamper-proof entry.',
  },
  // 4. Mentorship
  {
    id: 'faq-ment-1',
    category: 'Mentorship',
    question: 'What is the Society Student Support Cell (SSSC)?',
    answer: 'The SSSC is our dedicated mentorship cadre pairing freshers and sophomores with experienced seniors and alumni who have interned at top tech firms for weekly 1-on-1 guidance, DSA sprints, and mock interviews.',
  },
  {
    id: 'faq-ment-2',
    category: 'Mentorship',
    question: 'What cohorts have been run historically?',
    answer: 'Notable completed cohorts include Web Development led by Vidusi Agarwal, Data Structures & Algorithms in C/C++ led by Shefali Kaushal, and the 21-Day CS Fundamentals Sprint.',
  },
  // 5. Resources
  {
    id: 'faq-res-1',
    category: 'Resources',
    question: 'What is TechBoard?',
    answer: 'TechBoard is our curated digital knowledge repository containing peer-reviewed roadmaps, revision cheat sheets for OS/DBMS/Networks, and open-source contribution guidelines.',
  },
  // 6. Recruitment
  {
    id: 'faq-rec-1',
    category: 'Recruitment',
    question: 'When do core team recruitments happen?',
    answer: 'Executive and departmental recruitment cycles (Technical, AI/ML, Design, PR, Mentorship) typically open at the start of each odd semester. Announcements are broadcast via our WhatsApp matrix and Discord server.',
  },
  // 7. Collaborations
  {
    id: 'faq-col-1',
    category: 'Collaborations',
    question: 'Can student chapters from other universities collaborate with TechNeeds?',
    answer: 'Yes! We frequently co-host hackathons and workshops with student chapters across Delhi NCR (such as our venue partnership with IIIT Delhi for InnoVortex 3.0 and INNERve Hacks). Reach out via our Partner portal.',
  },
  // 8. Sponsorship
  {
    id: 'faq-sp-1',
    category: 'Sponsorship',
    question: 'How can corporate partners sponsor InnoVortex?',
    answer: 'We offer Title, Track, and Tooling sponsorship tiers that provide prominent branding, sponsored problem statements, and direct access to top finalist talent. Email us at techneedsigdtuw@gmail.com.',
  },
  // 9. Technical support
  {
    id: 'faq-tech-1',
    category: 'Technical Support',
    question: 'I encountered an issue with my QR pass or login. How can I get help?',
    answer: 'You can submit a support ticket directly from your student dashboard (/dashboard/tickets) or email techneedsigdtuw@gmail.com. Our engineering leads monitor support requests daily.',
  },
];

export default function FAQClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-about-1': true,
  });

  const categories = [
    'All',
    'About TechNeeds',
    'Membership',
    'Events',
    'Mentorship',
    'Resources',
    'Recruitment',
    'Collaborations',
    'Sponsorship',
    'Technical Support',
  ];

  const filtered = FAQ_DATABASE.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = !searchQuery || item.question.toLowerCase().includes(searchQuery.toLowerCase()) || item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-10">
      {/* Search Input & Category Pills */}
      <div className="p-6 border border-charcoal-border bg-charcoal/60 rounded-2xl space-y-6">
        <div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type your question or keywords..."
            className="w-full px-5 py-3 bg-deep-ink border border-charcoal-border rounded-xl text-soft-white font-mono text-sm placeholder:text-slate-500 focus:outline-none focus:border-electric-blue/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 font-mono text-xs rounded-full uppercase transition-all ${
                selectedCategory === cat
                  ? 'bg-electric-blue text-deep-ink font-bold shadow-[0_0_12px_#315EFF]'
                  : 'bg-deep-ink border border-charcoal-border text-slate-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion Items */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((item) => {
            const isOpen = !!openIds[item.id];
            return (
              <div
                key={item.id}
                className="border border-charcoal-border bg-charcoal/70 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-display font-bold text-lg sm:text-xl text-soft-white hover:text-lime-green transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-lime-green uppercase px-2 py-0.5 rounded bg-deep-ink border border-charcoal-border">
                      {item.category}
                    </span>
                    <span>{item.question}</span>
                  </div>
                  <span className="text-xl font-mono text-lime-green flex-shrink-0">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-charcoal-border/50 text-slate-300 font-sans text-sm sm:text-base leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-16 border border-charcoal-border bg-charcoal/40 rounded-xl text-center font-mono text-slate-400">
            No matching questions found. Try a different search query or select &quot;All&quot;.
          </div>
        )}
      </div>
    </div>
  );
}
