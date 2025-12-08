"use-client";
import { motion } from "framer-motion";
import { Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { UserProfile } from "../types/index.types";
import { supabase } from "../lib/supabase";
import { useParams } from "next/navigation";
import HomeContainer from "./home-container";
import Turnstile from "react-turnstile";

export default function SmartGlassChat({
  user,
  onClose,
}: {
  user: UserProfile;
  onClose: () => void;
}) {
  const params = useParams();
  const { slug } = params;
  const [messages, setMessages] = useState<any[]>([
    {
      id: 1,
      text: `Hi there! I'm ${user.name}'s virtual assistant. How can I help you today?`,
      sender: "bot",
    },
  ]);
  const [token, setToken] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const defaultSuggestions = [
    { label: "📅 Bookings", value: "How do I book you?" },
    { label: "🎵 New Music", value: "Where is the latest release?" },
    { label: "👕 Merch", value: "Do you have a store?" },
    { label: "👋 Just saying Hi", value: "Hi!" },
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { id: Date.now(), text, sender: "user" }]);
    setInputValue("");
    setIsTyping(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [
          ...messages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
          { role: "user", content: text },
        ],
        slug,
        token,
      }),
    });

    const data = await res.json();

    if (data.type === "chat") {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: data.response, sender: "bot" },
      ]);
    } else if (data.type === "booking_summary") {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Thanks! I've forwarded your booking details. A member of staff would reach out to you.",
          sender: "bot",
        },
      ]);
    }

    setIsTyping(false);
  };

  return (
    <>
      {/* {!token && (
        <Turnstile
          sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onVerify={(value) => setToken(value)}
          theme="dark"
        />
      )} */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="w-full max-w-md h-[550px] bg-gray-900/90 backdrop-blur-2xl border border-white/20 rounded-3xl flex flex-col overflow-hidden shadow-2xl ring-1 ring-white/10"
        >
          <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={user.avatar}
                  className="w-8 h-8 rounded-full bg-white/10"
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-white text-sm">
                  Assistant
                </span>
                <span className="text-[10px] text-white/50">
                  Typically replies instantly
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition"
            >
              <X size={18} className="text-white/70" />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-linear-to-b from-transparent to-black/20">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3.5 max-w-[85%] text-sm leading-relaxed ${
                    m.sender === "user"
                      ? "bg-linear-to-br from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-lg"
                      : "bg-white/10 border border-white/5 text-gray-100 rounded-2xl rounded-tl-sm backdrop-blur-md"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
          <div className="p-3 bg-gray-900/50 border-t border-white/10 backdrop-blur-xl">
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mask-fade-right">
              {defaultSuggestions.map((s) => (
                <button
                  key={s.label}
                  onClick={() => sendMessage(s.value)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/80 hover:bg-white/20 hover:scale-105 transition-all active:scale-95"
                >
                  {s.label}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(inputValue);
              }}
              className="flex gap-2 items-center"
            >
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-black/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 border border-white/5 placeholder-white/20"
                placeholder="Message..."
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-white text-black p-3 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
