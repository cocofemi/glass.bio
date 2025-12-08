"use client";

import { UserProfile } from "../types/index.types";
import { supabase } from "../lib/supabase";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Check,
  Edit3,
  Eye,
  Instagram,
  MessageCircle,
  Music,
  Share2,
  ShoppingBag,
  Twitter,
} from "lucide-react";
import { useEffect, useState } from "react";
import GlassLinkButton from "./glass-link-button";
import { SocialIcon } from "./social-icom";
import SmartGlassChat from "./chat";
import HomeContainer from "./home-container";
import Turnstile from "react-turnstile";

export default function ProfileView({ slug }: { slug: string }) {
  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [token, setToken] = useState("");

  const copyToClipboard = () => {
    // Mock URL copy
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_BASE_URL}/profile/${slug}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const loadProfile = async () => {
      const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        console.error("Profile fetch error:", error);
      }

      if (profile) {
        setData({
          id: profile.id,
          name: profile.name,
          profession: profile.profession,
          bio: profile.bio,
          email: profile.email,
          spotifyId: profile.spotify_id,
          followers: profile.followers,
          slug: profile.slug,
          avatar: profile.avatar,
          socials: {
            instagram: profile.instagram,
            twitter: profile.twitter,
            youtube: profile.youtube,
            spotify: profile.spotify_url,
          },
          links: {
            latestRelease: profile.latestRelease,
            merchStore: profile.merchStore,
            tourDates: profile.tourDates,
          },
        });
      }

      setLoading(false);
    };

    loadProfile();
  }, [slug]);

  if (loading) {
    return (
      <HomeContainer>
        <div className="text-center text-white/50 py-20">Loading profile…</div>
      </HomeContainer>
    );
  }

  if (!data) {
    return (
      <HomeContainer>
        <div className="text-center text-white/50 py-20">
          Profile not found.
        </div>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md flex flex-col gap-5 relative z-10"
      >
        {/* Profile Header */}
        <div className="text-center flex flex-col items-center gap-4 mt-2">
          <div className="w-32 h-32 rounded-full p-1 bg-linear-to-tr from-white/20 to-transparent">
            <img
              src={data.avatar}
              className="w-full h-full rounded-full object-cover bg-black/50 border-2 border-white/10"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold capitalize">{data.name}</h1>
            <p className="text-white/60 text-sm tracking-widest uppercase">
              {data.profession}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {/* 
         1. We just open the "flow" here. 
         The render logic below decides whether to show Verify or Chat 
      */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="w-full py-4 rounded-2xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)] cursor-pointer"
          >
            <MessageCircle size={20} /> Bookings & Enquiries
          </button>

          {data.links.latestRelease && (
            <GlassLinkButton
              title="Latest Release"
              subtitle="Stream"
              icon={<Music size={18} className="text-pink-400" />}
              url={data.links.latestRelease}
            />
          )}
          {data.links.merchStore && (
            <GlassLinkButton
              title="Merch Store"
              subtitle="Shop"
              icon={<ShoppingBag size={18} className="text-purple-400" />}
              url={data.links.merchStore}
            />
          )}
          {data.links.tourDates && (
            <GlassLinkButton
              title="Tour Tickets"
              subtitle="Tickets"
              icon={<Calendar size={18} className="text-blue-400" />}
              url={data.links.tourDates}
            />
          )}
        </div>

        {/* Socials */}
        <div className="flex justify-center gap-6 mt-6 p-4 rounded-3xl bg-white/5 backdrop-blur-md border border-white/5 mx-auto">
          {data.socials.instagram && (
            <SocialIcon Icon={Instagram} url={data.socials.instagram} />
          )}
          {data.socials.twitter && (
            <SocialIcon Icon={Twitter} url={data.socials.twitter} />
          )}
          {data.socials.spotify && (
            <SocialIcon Icon={Music} url={data.socials.spotify} />
          )}
        </div>

        {/* LOGIC: Handle Verification Flow Overlay */}
        <AnimatePresence mode="wait">
          {/* State 1: User wants to chat, but needs to Verify first */}
          {isChatOpen && !token && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            >
              <div className="bg-[#111] border border-white/10 p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4 max-w-sm w-full">
                <div className="text-center space-y-1">
                  <h3 className="font-bold text-white text-lg">
                    Security Check
                  </h3>
                  <p className="text-white/50 text-xs">
                    Please verify you are human to continue.
                  </p>
                </div>

                {/* Turnstile Container */}
                <div className="min-h-[65px] flex items-center justify-center">
                  <Turnstile
                    sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    onVerify={(value) => setToken(value)} // This triggers re-render, switching to State 2
                    theme="dark"
                  />
                </div>

                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-white/40 text-xs hover:text-white transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {/* State 2: User wants to chat AND has token -> Show Chat */}
          {isChatOpen && token && (
            <SmartGlassChat
              user={data}
              onClose={() => setIsChatOpen(false)}
              token={token}
            />
          )}
        </AnimatePresence>

        {/* Share Footer */}
        <div className="pt-6 w-full border-t border-white/10 flex justify-center">
          <button
            onClick={copyToClipboard}
            className="text-white/50 hover:text-white text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            {copied ? (
              <Check size={14} className="text-green-400" />
            ) : (
              <Share2 size={14} />
            )}
            {copied ? "Link Copied!" : "Share Profile"}
          </button>
        </div>
      </motion.div>
    </HomeContainer>
  );
}
