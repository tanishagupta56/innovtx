import Link from 'next/link';

export const metadata = { title: 'Notifications — TechNeeds Dashboard' };

export default function NotificationsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-white">Notifications</h1>
        <p className="text-xs font-mono text-gray-400 mt-1">
          Automated event alerts, ticket updates, and application deadlines.
        </p>
      </div>

      <div className="card text-center py-12 max-w-lg">
        <span className="text-2xl">🔔</span>
        <p className="font-display font-semibold text-white mt-3">Notification Center Coming Soon</p>
        <p className="text-xs text-gray-400 mt-2">
          Webhook-based and in-app instant notifications are planned for Phase 2 deployment with email notifications integration.
        </p>
        <div className="mt-6">
          <Link href="/dashboard" className="btn-ghost text-xs py-2 px-4">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
