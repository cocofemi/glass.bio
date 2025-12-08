import { motion } from "framer-motion";

export default function GlassLinkButton({ title, subtitle, icon, url }: any) {
  return (
    <motion.a
      href={url}
      target="_blank"
      whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      whileTap={{ scale: 0.98 }}
      className="w-full py-3 px-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-between group"
    >
      <div className="flex flex-col">
        <span className="font-semibold text-white">{title}</span>
        <span className="text-[10px] text-white/50 uppercase tracking-wider">
          {subtitle}
        </span>
      </div>
      <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition">
        {icon}
      </div>
    </motion.a>
  );
}
