import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PersistentWorld } from '@/components/3d/PersistentWorld';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PersistentWorld />
      <Navbar />
      <main className="min-h-screen relative z-10">{children}</main>
      <Footer />
    </>
  );
}
