"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function AdminPage() {
      const router = useRouter();


  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");

if (adminLoggedIn !== "true") {
  router.push("/home");
}
  }, []);
  return (
    <main className="min-h-screen bg-[#0F172A] text-white px-5 py-6">
      <header className="text-center">
        <img
          src="/church-logo.png"
          alt="Agape Bible Church Logo"
          className="mx-auto h-24 w-24 object-contain"
        />

        <h1 className="mt-3 text-3xl font-black">Admin Panel</h1>



        <p className="mt-1 text-white/60">
          Manage Agape Bible Church App
        </p>
      </header>

<button
  onClick={() => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminEmail");
    window.location.href = "/admin-login";
  }}
  className="mt-4 rounded-2xl bg-red-600 px-5 py-3 font-bold text-white"
>
  Logout
</button>

<section className="mt-8 grid grid-cols-1 gap-4">
       <a
  href="/admin/announcements"
  className="rounded-3xl border border-white/15 bg-white/10 p-5 text-left backdrop-blur-xl block"
>
          <div className="text-3xl">📢</div>
          <h2 className="mt-3 text-xl font-black">Manage Announcements</h2>
          <p className="mt-2 text-white/60">
            Add, edit, and remove weekly church announcements.
          </p>
        </a>

     <a
  href="/admin/events"
  className="rounded-3xl border border-white/15 bg-white/10 p-5 text-left backdrop-blur-xl block"
>
          <div className="text-3xl">📅</div>
          <h2 className="mt-3 text-xl font-black">Manage Events</h2>
          <p className="mt-2 text-white/60">
            Update weekly events, fasting prayer areas, and special meetings.
          </p>
        </a>

       <a
  href="/admin/prayer-requests"
  className="rounded-3xl border border-white/15 bg-white/10 p-5 text-left backdrop-blur-xl block"
>
          <div className="text-3xl">🙏</div>
          <h2 className="mt-3 text-xl font-black">Prayer Requests</h2>
          <p className="mt-2 text-white/60">
            View prayer requests submitted by members.
          </p>
       </a>

<a
  href="/admin/welcome-offering"
  className="rounded-3xl border border-white/15 bg-white/10 p-5 text-left backdrop-blur-xl block"
>
  <div className="text-3xl">🤝</div>
  <h2 className="mt-3 text-xl font-black">Welcome & Offering</h2>
  <p className="mt-2 text-white/60">
    Update weekly welcome and offering families.
  </p>
</a>
    
        <a
  href="/admin/attendance"
  className="rounded-3xl border border-white/15 bg-white/10 p-5 text-left backdrop-blur-xl block"
>
  <div className="text-3xl">✅</div>
  <h2 className="mt-3 text-xl font-black">Volunteer Attendance</h2>
  <p className="mt-2 text-white/60">
    View volunteer attendance, reports, and Excel export.
  </p>
</a>

<a
  href="/admin/members"
  className="rounded-3xl border border-white/15 bg-white/10 p-5 text-left backdrop-blur-xl block"
>
  <div className="text-3xl">👥</div>
  <h2 className="mt-3 text-xl font-black">Member Management</h2>
  <p className="mt-2 text-white/60">
    View members and approve volunteers.
  </p>
</a>

        <button className="rounded-3xl border border-white/15 bg-white/10 p-5 text-left backdrop-blur-xl">
          <div className="text-3xl">🔔</div>
          <h2 className="mt-3 text-xl font-black">Send Notifications</h2>
          <p className="mt-2 text-white/60">
            Send updates and reminders to app users.
          </p>
        </button>
      </section>
    </main>
  );
}