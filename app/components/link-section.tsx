export default function LinkSection({ title, icon, value, onChange }: any) {
  return (
    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
      <h3 className="text-xs font-bold text-white/80 mb-2 flex items-center gap-2">
        {icon} {title}
      </h3>
      <input
        type="text"
        placeholder="https://..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
      />
    </div>
  );
}
