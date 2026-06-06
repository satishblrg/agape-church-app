"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const snapshot = await getDocs(collection(db, "notifications"));

    const data = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    setNotifications(data.reverse());
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-white px-5 py-6">
      <div className="max-w-3xl mx-auto">
        <a
          href="/home"
          className="inline-block rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold"
        >
          ← Back Home
        </a>

        <div className="mt-8 text-center">
          <img
            src="/church-logo.png"
            alt="Agape Bible Church Logo"
            className="mx-auto h-24 w-24 object-contain"
          />

          <h1 className="mt-4 text-3xl font-black">Notifications</h1>

          <p className="mt-2 text-white/60">
            Latest updates from Agape Bible Church
          </p>
        </div>

        <section className="mt-8 space-y-4">
          {notifications.length === 0 ? (
            <p className="text-center text-white/60">
              No notifications available.
            </p>
          ) : (
            notifications.map((item) => (
              <a
  key={item.id}
  href={item.link || "/home"}
  className="block rounded-3xl border border-white/15 bg-white/10 p-5"
>
                <p className="text-sm font-bold text-purple-300">
                  {item.type || "church"}
                </p>

                <h2 className="mt-2 text-xl font-black">{item.title}</h2>

                <p className="mt-3 text-white/70 leading-7">
                  {item.message}
                </p>
              </a>
            ))
          )}
        </section>
      </div>
    </main>
  );
}