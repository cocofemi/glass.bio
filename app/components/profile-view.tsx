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

const EMPTY: UserProfile = {
  id: "",
  name: "",
  profession: "",
  bio: "",
  email: "",
  spotifyId: "",
  followers: 0,
  slug: "",
  avatar: "",
  socials: { instagram: "", twitter: "", youtube: "", spotify: "" },
  links: { latestRelease: "", merchStore: "", tourDates: "" },
};

export default function ProfileView({ slug }: { slug: string }) {
  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const copyToClipboard = () => {
    // Mock URL copy
    navigator.clipboard.writeText(
      `https://${process.env.NEXT_PUBLIC_BASE_URL}/profile/${slug}`
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
              title="Tour Dates"
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

        <AnimatePresence>
          {isChatOpen && (
            <SmartGlassChat user={data} onClose={() => setIsChatOpen(false)} />
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
