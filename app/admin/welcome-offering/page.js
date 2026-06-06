"use client";

import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function WelcomeOfferingPage() {
  const [firstServiceFamily1, setFirstServiceFamily1] = useState("");
  const [firstServiceArea1, setFirstServiceArea1] = useState("");
  const [firstServiceFamily2, setFirstServiceFamily2] = useState("");
  const [firstServiceArea2, setFirstServiceArea2] = useState("");

  const [secondServiceFamily1, setSecondServiceFamily1] = useState("");
  const [secondServiceArea1, setSecondServiceArea1] = useState("");
  const [secondServiceFamily2, setSecondServiceFamily2] = useState("");
  const [secondServiceArea2, setSecondServiceArea2] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadWelcomeOffering();
  }, []);

  const loadWelcomeOffering = async () => {
    const docRef = doc(db, "settings", "welcomeOffering");
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      setFirstServiceFamily1(data.firstServiceFamily1 || "");
      setFirstServiceArea1(data.firstServiceArea1 || "");
      setFirstServiceFamily2(data.firstServiceFamily2 || "");
      setFirstServiceArea2(data.firstServiceArea2 || "");
      setSecondServiceFamily1(data.secondServiceFamily1 || "");
      setSecondServiceArea1(data.secondServiceArea1 || "");
      setSecondServiceFamily2(data.secondServiceFamily2 || "");
      setSecondServiceArea2(data.secondServiceArea2 || "");
    }
  };

  const saveWelcomeOffering = async () => {
    await setDoc(doc(db, "settings", "welcomeOffering"), {
      firstServiceFamily1,
      firstServiceArea1,
      firstServiceFamily2,
      firstServiceArea2,
      secondServiceFamily1,
      secondServiceArea1,
      secondServiceFamily2,
      secondServiceArea2,
      updatedAt: serverTimestamp(),
    });

await addDoc(collection(db, "notifications"), {
  title: "Welcome & Offering Updated",
  message: `This week's families: ${firstServiceFamily1}, ${firstServiceFamily2}, ${secondServiceFamily1}, ${secondServiceFamily2}. Tap to view details.`,
  type: "welcome-offering",
  link: "/home",
  createdAt: serverTimestamp(),
});
    setMessage("Welcome & Offering updated successfully.");
  };

  const deleteWelcomeOffering = async () => {
    await deleteDoc(doc(db, "settings", "welcomeOffering"));

    setFirstServiceFamily1("");
    setFirstServiceArea1("");
    setFirstServiceFamily2("");
    setFirstServiceArea2("");
    setSecondServiceFamily1("");
    setSecondServiceArea1("");
    setSecondServiceFamily2("");
    setSecondServiceArea2("");

    setMessage("Welcome & Offering deleted successfully.");
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

        <h1 className="mt-8 text-3xl font-black">
          Welcome & Offering Management
        </h1>

        <p className="mt-2 text-white/60">
          Current week only. Saving new data replaces old data.
        </p>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
            <h2 className="text-2xl font-black text-purple-300">First Service</h2>

            <input
              type="text"
              placeholder="Family 1 Name"
              value={firstServiceFamily1}
              onChange={(e) => setFirstServiceFamily1(e.target.value)}
              className="mt-4 w-full rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            />

            <input
              type="text"
              placeholder="Family 1 Area"
              value={firstServiceArea1}
              onChange={(e) => setFirstServiceArea1(e.target.value)}
              className="mt-4 w-full rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            />

            <input
              type="text"
              placeholder="Family 2 Name"
              value={firstServiceFamily2}
              onChange={(e) => setFirstServiceFamily2(e.target.value)}
              className="mt-4 w-full rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            />

            <input
              type="text"
              placeholder="Family 2 Area"
              value={firstServiceArea2}
              onChange={(e) => setFirstServiceArea2(e.target.value)}
              className="mt-4 w-full rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            />
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
            <h2 className="text-2xl font-black text-purple-300">Second Service</h2>

            <input
              type="text"
              placeholder="Family 1 Name"
              value={secondServiceFamily1}
              onChange={(e) => setSecondServiceFamily1(e.target.value)}
              className="mt-4 w-full rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            />

            <input
              type="text"
              placeholder="Family 1 Area"
              value={secondServiceArea1}
              onChange={(e) => setSecondServiceArea1(e.target.value)}
              className="mt-4 w-full rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            />

            <input
              type="text"
              placeholder="Family 2 Name"
              value={secondServiceFamily2}
              onChange={(e) => setSecondServiceFamily2(e.target.value)}
              className="mt-4 w-full rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            />

            <input
              type="text"
              placeholder="Family 2 Area"
              value={secondServiceArea2}
              onChange={(e) => setSecondServiceArea2(e.target.value)}
              className="mt-4 w-full rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <button
            onClick={saveWelcomeOffering}
            className="w-full rounded-2xl bg-purple-600 p-4 font-bold"
          >
            Save Welcome & Offering
          </button>

          <button
            onClick={deleteWelcomeOffering}
            className="w-full rounded-2xl bg-red-600 p-4 font-bold"
          >
            Delete Current Week
          </button>
        </div>

        {message && <p className="mt-5 text-purple-300">{message}</p>}
      </div>
    </main>
  );
}