'use client';

import React, { useState } from 'react';

export interface ProjectItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  team: string[];
  techStack: string[];
  demoUrl?: string;
  githubUrl?: string;
  award?: string;
}

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-ecotrace',
    name: 'EcoTrace AI',
    tagline: 'Satellite-Assisted Carbon Supply Chain Auditor',
    description: 'An AI-powered environmental monitoring platform ingesting multi-spectral satellite imagery to detect urban heat islands and quantify enterprise carbon emissions.',
    category: 'AI & Climate',
    team: ['Aanya Singhal', 'Mehak Arora', 'Sneha Verma'],
    techStack: ['PyTorch', 'FastAPI', 'Next.js 14', 'PostgreSQL', 'Mapbox GL'],
    demoUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    award: 'InnoVortex 3.0 Track Winner',
  },
  {
    id: 'proj-medpulse',
    name: 'MedPulse ZK',
    tagline: 'Privacy-Preserving Health Identity Protocol',
    description: 'Decentralized patient medical record sharing using zero-knowledge proofs to allow insurance and clinic verification without disclosing raw diagnostic history.',
    category: 'Web3 & Security',
    team: ['Tanvi Kulkarni', 'Rhea Bansal'],
    techStack: ['Solidity', 'Circom', 'Next.js', 'Ethers.js', 'IPFS'],
    demoUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    award: 'INNERve Hacks Finalist',
  },
  {
    id: 'proj-campusnav',
    name: 'CampusNav 3D',
    tagline: 'Spatial AR Navigation for IGDTUW Campus',
    description: 'Interactive spatial web application featuring 3D building reconstructions, accessible routes, and real-time seminar room locating across the Kashmere Gate campus.',
    category: 'Spatial Web',
    team: ['Pooja Yadav', 'Vidhi Sharma', 'Kriti Jain'],
    techStack: ['Three.js', 'WebXR', 'React Three Fiber', 'Tailwind CSS'],
    demoUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    award: 'SSSC Capstone Gold',
  },
  {
    id: 'proj-algovisual',
    name: 'AlgoFlow WebAssembly',
    tagline: 'High-Performance Graph Algorithm Simulator',
    description: 'Interactive educational simulator for complex flow algorithms (Dijkstra, Bellman-Ford, Tarjan SCC) executing at native speeds via compiled WebAssembly.',
    category: 'DevTools & Core',
    team: ['Diya Aggarwal', 'Shreya Kapoor'],
    techStack: ['Rust', 'WebAssembly', 'HTML5 Canvas', 'TypeScript'],
    demoUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    award: 'Open Source Spotlight',
  },
];

