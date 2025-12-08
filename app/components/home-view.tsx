"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "./glass-card";
import { ArrowRight, Edit3, Key } from "lucide-react";
import HomeContainer from "./home-container";
import Image from "next/image";
import spotify from "../assets/images/512px-Spotify_icon.svg.png";
import { signIn } from "next-auth/react";

export default function HomeView() {
  const router = useRouter();
  const [inputKey, setInputKey] = useState("");
  return (
    <HomeContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-md text-center space-y-8"
      >
        <div>
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 tracking-tight">
            Glass.Bio
          </h1>
          <p className="text-white/50 mt-2 text-lg">
            Booking and enquiries for artists and artist managers.
          </p>
        </div>

        <GlassCard className="p-8 space-y-6">
          {/* <div className="space-y-3">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">
              Edit Existing Profile
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Key
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                  size={16}
                />
                <input
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Enter Access Key..."
                  className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:bg-black/40 outline-none transition text-white placeholder-white/20 font-mono"
                />
              </div>
              <button
                disabled={!inputKey}
                //   onClick={() => onLoad(inputKey)}
                className="bg-white/10 hover:bg-white/20 disabled:opacity-30 border border-white/10 text-white p-3 rounded-xl transition"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div> */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">
              Create a profile or sign in with spotify
            </label>
          </div>
          <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
          <div className="space-y-3">
            <button
              onClick={() => signIn("spotify")}
              className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Image src={spotify} alt="spotify-logo" width={20} height={20} />
              Continue with spotify
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </HomeContainer>
  );
}
