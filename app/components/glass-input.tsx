import React from "react";

export default function GlassInput({
  icon,
  placeholder,
  value,
  onChange,
  disabled,
}: any) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition">
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:bg-black/40 outline-none transition text-white placeholder-white/20"
      />
    </div>
  );
}
