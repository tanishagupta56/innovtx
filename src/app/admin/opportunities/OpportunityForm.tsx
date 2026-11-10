'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface OpportunityFormProps {
  initialData?: {
    id: string;
    title: string;
    description?: string;
    type: string;
    company?: string;
    location?: string;
    apply_url?: string;
    deadline?: string;
    is_published: boolean;
  };
}

export default function OpportunityForm({ initialData }: OpportunityFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState(initialData?.title || '');
  const [company, setCompany] = useState(initialData?.company || '');
  const [type, setType] = useState(initialData?.type || 'internship');
  const [location, setLocation] = useState(initialData?.location || 'Remote / Hybrid');
  const [applyUrl, setApplyUrl] = useState(initialData?.apply_url || '');
  const [deadline, setDeadline] = useState(
    initialData?.deadline ? new Date(initialData.deadline).toISOString().slice(0, 16) : ''
  );
  const [isPublished, setIsPublished] = useState(initialData?.is_published ?? true);
  const [description, setDescription] = useState(initialData?.description || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        title,
        company,
        type,
        location,
        apply_url: applyUrl || null,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        is_published: isPublished,
        description,
      };

      const url = initialData?.id
        ? `/api/admin/opportunities/${initialData.id}`
        : '/api/admin/opportunities';
      const method = initialData?.id ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save opportunity');
      }

      router.push('/admin/opportunities');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Submission error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-cobalt/25 bg-[#050814] p-8 max-w-3xl space-y-6">
      {error && (
        <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono">
          [ERROR] {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-gray-300 uppercase mb-2">Title / Role *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            placeholder="e.g. Software Engineering Intern"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-300 uppercase mb-2">Company / Organization</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="input-field"
            placeholder="e.g. Google, Microsoft, Startup"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-mono text-gray-300 uppercase mb-2">Opportunity Type *</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="input-field"
          >
            <option value="internship">Internship</option>
            <option value="job">Job</option>
            <option value="fellowship">Fellowship</option>
            <option value="competition">Competition / Hackathon</option>
            <option value="workshop">Workshop</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-300 uppercase mb-2">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input-field"
            placeholder="e.g. Remote, Delhi, Bangalore"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-300 uppercase mb-2">Application Deadline</label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-gray-300 uppercase mb-2">Application URL</label>
        <input
          type="url"
          value={applyUrl}
          onChange={(e) => setApplyUrl(e.target.value)}
          className="input-field font-mono text-xs"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-gray-300 uppercase mb-2">Description / Requirements</label>
        <textarea
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field font-body resize-y"
          placeholder="Role overview, eligibility criteria, perks..."
        />
      </div>

      <div className="pt-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4 rounded border-cobalt/40 bg-black text-lime focus:ring-lime"
          />
          <span className="text-xs font-mono uppercase text-gray-300">
            Publish on Student Portal Immediately
          </span>
        </label>
      </div>

      <div className="pt-4 border-t border-cobalt/20 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-accent text-xs font-mono uppercase tracking-wider py-3 px-6"
        >
          {loading ? 'Saving...' : initialData ? 'Update Opportunity' : 'Create Opportunity'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-ghost text-xs font-mono uppercase tracking-wider py-3 px-6"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
