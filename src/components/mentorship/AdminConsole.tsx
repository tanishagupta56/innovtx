'use client';

import React, { useState, useEffect } from 'react';
import { mentorshipApi } from '@/lib/mentorship/client-api';
import CredentialsModal from './CredentialsModal';

export default function AdminConsole() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & form state
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any | null>(null);
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);

  // Program form
  const [programTitle, setProgramTitle] = useState('');
  const [programDesc, setProgramDesc] = useState('');
  const [programTech, setProgramTech] = useState('');
  const [programStart, setProgramStart] = useState('');
  const [programEnd, setProgramEnd] = useState('');
  const [programStatus, setProgramStatus] = useState<'active' | 'upcoming'>('active');
  const [programSubmitting, setProgramSubmitting] = useState(false);

  // Mentor onboard form
  const [mentorName, setMentorName] = useState('');
  const [mentorEmail, setMentorEmail] = useState('');
  const [mentorTags, setMentorTags] = useState('');
  const [mentorPrograms, setMentorPrograms] = useState<string[]>([]);
  const [mentorSubmitting, setMentorSubmitting] = useState(false);

  // Credentials display modal
  const [issuedCreds, setIssuedCreds] = useState<any | null>(null);

  // Feedback Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [progRes, mentorRes] = await Promise.all([
        mentorshipApi.getPrograms(),
        mentorshipApi.getUsers('mentor'),
      ]);
      setPrograms(progRes.programs || []);
      setMentors(mentorRes.users || []);
    } catch (err: any) {
      showToast(`Error loading data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateProgram = () => {
    setEditingProgram(null);
    setProgramTitle('');
    setProgramDesc('');
    setProgramTech('');
    setProgramStart('');
    setProgramEnd('');
    setProgramStatus('active');
    setIsProgramModalOpen(true);
  };

  const openEditProgram = (prog: any) => {
    setEditingProgram(prog);
    setProgramTitle(prog.title || '');
    setProgramDesc(prog.description || '');
    setProgramTech((prog.tech_tags || []).join(', '));
    setProgramStart(prog.start_date ? prog.start_date.split('T')[0] : '');
    setProgramEnd(prog.end_date ? prog.end_date.split('T')[0] : '');
    setProgramStatus(prog.status === 'upcoming' ? 'upcoming' : 'active');
    setIsProgramModalOpen(true);
  };

  const handleProgramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProgramSubmitting(true);
    try {
      const payload = {
        title: programTitle.trim(),
        description: programDesc.trim(),
        tech_tags: programTech.split(',').map((t) => t.trim()).filter(Boolean),
        start_date: programStart ? new Date(programStart).toISOString() : null,
        end_date: programEnd ? new Date(programEnd).toISOString() : null,
        status: programStatus,
      };

      if (editingProgram) {
        await mentorshipApi.updateProgram(editingProgram.id, payload);
        showToast('Program updated successfully');
      } else {
        await mentorshipApi.createProgram(payload);
        showToast('Program created successfully');
      }

      setIsProgramModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(`Failed to save program: ${err.message}`);
    } finally {
      setProgramSubmitting(false);
    }
  };

  const handleMentorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMentorSubmitting(true);
    try {
      const payload = {
        name: mentorName.trim(),
        role: 'mentor' as const,
        email: mentorEmail.trim(),
        program_ids: mentorPrograms,
        tags: mentorTags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      const res = await mentorshipApi.createUser(payload);
      setIsMentorModalOpen(false);
      setMentorName('');
      setMentorEmail('');
      setMentorTags('');
      setMentorPrograms([]);

      // Show credentials modal
      if (res.credentials) {
        setIssuedCreds({
          name: res.user?.name,
          role: 'mentor',
          identifier: res.credentials.identifier,
          tempPassword: res.credentials.tempPassword,
        });
      }

      loadData();
    } catch (err: any) {
      showToast(`Failed to onboard mentor: ${err.message}`);
    } finally {
      setMentorSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-charcoal border border-electric-blue rounded-xl font-mono text-xs text-soft-white shadow-[0_0_20px_rgba(49,94,255,0.4)] animate-slide-up flex items-center gap-2">
          <span>⚡</span> {toast}
        </div>
      )}

      {/* Section 1: Programs Management */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-charcoal-border pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lime-green font-mono text-xs font-bold tracking-widest uppercase">
                {'// 01 · COHORT PROGRAMS'}
              </span>
              <span className="text-[11px] font-mono text-slate-500 uppercase">
                ({programs.length} ACTIVE / SCHEDULED)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-soft-white">
              Curriculum &amp; Cohort Management
            </h2>
          </div>
          <button
            onClick={openCreateProgram}
            className="px-4 py-2.5 bg-electric-blue hover:bg-electric-blue-light text-soft-white font-mono text-xs font-bold uppercase rounded-lg shadow-[0_0_15px_rgba(49,94,255,0.3)] transition-all flex items-center gap-2"
          >
            <span>+</span> Create Program
          </button>
        </div>

        {/* Programs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="p-6 bg-charcoal/50 border border-charcoal-border rounded-2xl animate-pulse h-48" />
            ))}
          </div>
        ) : programs.length === 0 ? (
          <div className="p-8 border border-dashed border-charcoal-border rounded-2xl text-center text-slate-400 font-mono text-xs">
            No programs created yet. Click "+ Create Program" to publish your first cohort.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="p-6 border border-charcoal-border bg-charcoal/70 rounded-2xl space-y-4 hover:border-electric-blue/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        prog.status === 'active'
                          ? 'bg-lime-green/15 text-lime-green border border-lime-green/30'
                          : 'bg-electric-blue/15 text-electric-blue-light border border-electric-blue/30'
                      }`}
                    >
                      {prog.status === 'active' ? 'ACTIVE COHORT' : 'UPCOMING'}
                    </span>
                    <button
                      onClick={() => openEditProgram(prog)}
                      className="text-xs font-mono text-slate-400 hover:text-lime-green transition-colors"
                    >
                      [Edit Program]
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-soft-white group-hover:text-lime-green transition-colors">
                    {prog.title}
                  </h3>

                  <p className="text-xs text-slate-300 font-sans mt-2 line-clamp-2">
                    {prog.description || 'No description provided.'}
                  </p>

                  {/* Tech Tags */}
                  {prog.tech_tags && prog.tech_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {prog.tech_tags.map((t: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[10px] font-mono bg-deep-ink border border-charcoal-border text-slate-300 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-charcoal-border flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>
                    START: {prog.start_date ? new Date(prog.start_date).toLocaleDateString() : 'TBD'}
                  </span>
                  <span>
                    END: {prog.end_date ? new Date(prog.end_date).toLocaleDateString() : 'TBD'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Mentor Onboarding */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-charcoal-border pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lime-green font-mono text-xs font-bold tracking-widest uppercase">
                {'// 02 · MENTOR ROSTER'}
              </span>
              <span className="text-[11px] font-mono text-slate-500 uppercase">
                ({mentors.length} ONBOARDED)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-soft-white">
              Lead Mentors &amp; Program Allocation
            </h2>
          </div>
          <button
            onClick={() => setIsMentorModalOpen(true)}
            className="px-4 py-2.5 bg-lime-green hover:bg-lime-green-light text-deep-ink font-mono text-xs font-bold uppercase rounded-lg shadow-[0_0_15px_rgba(184,217,76,0.3)] transition-all flex items-center gap-2"
          >
            <span>+</span> Onboard Mentor
          </button>
        </div>

        {/* Mentors Table */}
        {loading ? (
          <div className="p-8 bg-charcoal/50 border border-charcoal-border rounded-2xl animate-pulse h-40" />
        ) : mentors.length === 0 ? (
          <div className="p-8 border border-dashed border-charcoal-border rounded-2xl text-center text-slate-400 font-mono text-xs">
            No mentors onboarded yet. Click "+ Onboard Mentor" to issue access credentials.
          </div>
        ) : (
          <div className="overflow-x-auto border border-charcoal-border rounded-2xl bg-charcoal/60">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-charcoal-border bg-deep-ink/60 text-slate-400 uppercase text-[11px]">
                  <th className="p-4">Mentor Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Assigned Cohorts</th>
                  <th className="p-4">Skills / Tags</th>
                  <th className="p-4 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-border">
                {mentors.map((m) => {
                  const assignedTitles = (m.program_ids || [])
                    .map((pid: string) => programs.find((p) => p.id === pid)?.title)
                    .filter(Boolean);

                  return (
                    <tr key={m.id} className="hover:bg-deep-ink/40 transition-colors">
                      <td className="p-4 font-bold text-soft-white">{m.name}</td>
                      <td className="p-4 text-slate-300">{m.email}</td>
                      <td className="p-4">
                        {assignedTitles.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {assignedTitles.map((t: string, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 text-[10px] bg-electric-blue/15 border border-electric-blue/30 text-electric-blue-light rounded"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">None assigned</span>
                        )}
                      </td>
                      <td className="p-4">
                        {m.tags && m.tags.length > 0 ? (
                          <span className="text-slate-400">{m.tags.join(', ')}</span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <a
                          href={`/mentorship/profile/${m.id}`}
                          className="text-lime-green hover:underline font-bold"
                        >
                          View Card →
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Program Create/Edit Modal */}
      {isProgramModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-charcoal border border-charcoal-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_0_35px_rgba(49,94,255,0.2)]">
            <div className="flex items-center justify-between border-b border-charcoal-border pb-4">
              <h3 className="text-xl font-bold font-sans text-soft-white">
                {editingProgram ? 'Edit Cohort Program' : 'Create New Cohort Program'}
              </h3>
              <button
                onClick={() => setIsProgramModalOpen(false)}
                className="text-slate-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProgramSubmit} className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 uppercase">Program Title *</label>
                <input
                  required
                  value={programTitle}
                  onChange={(e) => setProgramTitle(e.target.value)}
                  placeholder="e.g. Autumn 2026 Systems Cohort"
                  className="w-full px-3.5 py-2.5 bg-deep-ink border border-charcoal-border rounded-lg text-soft-white focus:outline-none focus:border-electric-blue"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 uppercase">Description</label>
                <textarea
                  rows={3}
                  value={programDesc}
                  onChange={(e) => setProgramDesc(e.target.value)}
                  placeholder="Comprehensive curriculum details and deliverables..."
                  className="w-full px-3.5 py-2.5 bg-deep-ink border border-charcoal-border rounded-lg text-soft-white focus:outline-none focus:border-electric-blue"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 uppercase">Tech Tags (comma separated)</label>
                <input
                  value={programTech}
                  onChange={(e) => setProgramTech(e.target.value)}
                  placeholder="Next.js, TypeScript, Go, PostgreSQL"
                  className="w-full px-3.5 py-2.5 bg-deep-ink border border-charcoal-border rounded-lg text-soft-white focus:outline-none focus:border-electric-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 uppercase">Start Date</label>
                  <input
                    type="date"
                    value={programStart}
                    onChange={(e) => setProgramStart(e.target.value)}
                    className="w-full px-3 py-2 bg-deep-ink border border-charcoal-border rounded-lg text-soft-white focus:outline-none focus:border-electric-blue"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 uppercase">End Date</label>
                  <input
                    type="date"
                    value={programEnd}
                    onChange={(e) => setProgramEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-deep-ink border border-charcoal-border rounded-lg text-soft-white focus:outline-none focus:border-electric-blue"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 uppercase">Status</label>
                <select
                  value={programStatus}
                  onChange={(e) => setProgramStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-deep-ink border border-charcoal-border rounded-lg text-soft-white focus:outline-none focus:border-electric-blue"
                >
                  <option value="active">Active Cohort</option>
                  <option value="upcoming">Upcoming Cohort</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-charcoal-border">
                <button
                  type="button"
                  onClick={() => setIsProgramModalOpen(false)}
                  className="px-4 py-2 border border-charcoal-border rounded-lg text-slate-400 hover:text-white uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={programSubmitting}
                  className="px-6 py-2 bg-electric-blue hover:bg-electric-blue-light disabled:opacity-50 text-soft-white font-bold uppercase rounded-lg shadow-[0_0_12px_rgba(49,94,255,0.4)]"
                >
                  {programSubmitting ? 'Saving...' : 'Save Program →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mentor Onboard Modal */}
      {isMentorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-charcoal border border-charcoal-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_0_35px_rgba(184,217,76,0.2)]">
            <div className="flex items-center justify-between border-b border-charcoal-border pb-4">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-lime-green/15 text-lime-green border border-lime-green/30">
                  LEAD ONBOARDING
                </span>
                <h3 className="text-xl font-bold font-sans text-soft-white mt-1">
                  Onboard Lead Mentor
                </h3>
              </div>
              <button
                onClick={() => setIsMentorModalOpen(false)}
                className="text-slate-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleMentorSubmit} className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 uppercase">Mentor Full Name *</label>
                <input
                  required
                  value={mentorName}
                  onChange={(e) => setMentorName(e.target.value)}
                  placeholder="e.g. Shefali Kaushal"
                  className="w-full px-3.5 py-2.5 bg-deep-ink border border-charcoal-border rounded-lg text-soft-white focus:outline-none focus:border-lime-green"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 uppercase">Official Email Address *</label>
                <input
                  type="email"
                  required
                  value={mentorEmail}
                  onChange={(e) => setMentorEmail(e.target.value)}
                  placeholder="e.g. shefali.mentor@techneeds.live"
                  className="w-full px-3.5 py-2.5 bg-deep-ink border border-charcoal-border rounded-lg text-soft-white focus:outline-none focus:border-lime-green"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 uppercase">Skill Tags (comma separated)</label>
                <input
                  value={mentorTags}
                  onChange={(e) => setMentorTags(e.target.value)}
                  placeholder="Algorithms, C++, System Design"
                  className="w-full px-3.5 py-2.5 bg-deep-ink border border-charcoal-border rounded-lg text-soft-white focus:outline-none focus:border-lime-green"
                />
              </div>

              {/* Assign Programs */}
              <div className="space-y-1.5">
                <label className="text-slate-300 uppercase">Assign Cohort Program(s)</label>
                {programs.length === 0 ? (
                  <p className="text-slate-500 italic">No programs available yet</p>
                ) : (
                  <div className="space-y-2 p-3 bg-deep-ink border border-charcoal-border rounded-lg max-h-40 overflow-y-auto">
                    {programs.map((p) => (
                      <label key={p.id} className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                        <input
                          type="checkbox"
                          checked={mentorPrograms.includes(p.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setMentorPrograms([...mentorPrograms, p.id]);
                            } else {
                              setMentorPrograms(mentorPrograms.filter((id) => id !== p.id));
                            }
                          }}
                          className="accent-lime-green"
                        />
                        <span>{p.title}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 bg-deep-ink border border-charcoal-border rounded-lg text-slate-400 text-[11px]">
                ℹ️ Generating credentials will create a secure 12-char temporary password that you can copy and send directly to the mentor.
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-charcoal-border">
                <button
                  type="button"
                  onClick={() => setIsMentorModalOpen(false)}
                  className="px-4 py-2 border border-charcoal-border rounded-lg text-slate-400 hover:text-white uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mentorSubmitting}
                  className="px-6 py-2 bg-lime-green hover:bg-lime-green-light disabled:opacity-50 text-deep-ink font-bold uppercase rounded-lg shadow-[0_0_12px_rgba(184,217,76,0.4)]"
                >
                  {mentorSubmitting ? 'Generating...' : 'Issue Mentor Access →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Credentials Output Modal */}
      <CredentialsModal
        isOpen={!!issuedCreds}
        onClose={() => setIssuedCreds(null)}
        credentials={issuedCreds}
      />
    </div>
  );
}
