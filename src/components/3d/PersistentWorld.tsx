'use client';

import dynamic from 'next/dynamic';

const WorldCanvas = dynamic(() => import('./WorldCanvas'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 pointer-events-none -z-10 bg-[#030407]" />,
});

export function PersistentWorld() {
  return <WorldCanvas />;
}
