"use client";

import { useEffect, useState } from "react";

export default function SplashPage() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center justify-center px-6 text-center overflow-hidden">
      <img
        src="/church-logo.png"
        alt="Agape Bible Church Logo"
        className={`object-contain transition-all duration-1000 ${
          showWelcome ? "h-24 w-24 -translate-y-16" : "h-40 w-40"
        }`}
      />

      <div
        className={`transition-all duration-1000 ${
          showWelcome
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        <h1 className="mt-6 text-3xl font-black leading-tight">
          Welcome to Agape Bible Church's Official App
        </h1>

        <p className="mt-4 text-white/60">
          Worship • Word • Prayer • Fellowship
        </p>

        <a
          href="/login"
          className="mt-8 inline-block rounded-2xl bg-purple-600 px-8 py-4 font-bold shadow-xl"
        >
          Continue
        </a>
      </div>
    </main>
  );
}