export default function ShowcaseClient() {
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '',
    tagline: '',
    description: '',
    category: 'AI & Climate',
    team: '',
    techStack: '',
    demoUrl: '',
    githubUrl: '',
  });

  const categories = ['all', 'AI & Climate', 'Web3 & Security', 'Spatial Web', 'DevTools & Core'];

  const filtered = selectedCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description) return;

    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: form.name,
      tagline: form.tagline || 'Student Project Submission',
      description: form.description,
      category: form.category,
      team: form.team ? form.team.split(',').map((t) => t.trim()) : ['IGDTUW Builder'],
      techStack: form.techStack ? form.techStack.split(',').map((t) => t.trim()) : ['TypeScript', 'Next.js'],
      demoUrl: form.demoUrl,
      githubUrl: form.githubUrl,
      award: 'Pending Peer Review',
    };

    setProjects([newProject, ...projects]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setModalOpen(false);
      setForm({
        name: '',
        tagline: '',
        description: '',
        category: 'AI & Climate',
        team: '',
        techStack: '',
        demoUrl: '',
        githubUrl: '',
      });
    }, 1800);
  };

  return (
    <div className="space-y-12">
      {/* Category Filter and Submit Button Toolbar */}
      <div className="p-6 border border-charcoal-border bg-charcoal/60 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400 uppercase mr-1">FILTER DOMAIN:</span>
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

        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-2.5 bg-electric-blue hover:bg-electric-blue-light text-soft-white font-mono text-xs font-bold uppercase rounded-md transition-colors shadow-[0_0_15px_rgba(49,94,255,0.4)] whitespace-nowrap"
        >
          + Submit Student Project
        </button>
      </div>

      {/* Asymmetric Project Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="p-8 sm:p-10 border border-charcoal-border bg-charcoal/70 rounded-2xl hover:border-electric-blue/50 transition-all flex flex-col justify-between group relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-charcoal border border-charcoal-border text-lime-green">
                  {proj.category}
                </span>
                {proj.award && (
                  <span className="text-[11px] font-mono text-acid-lime font-bold">
                    🏆 {proj.award}
                  </span>
                )}
              </div>

              <h3 className="font-display font-bold text-2xl sm:text-3xl text-soft-white group-hover:text-lime-green transition-colors mb-1">
                {proj.name}
              </h3>

              <p className="font-mono text-xs text-electric-blue-light font-semibold mb-3">
                {proj.tagline}
              </p>

              <p className="text-slate-300 font-sans text-sm leading-relaxed mb-6">
                {proj.description}
              </p>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {proj.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="font-mono text-[10px] text-slate-400 bg-deep-ink px-2.5 py-0.5 rounded border border-charcoal-border"
                  >
                    #{tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-charcoal-border flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs font-mono text-slate-400">
                TEAM: <span className="text-slate-200">{proj.team.join(', ')}</span>
              </div>

              <div className="flex items-center gap-3">
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
                  >
                    GitHub ↗
                  </a>
                )}
                {proj.demoUrl && (
                  <a
                    href={proj.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 bg-electric-blue text-deep-ink font-mono text-xs font-bold rounded hover:bg-cyan-300 transition-colors"
                  >
                    Live Demo ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submission Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl p-8 bg-charcoal border border-charcoal-border rounded-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-charcoal-border pb-4">
              <div>
                <h3 className="text-xl font-bold text-soft-white">Submit Your Project</h3>
                <p className="text-xs font-mono text-slate-400">Published after peer review by TechNeeds leads</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="p-8 text-center space-y-3 font-mono">
                <span className="text-3xl block">✨</span>
                <p className="text-lime-green font-bold text-lg">Project Submitted Successfully!</p>
                <p className="text-xs text-slate-400">Your submission is queued for peer review.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">PROJECT NAME *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. EcoTrace AI"
                    className="w-full px-4 py-2 bg-deep-ink border border-charcoal-border rounded text-soft-white focus:outline-none focus:border-electric-blue/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">ONE-LINE TAGLINE</label>
                  <input
                    type="text"
                    value={form.tagline}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    placeholder="e.g. Autonomous Satellite Monitoring System"
                    className="w-full px-4 py-2 bg-deep-ink border border-charcoal-border rounded text-soft-white focus:outline-none focus:border-electric-blue/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">DESCRIPTION *</label>
                  <textarea
                    required
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="What problem does it solve? What architecture did you use?"
                    className="w-full px-4 py-2 bg-deep-ink border border-charcoal-border rounded text-soft-white focus:outline-none focus:border-electric-blue/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">DOMAIN CATEGORY</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-2 bg-deep-ink border border-charcoal-border rounded text-soft-white focus:outline-none focus:border-electric-blue/50"
                    >
                      <option value="AI & Climate">AI &amp; Climate</option>
                      <option value="Web3 & Security">Web3 &amp; Security</option>
                      <option value="Spatial Web">Spatial Web</option>
                      <option value="DevTools & Core">DevTools &amp; Core</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">TEAM MEMBERS (COMMA-SEPARATED)</label>
                    <input
                      type="text"
                      value={form.team}
                      onChange={(e) => setForm({ ...form, team: e.target.value })}
                      placeholder="e.g. Aanya, Mehak, Sneha"
                      className="w-full px-4 py-2 bg-deep-ink border border-charcoal-border rounded text-soft-white focus:outline-none focus:border-electric-blue/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">TECH STACK (COMMA-SEPARATED)</label>
                  <input
                    type="text"
                    value={form.techStack}
                    onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                    placeholder="e.g. React, PyTorch, Supabase, Tailwind"
                    className="w-full px-4 py-2 bg-deep-ink border border-charcoal-border rounded text-soft-white focus:outline-none focus:border-electric-blue/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">GITHUB URL</label>
                    <input
                      type="url"
                      value={form.githubUrl}
                      onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full px-4 py-2 bg-deep-ink border border-charcoal-border rounded text-soft-white focus:outline-none focus:border-electric-blue/50"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">DEMO URL</label>
                    <input
                      type="url"
                      value={form.demoUrl}
                      onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2 bg-deep-ink border border-charcoal-border rounded text-soft-white focus:outline-none focus:border-electric-blue/50"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-charcoal-border">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-deep-ink border border-charcoal-border rounded text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-electric-blue text-deep-ink font-bold rounded hover:bg-cyan-300"
                  >
                    Submit Project
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
