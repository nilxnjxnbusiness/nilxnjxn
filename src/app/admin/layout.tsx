export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-mono p-4 md:p-8">
      {children}
    </div>
  );
}
