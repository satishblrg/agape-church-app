"use client";

import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import {
  collection,
addDoc,
getDocs,
doc,
updateDoc,
deleteDoc,
serverTimestamp,
} from "firebase/firestore";

export default function AdminPrayerRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [adminName, setAdminName] = useState("");
const [adminPhone, setAdminPhone] = useState("");
const [adminArea, setAdminArea] = useState("");
const [adminPrayer, setAdminPrayer] = useState("");

  useEffect(() => {
    loadPrayerRequests();
  }, []);

  const loadPrayerRequests = async () => {
    const snapshot = await getDocs(collection(db, "prayerRequests"));

    const data = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    setRequests(data);
  };

  const approveHidePhone = async (id) => {
    await updateDoc(doc(db, "prayerRequests", id), {
      approved: true,
      showPhone: false,
    });

    await addDoc(collection(db, "notifications"), {
  title: "New Prayer Request",
  message: "Tap to read the prayer request.",
  type: "prayer",
  link: "/prayer-wall",
  createdAt: serverTimestamp(),
});

    setMessage("Prayer request approved with phone hidden.");
    loadPrayerRequests();
  };

  const approveShowPhone = async (id) => {
    await updateDoc(doc(db, "prayerRequests", id), {
      approved: true,
      showPhone: true,
    });

    await addDoc(collection(db, "notifications"), {
  title: "New Prayer Request",
  message: "Tap to read the prayer request.",
  type: "prayer",
  link: "/prayer-wall",
  createdAt: serverTimestamp(),
});

    setMessage("Prayer request approved with phone visible.");
    loadPrayerRequests();
  };

  const deleteRequest = async (id) => {
    await deleteDoc(doc(db, "prayerRequests", id));

    setMessage("Prayer request deleted.");
    loadPrayerRequests();
  };

const addPrayerRequestForMember = async (showPhone = false) => {
  if (!adminName || !adminPrayer) {
    setMessage("Please enter name and prayer request.");
    return;
  }

  await addDoc(collection(db, "prayerRequests"), {
    name: adminName,
    phone: adminPhone,
    area: adminArea,
    request: adminPrayer,

    approved: true,
    showPhone,

    createdBy: "Admin",
    createdAt: serverTimestamp(),
  });
  await addDoc(collection(db, "notifications"), {
  title: "New Prayer Request",
  message: "Tap to read the prayer request.",
  type: "prayer",
 link: "/prayer-wall",
  createdAt: serverTimestamp(),
});

  setAdminName("");
  setAdminPhone("");
  setAdminArea("");
  setAdminPrayer("");

  setMessage("Prayer request added successfully.");

  loadPrayerRequests();
};

  return (
    <main className="min-h-screen bg-[#0F172A] text-white px-5 py-6">
      <div className="max-w-4xl mx-auto">
        <a
          href="/admin"
          className="inline-block rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold"
        >
          ← Back to Admin
        </a>

        <h1 className="mt-8 text-3xl font-black">Prayer Requests</h1>

        <p className="mt-2 text-white/60">
          Approve prayer requests and choose whether phone number is visible.
        </p>

        {message && <p className="mt-5 text-purple-300">{message}</p>}

        <section className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-5">
  <h2 className="text-2xl font-black text-purple-300">
    Add Prayer Request for Member
  </h2>

  <p className="mt-2 text-white/60">
    Use this when someone calls pastor/admin and shares a prayer request.
  </p>

  <div className="mt-5 grid gap-4 md:grid-cols-2">
    <input
      type="text"
      placeholder="Name"
      value={adminName}
      onChange={(e) => setAdminName(e.target.value)}
      className="rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
    />

    <input
      type="tel"
      placeholder="Phone Number"
      value={adminPhone}
      onChange={(e) => setAdminPhone(e.target.value)}
      className="rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
    />

    <input
      type="text"
      placeholder="Area Name"
      value={adminArea}
      onChange={(e) => setAdminArea(e.target.value)}
      className="rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
    />

    <textarea
      placeholder="Prayer Request"
      value={adminPrayer}
      onChange={(e) => setAdminPrayer(e.target.value)}
      rows="4"
      className="md:col-span-2 rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
    />
  </div>

  <div className="mt-5 grid gap-4 md:grid-cols-2">
    <button
      onClick={() => addPrayerRequestForMember(false)}
      className="rounded-2xl bg-green-600 p-4 font-bold"
    >
      Add & Hide Phone
    </button>

    <button
      onClick={() => addPrayerRequestForMember(true)}
      className="rounded-2xl bg-blue-600 p-4 font-bold"
    >
      Add & Show Phone
    </button>
  </div>
</section>

        <section className="mt-8 space-y-5">
          {requests.length === 0 ? (
            <p className="text-white/60">No prayer requests yet.</p>
          ) : (
            requests.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-white/15 bg-white/10 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-black text-purple-300">
                    {item.name}
                  </h2>

                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                    {item.approved ? "Approved" : "Pending"}
                  </span>
                </div>

                <p className="mt-3 text-white/70">
                  <strong>Phone:</strong> {item.phone}
                </p>

                <p className="mt-2 text-white/70">
                  <strong>Area:</strong> {item.area}
                </p>

                <p className="mt-4 text-white/80 leading-7">
                  {item.request}
                </p>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <button
                    onClick={() => approveHidePhone(item.id)}
                    className="rounded-2xl bg-green-600 p-3 font-bold"
                  >
                    Approve - Hide Phone
                  </button>

                  <button
                    onClick={() => approveShowPhone(item.id)}
                    className="rounded-2xl bg-blue-600 p-3 font-bold"
                  >
                    Approve - Show Phone
                  </button>

                  <button
                    onClick={() => deleteRequest(item.id)}
                    className="rounded-2xl bg-red-600 p-3 font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}