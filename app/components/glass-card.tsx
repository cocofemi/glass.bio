export default function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl ${className}`}
    >
      {children}
    </div>
  );
}
