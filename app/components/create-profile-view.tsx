"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "./glass-card";
import TabButton from "./tab-button";
import {
  Briefcase,
  ExternalLink,
  Instagram,
  LinkIcon,
  LogOut,
  Mail,
  Music,
  RefreshCw,
  ShoppingBag,
  Ticket,
  Twitter,
  User,
  X,
  Youtube,
} from "lucide-react";
import GlassInput from "./glass-input";
import LinkSection from "./link-section";
import HomeContainer from "./home-container";
import { UserProfile } from "../types/index.types";
import { supabase } from "../lib/supabase";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const INITIAL_STATE: UserProfile = {
  id: "",
  name: "",
  profession: "",
  bio: "",
  email: "",
  slug: "",
  avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Glass",
  spotifyId: "",
  socials: { instagram: "", twitter: "", youtube: "", spotify: "" },
  links: { latestRelease: "", merchStore: "", tourDates: "" },
  followers: 0,
};

function ProfileBuilder() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [data, setData] = useState(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"profile" | "links">("profile");
  const [errors, setErrors] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!session?.user) return;

    const loadProfile = async () => {
      const uid = session.user.id;
      console.log("Type of", typeof uid); // ← YOU MUST set this in your session callback

      console.log("SESSION USER:", session.user);

      // 1️⃣ Check existing profile in Supabase
      const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("uid", uid)
        .maybeSingle();

      if (profile) {
        // ✔ Populate with Supabase data
        setData({
          ...INITIAL_STATE,
          id: uid,
          name: profile.name ?? "",
          slug: profile.slug ?? "",
          email: profile.email ?? "",
          avatar: profile.avatar ?? INITIAL_STATE.avatar,
          profession: profile.profession ?? "",
          bio: profile.bio ?? "",
          socials: {
            instagram: profile.instagram ?? "",
            twitter: profile.twitter ?? "",
            youtube: profile.youtube ?? "",
            spotify: profile.spotify_url ?? "",
          },
          links: {
            latestRelease: profile.latestRelease ?? "",
            merchStore: profile.merchStore ?? "",
            tourDates: profile.tourDates ?? "",
          },
          followers: profile.followers ?? 0,
        });

        return;
      }

      // First-time user → Populate from Spotify session
      const spotifyUser = session.user;

      console.log("FIRST-TIME SPOTIFY USER/GOOGLE USER:", spotifyUser);

      setData({
        ...INITIAL_STATE,
        id: uid,
        name: spotifyUser?.name ?? "",
        email: spotifyUser?.email ?? "",
        avatar:
          spotifyUser?.image && spotifyUser.image !== ""
            ? spotifyUser.image
            : INITIAL_STATE.avatar,
        socials: {
          instagram: "",
          twitter: "",
          youtube:
            session.provider === "google"
              ? `https://www.youtube.com/@${slugify(spotifyUser?.name)}`
              : "",
          spotify: spotifyUser?.id
            ? `https://open.spotify.com/user/${spotifyUser.id}`
            : "",
        },
        links: {
          latestRelease: "",
          merchStore: "",
          tourDates: "",
        },
        followers: session.user.followers ?? 0,
      });
    };

    loadProfile();
  }, [session, status]);

  const handleChange = (field: keyof UserProfile, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNested = (
    section: "socials" | "links",
    field: string,
    value: string
  ) => {
    setData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  function slugify(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with -
      .replace(/^-+|-+$/g, ""); // remove leading/trailing hyphens
  }

  const saveProfile = async () => {
    setIsLoading(true);
    setErrors(null);

    // --- VALIDATION ---

    // Profession required
    if (!data.profession.trim()) {
      setErrors("Please enter your profession.");
      setIsLoading(false);
      return;
    }

    // At least one social link required (instagram, twitter, youtube, spotify)
    const socials = data.socials;
    const hasSocial = [
      socials.instagram,
      socials.twitter,
      socials.youtube,
      socials.spotify,
    ].some((v) => v && v.trim() !== "" && v.trim() !== "#");

    if (!hasSocial) {
      setErrors(
        "Please enter at least one social link or use # as a placeholder."
      );
      setIsLoading(false);
      return;
    }

    // At least one link on LINKS tab required
    const links = data.links;
    const hasLink = [
      links.latestRelease,
      links.merchStore,
      links.tourDates,
    ].some((v) => v && v.trim() !== "" && v.trim() !== "#");

    if (!hasLink) {
      setErrors("Please enter at least one link in the Links tab or use #.");
      setIsLoading(false);
      return;
    }

    if (!session?.user) return;

    const uid = session.user.id; // from NextAuth callback

    // Check if user exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("uid", uid)
      .maybeSingle();

    if (fetchError) {
      console.error("Supabase fetch error:", fetchError);
      return;
    }
    const slug = slugify(data.name);

    const payload = {
      name: data.name,
      slug: slug,
      email: data.email,
      avatar: data.avatar,
      profession: data.profession,
      bio: data.bio,
      instagram: `https://www.instagram.com/${data.socials.instagram}`,
      twitter: `https://x.com/${data.socials.twitter}`,
      youtube: `https://www.youtube.com/${data.socials.youtube}`,
      spotify_url: data.socials.spotify, // locked to Spotify only
      latestRelease: data.links.latestRelease,
      merchStore: data.links.merchStore,
      tourDates: data.links.tourDates,
      followers: data.followers,
    };

    //If profile exists → update
    if (existingProfile) {
      const { data: updated, error: updateError } = await supabase
        .from("users")
        .update(payload)
        .eq("uid", uid)
        .select()
        .single();

      if (updateError) {
        console.error("Supabase update error:", updateError);
        return;
      }

      setIsLoading(false);
      router.push(`/profile/${slugify(data.name)}`);
      return updated;
    }

    // First-time user → create new row
    const { data: created, error: insertError } = await supabase
      .from("users")
      .insert({
        uid,
        spotifyId: session.provider === "spotify" ? uid : null,
        youtubeId: session.provider === "google" ? uid : null,
        ...payload,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      setIsLoading(false);
      router.push(`/profile/${slugify(data.name)}`);
      return;
    }

    console.log("Profile created:", created);
    router.push(`/profile/${slugify(data.name)}`);
    setIsLoading(false);
    return created;
  };

  return (
    <HomeContainer>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <GlassCard className="p-6 sm:p-8 relative">
          {/* New Visit Profile Link */}
          <a
            href={`/profile/${slugify(data.name)}`} // Replace with your actual route
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-6 right-16 text-white/30 hover:text-white transition flex items-center gap-1.5"
            title="View Public Profile"
          >
            <span className="text-[10px] uppercase tracking-wider font-bold hidden sm:block">
              View Live
            </span>
            <ExternalLink size={18} />
          </a>

          {/* Existing Close Button */}
          <button
            // onClick={onCancel}
            className="absolute top-6 right-6 text-white/30 hover:text-white transition"
          >
            <X size={20} />
          </button>
          <button
            //   onClick={onCancel}
            className="absolute top-6 right-6 text-white/30 hover:text-white transition"
          >
            <X size={20} />
          </button>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Profile</h2>
            <p className="text-white/40 text-xs mt-1 font-mono">
              {/* ID: {session?.user?.name} */}
            </p>
          </div>
          <div className="flex p-1 bg-black/20 rounded-xl mb-6 border border-white/5">
            <TabButton
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
              label="Profile"
              icon={<User size={14} />}
            />
            <TabButton
              active={activeTab === "links"}
              onClick={() => setActiveTab("links")}
              label="Links"
              icon={<LinkIcon size={14} />}
            />
          </div>
          <div className="space-y-4 min-h-[350px]">
            {activeTab === "profile" ? (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex justify-center mb-8">
                  <div className="relative group cursor-pointer w-20 h-20">
                    <img
                      src={data.avatar}
                      className="w-full h-full rounded-full bg-white/10 object-cover"
                    />
                    <button
                      onClick={() =>
                        setData({
                          ...data,
                          avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${Math.random()}`,
                        })
                      }
                      className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-center text-green-200">
                  <p>{`${data?.followers}`} Followers</p>
                </div>
                <GlassInput
                  icon={<User />}
                  placeholder="Name"
                  value={data.name}
                  disabled={true}
                  onChange={(e: any) => handleChange("name", e.target.value)}
                />
                <GlassInput
                  icon={<Briefcase />}
                  placeholder="Profession"
                  value={data.profession}
                  onChange={(e: any) =>
                    handleChange("profession", e.target.value)
                  }
                />
                <GlassInput
                  icon={<Mail />}
                  placeholder="Booking Email"
                  value={data.email}
                  onChange={(e: any) => handleChange("email", e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <GlassInput
                    icon={<Instagram />}
                    placeholder="Instagram username"
                    value={data.socials.instagram}
                    onChange={(e: any) =>
                      handleNested("socials", "instagram", e.target.value)
                    }
                  />
                  <GlassInput
                    icon={<Twitter />}
                    placeholder="Twitter username"
                    value={data.socials.twitter}
                    onChange={(e: any) =>
                      handleNested("socials", "twitter", e.target.value)
                    }
                  />
                  <GlassInput
                    icon={<Music />}
                    placeholder="Spotify URL"
                    value={data.socials.spotify}
                    disabled={session?.provider === "google" ? false : true}
                    onChange={(e: any) =>
                      handleNested("socials", "spotify", e.target.value)
                    }
                  />
                  <GlassInput
                    icon={<Youtube />}
                    placeholder="Youtube"
                    disabled={session?.provider === "spotify" ? false : true}
                    value={data.socials.youtube}
                    onChange={(e: any) =>
                      handleNested("socials", "youtube", e.target.value)
                    }
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <LinkSection
                  title="Latest Release"
                  icon={<Music className="text-pink-400" />}
                  value={data.links.latestRelease}
                  onChange={(v) => handleNested("links", "latestRelease", v)}
                />

                <div className="flex flex-col gap-1">
                  {/* Header Row */}
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-sm font-medium">Merch Store</span>{" "}
                    {/* Assuming this matches your LinkSection label style */}
                    <a
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      href="https://www.mehchant.com"
                      target="_blank"
                    >
                      Create a store on Mechant.com
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  {/* Input Component */}
                  <LinkSection
                    // title="Merch Store" // Remove title from here if you moved it up, or pass the link as a 'rightLabel' prop if your component supports it
                    icon={<ShoppingBag className="text-purple-400" />}
                    value={data.links.merchStore}
                    onChange={(v) => handleNested("links", "merchStore", v)}
                  />
                </div>

                <LinkSection
                  title="Tickets"
                  icon={<Ticket className="text-blue-400" />}
                  value={data.links.tourDates}
                  onChange={(v) => handleNested("links", "tourDates", v)}
                />
              </motion.div>
            )}
          </div>
          {errors && (
            <p className="text-red-400 text-center text-sm mb-2">{errors}</p>
          )}

          <button
            onClick={saveProfile}
            disabled={isLoading}
            className="w-full mt-6 py-4 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 font-bold hover:brightness-110 transition disabled:opacity-50"
          >
            {isLoading ? "Saving profile..." : "Save & Publish"}
          </button>

          <div className="mt-4 flex justify-center">
            <button
              onClick={() => signOut()}
              className="text-xs text-white/30 hover:text-red-400 transition flex items-center gap-2 py-2"
            >
              <LogOut size={14} />
              <span>Sign out</span>
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </HomeContainer>
  );
}

export default ProfileBuilder;
