export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center px-6 py-12 relative z-10">
      {children}
    </div>
  );
}
