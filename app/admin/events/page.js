"use client";

import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function AdminEventsPage() {
  const [fridayTime, setFridayTime] = useState("");
  const [fridayHost1, setFridayHost1] = useState("");
  const [fridayArea1, setFridayArea1] = useState("");
  const [fridayHost2, setFridayHost2] = useState("");
  const [fridayArea2, setFridayArea2] = useState("");

  const [saturdayTime, setSaturdayTime] = useState("");
  const [saturdayHost1, setSaturdayHost1] = useState("");
  const [saturdayArea1, setSaturdayArea1] = useState("");
  const [saturdayHost2, setSaturdayHost2] = useState("");
  const [saturdayArea2, setSaturdayArea2] = useState("");
  const [churchFastingDetails, setChurchFastingDetails] = useState("");

  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const snapshot = await getDoc(doc(db, "settings", "weeklyEvents"));

    if (snapshot.exists()) {
      const data = snapshot.data();

      setFridayTime(data.fridayTime || "");
      setFridayHost1(data.fridayHost1 || "");
      setFridayArea1(data.fridayArea1 || "");
      setFridayHost2(data.fridayHost2 || "");
      setFridayArea2(data.fridayArea2 || "");

      setSaturdayTime(data.saturdayTime || "");
      setSaturdayHost1(data.saturdayHost1 || "");
      setSaturdayArea1(data.saturdayArea1 || "");
      setSaturdayHost2(data.saturdayHost2 || "");
      setSaturdayArea2(data.saturdayArea2 || "");
      setChurchFastingDetails(data.churchFastingDetails || "");

      setEventType(data.eventType || "");
      setEventDate(data.eventDate || "");
      setEventTime(data.eventTime || "");
      setEventLocation(data.eventLocation || "");
      setEventDescription(data.eventDescription || "");
    }
  };

  const saveFastingPrayer = async () => {
    const existingSnapshot = await getDoc(doc(db, "settings", "weeklyEvents"));
    const existingData = existingSnapshot.exists() ? existingSnapshot.data() : {};

    await setDoc(doc(db, "settings", "weeklyEvents"), {
      ...existingData,

      fridayTime,
      fridayHost1,
      fridayArea1,
      fridayHost2,
      fridayArea2,

      saturdayTime,
      saturdayHost1,
      saturdayArea1,
      saturdayHost2,
      saturdayArea2,
      churchFastingDetails,

      updatedAt: serverTimestamp(),
    });

    await addDoc(collection(db, "notifications"), {
  title: "Fasting Prayer Updated",
  message: "Tap to view fasting prayer details.",
  type: "event",
  link: "/home",
  createdAt: serverTimestamp(),
});

    setPopupMessage("Fasting prayer details saved successfully.");
  };

  const deleteFastingPrayer = async () => {
    const existingSnapshot = await getDoc(doc(db, "settings", "weeklyEvents"));
    const existingData = existingSnapshot.exists() ? existingSnapshot.data() : {};

    await setDoc(doc(db, "settings", "weeklyEvents"), {
      ...existingData,

      fridayTime: "",
      fridayHost1: "",
      fridayArea1: "",
      fridayHost2: "",
      fridayArea2: "",

      saturdayTime: "",
      saturdayHost1: "",
      saturdayArea1: "",
      saturdayHost2: "",
      saturdayArea2: "",
      churchFastingDetails: "",

      updatedAt: serverTimestamp(),
    });

    setFridayTime("");
    setFridayHost1("");
    setFridayArea1("");
    setFridayHost2("");
    setFridayArea2("");

    setSaturdayTime("");
    setSaturdayHost1("");
    setSaturdayArea1("");
    setSaturdayHost2("");
    setSaturdayArea2("");
    setChurchFastingDetails("");

    setPopupMessage("Fasting prayer details deleted successfully.");
  };

  const saveSpecialEvent = async () => {
    const existingSnapshot = await getDoc(doc(db, "settings", "weeklyEvents"));
    const existingData = existingSnapshot.exists() ? existingSnapshot.data() : {};

    await setDoc(doc(db, "settings", "weeklyEvents"), {
      ...existingData,

      eventType,
      eventDate,
      eventTime,
      eventLocation,
      eventDescription,

      updatedAt: serverTimestamp(),
    });

await addDoc(collection(db, "notifications"), {
  title: "New Church Event",
  message: "Tap to view event details.",
  type: "event",
  link: "/home",
  createdAt: serverTimestamp(),
});

    setPopupMessage("Special event saved successfully.");
  };

  const deleteSpecialEvent = async () => {
    const existingSnapshot = await getDoc(doc(db, "settings", "weeklyEvents"));
    const existingData = existingSnapshot.exists() ? existingSnapshot.data() : {};

    await setDoc(doc(db, "settings", "weeklyEvents"), {
      ...existingData,

      eventType: "",
      eventDate: "",
      eventTime: "",
      eventLocation: "",
      eventDescription: "",

      updatedAt: serverTimestamp(),
    });

    setEventType("");
    setEventDate("");
    setEventTime("");
    setEventLocation("");
    setEventDescription("");

    setPopupMessage("Special event deleted successfully.");
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-white px-5 py-6">
      <div className="max-w-5xl mx-auto">
        <a
          href="/admin"
          className="inline-block rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold"
        >
          ← Back to Admin
        </a>

        <h1 className="mt-8 text-3xl font-black">Manage Church Events</h1>

        <section className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-black text-purple-300">
              Friday Fasting Prayer
            </h2>

            <input
              type="time"
              placeholder="Time"
              value={fridayTime}
              onChange={(e) => setFridayTime(e.target.value)}
              className="rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            />
          </div>

          <div className="mt-5 grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Host 1 Name"
              value={fridayHost1}
              onChange={(e) => setFridayHost1(e.target.value)}
              className="rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            />

            <input
              type="text"
              placeholder="Host 1 Area / House"
              value={fridayArea1}
              onChange={(e) => setFridayArea1(e.target.value)}
              className="rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            />

            <input
              type="text"
              placeholder="Host 2 Name"
              value={fridayHost2}
              onChange={(e) => setFridayHost2(e.target.value)}
              className="rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            />

            <input
              type="text"
              placeholder="Host 2 Area / House"
              value={fridayArea2}
              onChange={(e) => setFridayArea2(e.target.value)}
              className="rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            />
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/15 bg-white/10 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-black text-purple-300">
              Saturday Fasting Prayer
            </h2>

            <input
              type="time"
              placeholder="Time"
              value={saturdayTime}
              onChange={(e) => setSaturdayTime(e.target.value)}
              className="rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            />
          </div>

          <div className="mt-5 grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Host 1 Name"
              value={saturdayHost1}
              onChange={(e) => setSaturdayHost1(e.target.value)}
              className="rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            />

            <input
              type="text"
              placeholder="Host 1 Area / House"
              value={saturdayArea1}
              onChange={(e) => setSaturdayArea1(e.target.value)}
              className="rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            />

            <input
              type="text"
              placeholder="Host 2 Name"
              value={saturdayHost2}
              onChange={(e) => setSaturdayHost2(e.target.value)}
              className="rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            />

            <input
              type="text"
              placeholder="Host 2 Area / House"
              value={saturdayArea2}
              onChange={(e) => setSaturdayArea2(e.target.value)}
              className="rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            />

            <input
              type="text"
              placeholder="Church Fasting Prayer Details"
              value={churchFastingDetails}
              onChange={(e) => setChurchFastingDetails(e.target.value)}
              className="md:col-span-2 rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            />
          </div>
        </section>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <button
            onClick={saveFastingPrayer}
            className="w-full rounded-2xl bg-purple-600 p-4 font-bold"
          >
            Save Fasting Prayer
          </button>

          <button
            onClick={deleteFastingPrayer}
            className="w-full rounded-2xl bg-red-600 p-4 font-bold"
          >
            Delete Fasting Prayer
          </button>
        </div>

        <section className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-6">
          <h2 className="text-2xl font-black text-purple-300">
            Special Event
          </h2>

          <div className="mt-5 grid md:grid-cols-2 gap-4">
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            >
              <option value="" className="text-black">
                Select Event Type
              </option>
              <option value="Special Event" className="text-black">
                Special Event
              </option>
              <option value="Guest Speaker" className="text-black">
                Guest Speaker
              </option>
              <option value="Youth Meeting" className="text-black">
                Youth Meeting
              </option>
              <option value="Christmas Service" className="text-black">
                Christmas Service
              </option>
              <option value="Good Friday Service" className="text-black">
                Good Friday Service
              </option>
              <option value="New Year Service" className="text-black">
                New Year Service
              </option>
            </select>

            <input
              type="date"
              placeholder="Event Date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            />

            <input
              type="time"
              placeholder="Event Time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            />

            <input
              type="text"
              placeholder="Event Location"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              className="rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            />

            <textarea
              placeholder="Event Description"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              rows="4"
              className="md:col-span-2 rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <button
              onClick={saveSpecialEvent}
              className="w-full rounded-2xl bg-purple-600 p-4 font-bold"
            >
              Save Special Event
            </button>

            <button
              onClick={deleteSpecialEvent}
              className="w-full rounded-2xl bg-red-600 p-4 font-bold"
            >
              Delete Special Event
            </button>
          </div>
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

              <h2 className="mt-2 text-2xl font-black">Events Updated</h2>

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