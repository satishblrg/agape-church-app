"use client";

import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

export default function AdminAnnouncementsPage() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    const snapshot = await getDocs(collection(db, "announcements"));

    const data = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    setAnnouncements(data);
  };

  const addAnnouncement = async () => {
    if (!title || !details) {
      setMessage("Please enter title and details.");
      return;
    }

    await addDoc(collection(db, "announcements"), {
      title,
      details,
      active: true,
      createdAt: serverTimestamp(),
    });

    await addDoc(collection(db, "notifications"), {
  title: "New Announcement",
  message: "Tap to read the announcement.",
  type: "announcement",
  link: "/home",
  createdAt: serverTimestamp(),
});

    setTitle("");
    setDetails("");
    setMessage("Announcement added successfully.");

    loadAnnouncements();
  };

  const deleteAnnouncement = async (id) => {
    await deleteDoc(doc(db, "announcements", id));
    setMessage("Announcement deleted successfully.");
    loadAnnouncements();
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-white px-5 py-6">
      <div className="max-w-xl mx-auto">
        <a
          href="/admin"
          className="inline-block rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold"
        >
          ← Back to Admin
        </a>

        <h1 className="mt-8 text-3xl font-black">Manage Announcements</h1>

        <div className="mt-8 space-y-4">
          <input
            type="text"
            placeholder="Announcement Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none"
          />

          <textarea
            placeholder="Announcement Details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows="5"
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none"
          />

          <button
            onClick={addAnnouncement}
            className="w-full rounded-2xl bg-purple-600 p-4 font-bold"
          >
            Add Announcement
          </button>
        </div>

        {message && <p className="mt-5 text-purple-300">{message}</p>}

        <section className="mt-10">
          <h2 className="text-2xl font-black">Current Announcements</h2>

          <div className="mt-4 space-y-4">
            {announcements.length === 0 ? (
              <p className="text-white/60">No announcements added yet.</p>
            ) : (
              announcements.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-white/15 bg-white/10 p-5"
                >
                  <h3 className="text-xl font-black text-purple-300">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-white/70 leading-7">
                    {item.details}
                  </p>

                  <button
                    onClick={() => deleteAnnouncement(item.id)}
                    className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}