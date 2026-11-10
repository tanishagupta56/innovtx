'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';

interface EventFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    short_description?: string;
    description?: string;
    category: string;
    status: 'draft' | 'published';
    poster_url?: string;
    venue?: string;
    start_date: string;
    end_date: string;
    registration_start?: string;
    registration_end?: string;
    max_participants?: number;
  };
}

export default function EventForm({ initialData }: EventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState(initialData?.poster_url || '');

  // Form field state
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [shortDesc, setShortDesc] = useState(initialData?.short_description || '');
  const [desc, setDesc] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || 'Hackathon');
  const [status, setStatus] = useState<'draft' | 'published'>(initialData?.status || 'draft');
  const [venue, setVenue] = useState(initialData?.venue || 'IGDTUW Campus, Delhi');
  const [startDate, setStartDate] = useState(
    initialData?.start_date ? new Date(initialData.start_date).toISOString().slice(0, 16) : ''
  );
  const [endDate, setEndDate] = useState(
    initialData?.end_date ? new Date(initialData.end_date).toISOString().slice(0, 16) : ''
  );
  const [regStart, setRegStart] = useState(
    initialData?.registration_start ? new Date(initialData.registration_start).toISOString().slice(0, 16) : ''
  );
  const [regEnd, setRegEnd] = useState(
    initialData?.registration_end ? new Date(initialData.registration_end).toISOString().slice(0, 16) : ''
  );
  const [maxParticipants, setMaxParticipants] = useState<number | ''>(initialData?.max_participants || '');

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData) {
      setSlug(slugify(val));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid poster format. Only JPG, PNG, and WebP are allowed.');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Poster file size must be less than 5MB.');
      return;
    }

    setError('');
    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      let posterUrl = posterPreview;

      // Handle file upload if a new file is chosen
      if (posterFile) {
        const fileExt = posterFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `posters/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('event-posters')
          .upload(filePath, posterFile, { upsert: true });

        if (uploadError) {
          throw new Error('Poster upload failed: ' + uploadError.message);
        }

        const { data: urlData } = supabase.storage
          .from('event-posters')
          .getPublicUrl(filePath);

        posterUrl = urlData.publicUrl;
      }

      const payload = {
        title,
        slug,
        short_description: shortDesc,
        description: desc,
        category,
        status,
        poster_url: posterUrl || null,
        venue,
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
        registration_start: regStart ? new Date(regStart).toISOString() : null,
        registration_end: regEnd ? new Date(regEnd).toISOString() : null,
        max_participants: maxParticipants ? Number(maxParticipants) : null,
      };

      let res;
      if (initialData?.id) {
        res = await fetch(`/api/admin/events/${initialData.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Failed to save event');
      }

      router.push('/admin/events');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-cobalt/25 bg-[#050814] p-8 max-w-4xl space-y-6">
      {error && (
        <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono">
          [ERROR] {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-gray-300 uppercase mb-2">Event Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="input-field"
            placeholder="e.g. InnoVortex Hackathon"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-300 uppercase mb-2">Slug (URL friendly) *</label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="input-field font-mono"
            placeholder="innovortex-2025"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-gray-300 uppercase mb-2">Short Description</label>
        <input
          type="text"
          value={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
          className="input-field"
          placeholder="Brief summary for event cards"
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-gray-300 uppercase mb-2">Full Description</label>
        <textarea
          rows={6}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="input-field resize-y font-body"
          placeholder="Detailed agenda, tracks, criteria, prizes..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-mono text-gray-300 uppercase mb-2">Category *</label>
          <input
            type="text"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
            placeholder="Hackathon, Workshop, Fest..."
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-300 uppercase mb-2">Publish Status *</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="input-field"
          >
            <option value="draft">Draft (Admin Only)</option>
            <option value="published">Published (Public)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-300 uppercase mb-2">Venue / Mode</label>
          <input
            type="text"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="input-field"
            placeholder="Auditorium, Online, etc."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-mono text-gray-300 uppercase mb-2">Start Date &amp; Time *</label>
          <input
            type="datetime-local"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-300 uppercase mb-2">End Date &amp; Time *</label>
          <input
            type="datetime-local"
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-mono text-gray-300 uppercase mb-2">Registration Opens</label>
          <input
            type="datetime-local"
            value={regStart}
            onChange={(e) => setRegStart(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-300 uppercase mb-2">Registration Closes</label>
          <input
            type="datetime-local"
            value={regEnd}
            onChange={(e) => setRegEnd(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-300 uppercase mb-2">Max Capacity</label>
          <input
            type="number"
            min={1}
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value ? Number(e.target.value) : '')}
            className="input-field"
            placeholder="Unlimited if blank"
          />
        </div>
      </div>

      {/* Poster Upload Section */}
      <div className="pt-4 border-t border-cobalt/20">
        <label className="block text-xs font-mono text-gray-300 uppercase mb-2">
          Event Poster (JPG, PNG, WebP &lt; 5MB)
        </label>
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-mono file:bg-cobalt file:text-white hover:file:bg-cobalt-400 text-xs text-gray-400"
          />
          {posterPreview && (
            <div className="w-32 h-20 overflow-hidden border border-cobalt/40 bg-black">
              <img src={posterPreview} alt="Poster preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-cobalt/20 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-accent text-xs font-mono uppercase tracking-wider py-3 px-6"
        >
          {loading ? 'Saving Event...' : initialData ? 'Update Event' : 'Create Event'}
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
