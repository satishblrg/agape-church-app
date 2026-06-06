"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function PrayerWallPage() {
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

  return (
    <main className="min-h-screen bg-[#0F172A] text-white px-5 py-6">
      <div className="max-w-3xl mx-auto">
        <a
          href="/notifications"
          className="inline-block rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold"
        >
          ← Back to Notifications
        </a>

        <div className="mt-8 text-center">
          <img
            src="/church-logo.png"
            alt="Agape Bible Church Logo"
            className="mx-auto h-24 w-24 object-contain"
          />

          <h1 className="mt-4 text-3xl font-black">Prayer Wall</h1>

          <p className="mt-2 text-white/60">
            Approved prayer requests from church members.
          </p>
        </div>

        <section className="mt-8 space-y-4">
          {approvedRequests.length === 0 ? (
            <p className="text-center text-white/60">
              No approved prayer requests yet.
            </p>
          ) : (
            approvedRequests.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-white/15 bg-white/10 p-5"
              >
                <h2 className="text-xl font-black text-purple-300">
                  {item.name}
                </h2>

                {item.area && (
                  <p className="mt-2 text-white/60">
                    Area: {item.area}
                  </p>
                )}

                {item.showPhone && item.phone && (
                  <p className="mt-2 text-white/60">
                    Phone: {item.phone}
                  </p>
                )}

                <p className="mt-4 text-white/70 leading-7">
                  {item.request}
                </p>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}