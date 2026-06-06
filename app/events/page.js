"use client";

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-[#0F172A] text-white px-5 py-6">
      <div className="max-w-3xl mx-auto">
        <a
          href="/home"
          className="inline-block rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold"
        >
          ← Back Home
        </a>

        <h1 className="mt-8 text-3xl font-black">Events</h1>

        <p className="mt-4 text-white/70">
          Church events will be shown on the Home page.
        </p>
      </div>
    </main>
  );
}