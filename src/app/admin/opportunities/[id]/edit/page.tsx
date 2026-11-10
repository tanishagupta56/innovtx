import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import OpportunityForm from '../../OpportunityForm';

export const metadata = { title: 'Edit Opportunity — Admin Console' };

export default async function EditOpportunityPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: opp } = await supabase
    .from('opportunities')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!opp) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white tracking-tight">
          Edit Opportunity: {opp.title}
        </h1>
        <p className="text-xs font-mono text-gray-400 mt-1">
          Update opportunity requirements, deadline, or visibility.
        </p>
      </div>

      <OpportunityForm initialData={opp} />
    </div>
  );
}
