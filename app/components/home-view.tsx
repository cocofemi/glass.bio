"use client";

import { motion } from "framer-motion";
import GlassCard from "./glass-card";
import HomeContainer from "./home-container";
import Image from "next/image";
import spotify from "../assets/images/512px-Spotify_icon.svg.png";
import { signIn } from "next-auth/react";
import { SiYoutubemusic } from "react-icons/si";

export default function HomeView() {
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
          <div className="space-y-3">
            {/* Updated label to be inclusive of both music platforms */}
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">
              Connect your music library
            </label>
          </div>

          <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

          <div className="space-y-3">
            {/* PRIMARY: Spotify (High Contrast) */}
            <button
              onClick={() => signIn("spotify")}
              className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Image src={spotify} alt="spotify-logo" width={20} height={20} />
              Continue with Spotify
            </button>

            {/* SECONDARY: YouTube Music (Glass/Dark Theme) */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10"></div>
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                or
              </span>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            <button
              onClick={() => signIn("google")}
              className="w-full py-4 rounded-xl bg-black/40 border border-white/10 text-white font-bold hover:bg-black/60 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              {/* Official YouTube Music Red Circle Icon */}
              <div className="p-1 bg-white rounded-full flex items-center justify-center">
                <SiYoutubemusic size={16} className="text-[#FF0000]" />
              </div>
              <span>Continue with YouTube Music</span>
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </HomeContainer>
  );
}
