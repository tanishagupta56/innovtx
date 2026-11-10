import OpportunityForm from '../OpportunityForm';

export const metadata = { title: 'New Opportunity — Admin Console' };

export default function NewOpportunityPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white tracking-tight">
          Post Opportunity
        </h1>
        <p className="text-xs font-mono text-gray-400 mt-1">
          Publish internships, full-time openings, or hackathons for IGDTUW students.
        </p>
      </div>

      <OpportunityForm />
    </div>
  );
}
