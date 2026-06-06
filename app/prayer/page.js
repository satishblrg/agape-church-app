"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

export default function PrayerPage() {
  const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [area, setArea] = useState("");
const [request, setRequest] = useState("");
 const [popupMessage, setPopupMessage] = useState("");
  const [approvedRequests, setApprovedRequests] = useState([]);

  useEffect(() => {
    loadApprovedRequests();
  }, []);

  const loadApprovedRequests = async () => {
    const snapshot = await getDocs(collection(db, "prayerRequests"));

    const data = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((item) => item.approved === true);

    setApprovedRequests(data);
  };

  const submitPrayerRequest = async () => {
    if (!name || !phone || !area || !request) {
  setPopupMessage("Please enter your name, phone number, area name, and prayer request.");
  return;
}
if (!/^[6-9][0-9]{9}$/.test(phone)) {
  setPopupMessage(
    "Please enter a valid Indian mobile number."
  );
  return;
}

    await addDoc(collection(db, "prayerRequests"), {
  name,
  phone,
  area,
  request,
  approved: false,
  createdAt: serverTimestamp(),
});

    setName("");
    setRequest("");
   setPopupMessage("Prayer request submitted. It will appear after admin approval.");
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

        <h1 className="mt-8 text-3xl font-black">Prayer Requests</h1>

        <p className="mt-2 text-white/60">
          Submit your prayer request. Approved requests will be visible to the church family.
        </p>

        <section className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-5">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none"
          />
          <input
  type="tel"
  placeholder="Phone Number"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  className="mt-4 w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none"
/>

<input
  type="text"
  placeholder="Area Name"
  value={area}
  onChange={(e) => setArea(e.target.value)}
  className="mt-4 w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none"
/>

          <textarea
            placeholder="Prayer Request"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            rows="5"
            className="mt-4 w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none"
          />

          <button
            onClick={submitPrayerRequest}
            className="mt-4 w-full rounded-2xl bg-purple-600 p-4 font-bold"
          >
            Submit Prayer Request
          </button>

        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-black">Prayer Wall</h2>

          <div className="mt-4 space-y-4">
            {approvedRequests.length === 0 ? (
              <p className="text-white/60">No approved prayer requests yet.</p>
            ) : (
              approvedRequests.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-white/15 bg-white/10 p-5"
                >
                  <h3 className="font-black text-purple-300">{item.name}</h3>

<p className="mt-2 text-white/60">
  Area: {item.area}
</p>

{item.showPhone && (
  <p className="mt-2 text-white/60">
    Phone: {item.phone}
  </p>
)}

<p className="mt-3 text-white/70 leading-7">{item.request}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
      {popupMessage && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5">
    <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-[#0F172A] p-6 text-center shadow-2xl">
      <img
        src="/church-logo.png"
        alt="Agape Bible Church Logo"
        className="mx-auto h-24 w-24 object-contain"
      />

      <div className="mt-4 text-5xl">⚠️</div>

<h2 className="mt-2 text-2xl font-black">Prayer Request</h2>

      <p className="mt-4 text-white/70 leading-7">
        {popupMessage}
      </p>

      <button
        onClick={() => setPopupMessage("")}
        className="mt-6 w-full rounded-2xl bg-purple-600 p-4 font-bold"
      >
        Okay
      </button>
    </div>
  </div>
)}
    </main>
  );
}