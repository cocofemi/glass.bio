export default function TabButton({ active, onClick, label, icon }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all ${
        active ? "bg-white/20 text-white" : "text-white/40 hover:text-white/60"
      }`}
    >
      {icon} {label}
    </button>
  );
}
