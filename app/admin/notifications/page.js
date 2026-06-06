"use client";

import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");

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

  const sendNotification = async () => {
    if (!title || !message) {
      setPopupMessage("Please enter notification title and message.");
      return;
    }

    await addDoc(collection(db, "notifications"), {
      title,
      message,
      type: "manual",
      link: "/notifications",
      createdAt: serverTimestamp(),
    });

    setTitle("");
    setMessage("");
    setPopupMessage("Notification sent successfully.");
    loadNotifications();
  };

  const deleteNotification = async (id) => {
    await deleteDoc(doc(db, "notifications", id));
    setPopupMessage("Notification deleted successfully.");
    loadNotifications();
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-white px-5 py-6">
      <div className="max-w-3xl mx-auto">
        <a
          href="/admin"
          className="inline-block rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold"
        >
          ← Back to Admin
        </a>

        <h1 className="mt-8 text-3xl font-black">Notifications</h1>

        <section className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-5">
          <input
            type="text"
            placeholder="Notification Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none"
          />

          <textarea
            placeholder="Notification Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="5"
            className="mt-4 w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none"
          />

          <button
            onClick={sendNotification}
            className="mt-4 w-full rounded-2xl bg-purple-600 p-4 font-bold"
          >
            Send Manual Notification
          </button>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-2xl font-black">Current Notifications</h2>

          {notifications.length === 0 ? (
            <p className="text-white/60">No notifications yet.</p>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-white/15 bg-white/10 p-5"
              >
                <p className="text-sm font-bold text-purple-300">
                  {item.type || "church"}
                </p>

                <h3 className="mt-2 text-xl font-black">{item.title}</h3>

                <p className="mt-3 text-white/70 leading-7">
                  {item.message}
                </p>

                <button
                  onClick={() => deleteNotification(item.id)}
                  className="mt-4 rounded-2xl bg-red-600 px-5 py-3 font-bold"
                >
                  Delete Notification
                </button>
              </div>
            ))
          )}
        </section>

        {popupMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5">
            <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-[#0F172A] p-6 text-center shadow-2xl">
              <img
                src="/church-logo.png"
                alt="Agape Bible Church Logo"
                className="mx-auto h-24 w-24 object-contain"
              />

              <div className="mt-4 text-5xl">✅</div>

              <h2 className="mt-2 text-2xl font-black">Notification</h2>

              <p className="mt-4 text-white/70 leading-7">{popupMessage}</p>

              <button
                onClick={() => setPopupMessage("")}
                className="mt-6 w-full rounded-2xl bg-purple-600 p-4 font-bold"
              >
                Okay
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}