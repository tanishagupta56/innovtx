import Link from 'next/link';
import Image from 'next/image';
import InfiniteMarquee from '@/components/InfiniteMarquee';
import MagneticButton from '@/components/MagneticButton';
import ScrollReveal from '@/components/ScrollReveal';
import { SOCIETY_STATS, SOCIETY_DEPARTMENTS } from '@/data/societyData';

export const metadata = {
  title: 'About TechNeeds IGDTUW — Mission, History & Ecosystem',
  description: 'The official technology society of Indira Gandhi Delhi Technical University for Women. Fostering women leaders in system architecture, AI, and open-source engineering.',
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 px-6 sm:px-12 bg-deep-ink text-soft-white min-h-screen relative z-10">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Header spread */}
        <div className="border-b border-charcoal-border pb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-lime-green">
              SOCIETY ARCHITECTURE // WHO WE ARE
            </span>
            <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">
              OFFICIAL SOCIETY MANIFESTO
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <h1 className="editorial-title text-5xl sm:text-7xl xl:text-8xl text-soft-white tracking-tight leading-[0.95]">
                ENGINEERING FOR THE <br />
                <span className="text-transparent [-webkit-text-stroke:1.5px_#315EFF] hover:[-webkit-text-stroke:1.5px_#315EFF] transition-all">
                  UNAPOLOGETICALLY
                </span>{' '}
                AMBITIOUS<span className="text-lime-green">.</span>
              </h1>

              <p className="mt-8 text-slate-300 font-sans text-lg sm:text-2xl max-w-3xl leading-relaxed">
                TechNeeds was established at Indira Gandhi Delhi Technical University for Women to bridge the void between conventional academic curricula and high-performance industry engineering.
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="relative w-44 h-44 sm:w-56 sm:h-56">
                <div className="absolute inset-0 bg-lime-green/20 rounded-full blur-2xl animate-pulse" />
                <Image
                  src="/brand/techneeds-logo.png"
                  alt="Official TechNeeds Logo"
                  fill
                  sizes="224px"
                  className="object-contain relative z-10 drop-shadow-[0_0_25px_rgba(117,230,255,0.4)]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Impact Numbers Telemetry */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 border border-charcoal-border bg-charcoal/60 rounded-2xl">
          {SOCIETY_STATS.map((stat, i) => (
            <div key={i} className="text-center p-4">
              <span className="text-3xl sm:text-5xl font-mono font-bold text-lime-green block mb-1">
                {stat.number}
              </span>
              <span className="text-xs font-mono font-bold text-soft-white uppercase tracking-wider block">
                {stat.label}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {stat.detail}
              </span>
            </div>
          ))}
        </div>

        {/* Narrative Chapters: Asymmetric Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-36 space-y-6 font-mono text-xs">
            <span className="text-lime-green block uppercase tracking-widest font-bold">
              {'// MANIFESTO INDEX'}
            </span>
            <ul className="space-y-3 text-slate-400">
              <li className="text-lime-green font-bold">01. OUR ORIGIN STORY</li>
              <li>02. MISSION &amp; VISION</li>
              <li>03. MENTORSHIP &amp; SSSC</li>
              <li>04. HACKATHON ARENA</li>
              <li>05. INDUSTRY ALLIANCES</li>
            </ul>

            <div className="pt-6 border-t border-charcoal-border">
              <Link href="/timeline" className="text-lime-green hover:underline flex items-center gap-2 font-bold">
                <span>View 3D Historical Timeline</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-12">
            {/* Chapter 1: Origin */}
            <ScrollReveal direction="up" distance={25}>
              <div className="p-8 sm:p-12 border border-charcoal-border bg-charcoal/70 rounded-2xl">
                <span className="text-xs font-mono text-lime-green uppercase font-bold mb-3 block">
                  CHAPTER 01 // ORIGIN &amp; ROOTS
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-soft-white mb-4">
                  Born from a Desire to Build Real Software
                </h3>
                <p className="text-slate-300 font-sans text-base leading-relaxed mb-4">
                  In September 2023, a group of dedicated student engineers at IGDTUW came together with a clear realisation: reading textbook slides does not prepare anyone to deploy distributed microservices or build autonomous AI models.
                </p>
                <p className="text-slate-300 font-sans text-base leading-relaxed">
                  The inaugural InnoVortex Ideathon was organized in campus classrooms with over 150 participants. That singular sprint ignited what is now TechNeeds: a self-governing technical society of over 1,200 women technologists, alumni, and industry mentors.
                </p>
              </div>
            </ScrollReveal>

            {/* Chapter 2: Mission & Vision */}
            <ScrollReveal direction="up" distance={25} delay={0.1}>
              <div className="p-8 sm:p-12 border border-charcoal-border bg-charcoal/70 rounded-2xl">
                <span className="text-xs font-mono text-lime-green uppercase font-bold mb-3 block">
                  CHAPTER 02 // MISSION &amp; VISION
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-soft-white mb-4">
                  Empowering the Next Generation of Women Architects
                </h3>
                <div className="space-y-4 text-slate-300 font-sans text-base leading-relaxed">
                  <div>
                    <strong className="text-soft-white block font-mono text-sm mb-1 uppercase text-lime-green">
                      MISSION:
                    </strong>
                    To democratize advanced technical education, facilitate peer mentorship, and cultivate unapologetic technical confidence among women engineers through competitive hackathons and open-source contribution.
                  </div>
                  <div>
                    <strong className="text-soft-white block font-mono text-sm mb-1 uppercase text-lime-green">
                      VISION:
                    </strong>
                    To establish IGDTUW as a recognized national hub of elite engineering talent where graduates lead engineering teams at top technology companies and launch venture-backed startups worldwide.
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Chapter 3: Mentorship Ecosystem */}
            <ScrollReveal direction="up" distance={25} delay={0.15}>
              <div className="p-8 sm:p-12 border border-charcoal-border bg-charcoal/70 rounded-2xl">
                <span className="text-xs font-mono text-lime-green uppercase font-bold mb-3 block">
                  CHAPTER 03 // SSSC MENTORSHIP ECOSYSTEM
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-soft-white mb-4">
                  Society Student Support Cell (SSSC)
                </h3>
                <p className="text-slate-300 font-sans text-base leading-relaxed mb-4">
                  The Society Student Support Cell (SSSC) serves as our foundational peer-to-peer mentoring cadre. First and second-year undergraduates are paired with third and fourth-year seniors who have successfully interned at leading software firms.
                </p>
                <p className="text-slate-300 font-sans text-base leading-relaxed">
                  Historical cohort curricula have featured dedicated tracks in Web Development (led by Vidusi Agarwal) and Data Structures &amp; Algorithms in C/C++ (led by Shefali Kaushal), helping hundreds of freshers navigate early technical careers.
                </p>
                <div className="pt-4 mt-4 border-t border-charcoal-border">
                  <Link href="/mentorship" className="text-xs font-mono text-lime-green hover:underline font-bold">
                    Learn more about Mentorship Cohorts →
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Chapter 4: Hackathons & InnoVortex */}
            <ScrollReveal direction="up" distance={25} delay={0.2}>
              <div className="p-8 sm:p-12 border border-charcoal-border bg-charcoal/70 rounded-2xl">
                <span className="text-xs font-mono text-lime-green uppercase font-bold mb-3 block">
                  CHAPTER 04 // THE INNOVORTEX ARENA
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-soft-white mb-4">
                  4 Editions of Collegiate Innovation
                </h3>
                <p className="text-slate-300 font-sans text-base leading-relaxed mb-4">
                  InnoVortex is our flagship hackathon series. Growing from a local campus event in 2023 to regional editions hosted at partner institutions like IIIT Delhi in 2025, it challenges participants to solve real-world problems in Autonomous Systems, Climate Technology, and Web3 Infrastructure.
                </p>
                <p className="text-slate-300 font-sans text-base leading-relaxed">
                  Every edition provides 100% verified digital entry passes, high-compute labs, and mentorship from senior industry judges.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Society Departments Grid */}
        <div className="space-y-8 pt-8">
          <div>
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-charcoal border border-charcoal-border text-lime-green">
              ORGANIZATIONAL ARCHITECTURE
            </span>
            <h2 className="editorial-title text-4xl sm:text-5xl text-soft-white mt-3">
              DEPARTMENT WINGS<span className="text-lime-green">.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {SOCIETY_DEPARTMENTS.map((dept) => (
              <div
                key={dept.id}
                className="p-6 border border-charcoal-border bg-charcoal/60 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[10px] text-lime-green uppercase tracking-widest block mb-2">
                    {dept.codename}
                  </span>
                  <h4 className="text-lg font-bold text-soft-white mb-2">{dept.name}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{dept.description}</p>
                </div>
                <div className="pt-4 border-t border-charcoal-border text-[11px] font-mono text-slate-400">
                  {dept.leadRole}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-12 border-t border-charcoal-border">
          <h2 className="text-3xl sm:text-5xl font-bold text-soft-white mb-4">
            Join the Movement
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 font-sans">
            Ready to build alongside India&apos;s sharpest women engineers? Create your student identity today.
          </p>
          <div className="flex justify-center gap-4">
            <MagneticButton href="/signup" strength={25}>
              <span className="px-8 py-3.5 bg-electric-blue text-deep-ink font-mono text-xs font-bold uppercase rounded-md shadow-[0_0_15px_rgba(117,230,255,0.4)]">
                Create Student Account →
              </span>
            </MagneticButton>
            <MagneticButton href="/community" strength={20}>
              <span className="px-8 py-3.5 bg-charcoal border border-charcoal-border text-soft-white font-mono text-xs font-bold uppercase rounded-md hover:border-electric-blue/50">
                Community Hub
              </span>
            </MagneticButton>
          </div>
        </div>
      </div>
    </div>
  );
}
