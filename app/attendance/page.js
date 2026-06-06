"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
 collection,
addDoc,
doc,
getDoc,
updateDoc,
serverTimestamp,
query,
where,
getDocs,
} from "firebase/firestore";

export default function AttendancePage() {
  const churchLat = 13.0132109;
  const churchLng = 77.6200514;
  const allowedRadiusMeters = 50;

  const [name, setName] = useState("");
  const [recordId, setRecordId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginTime, setLoginTime] = useState("");
  const [duration, setDuration] = useState("00:00:00");
  const [locationStatus, setLocationStatus] = useState("Not checked");
  const [warnings, setWarnings] = useState(0);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    let timer;

    if (loggedIn) {
      timer = setInterval(() => {
        updateDuration();
        checkLocationDuringAttendance();
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [loggedIn, loginTime, warnings]);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Location is not supported on this device.");
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position.coords);
        },
        () => {
          reject("Please turn ON location and allow location permission.");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  const isInsideChurch = async () => {
    const coords = await getCurrentLocation();

    const distance = getDistance(
      coords.latitude,
      coords.longitude,
      churchLat,
      churchLng
    );

    return {
      inside: distance <= allowedRadiusMeters,
      distance: Math.round(distance),
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
  };

  const handleLogin = async () => {
    if (!name) {
      setPopupMessage("Please enter your name before login.");
      return;
    }

    try {
      const userEmail = localStorage.getItem("userEmail");

if (!userEmail) {
  setPopupMessage("Please login before marking attendance.");
  return;
}

const userCheck = query(
  collection(db, "users"),
  where("email", "==", userEmail)
);

const userSnapshot = await getDocs(userCheck);

if (userSnapshot.empty) {
  setPopupMessage("User profile not found. Please contact admin.");
  return;
}

const userData = userSnapshot.docs[0].data();

if (userData.memberType !== "Volunteer") {
  setPopupMessage("Only volunteers can mark attendance.");
  return;
}

if (userData.volunteerStatus !== "Approved") {
  setPopupMessage("Your volunteer access is not approved yet. Please contact admin.");
  return;
}
        const activeCheck = query(
  collection(db, "attendance"),
  where("name", "==", name),
  where("status", "==", "Active")
);

const activeSnapshot = await getDocs(activeCheck);

if (!activeSnapshot.empty) {
  setPopupMessage("You already have an active attendance session. Please logout first.");
  return;
}
      const location = await isInsideChurch();

      if (!location.inside) {
        setLocationStatus(`Outside church area - ${location.distance} meters away`);
        setPopupMessage(
          `You are ${location.distance} meters away from church. Attendance login is allowed only inside church premises.`
        );
        return;
      }

      const now = new Date();
      const loginTimeText = now.toLocaleTimeString();

      const docRef = await addDoc(collection(db, "attendance"), {
        name,
        date: now.toLocaleDateString(),
        loginTime: loginTimeText,
        logoutTime: "",
        totalMinutes: 0,
        warnings: 0,
        status: "Active",
        loginLatitude: location.latitude,
        loginLongitude: location.longitude,
        createdAt: serverTimestamp(),
      });

      setRecordId(docRef.id);
      setLoggedIn(true);
      setLoginTime(now.toISOString());
      setLocationStatus("Inside church premises");
      setWarnings(0);
      setPopupMessage("Attendance login marked successfully.");
    } catch (error) {
      setPopupMessage(String(error));
    }
  };

  const checkLocationDuringAttendance = async () => {
    try {
      const location = await isInsideChurch();

      if (!location.inside) {
        const newWarnings = warnings + 1;
        setWarnings(newWarnings);
        setLocationStatus(`Outside church area - ${location.distance} meters away`);
      } else {
        setLocationStatus("Inside church premises");
      }
    } catch {
      const newWarnings = warnings + 1;
      setWarnings(newWarnings);
      setLocationStatus("Location turned off or permission denied");
    }
  };

  const updateDuration = () => {
    if (!loginTime) return;

    const start = new Date(loginTime);
    const now = new Date();
    const diff = Math.floor((now - start) / 1000);

    const hours = String(Math.floor(diff / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
    const seconds = String(diff % 60).padStart(2, "0");

    setDuration(`${hours}:${minutes}:${seconds}`);
  };

  const handleLogout = async () => {
    if (!recordId) {
      setPopupMessage("No active attendance record found.");
      return;
    }

    try {
      const location = await isInsideChurch();

      if (!location.inside) {
        setPopupMessage(
          `You are ${location.distance} meters away from church. Logout is allowed only inside church premises.`
        );
        return;
      }

      const now = new Date();
      const start = new Date(loginTime);
      const totalMinutes = Math.floor((now - start) / 60000);

      await updateDoc(doc(db, "attendance", recordId), {
        logoutTime: now.toLocaleTimeString(),
        totalMinutes,
        warnings,
        status: warnings > 2 ? "Suspicious" : "Valid",
        logoutLatitude: location.latitude,
        logoutLongitude: location.longitude,
        updatedAt: serverTimestamp(),
      });

      setLoggedIn(false);
      setRecordId("");
      setLoginTime("");
      setDuration("00:00:00");
      setLocationStatus("Logged out");
      setPopupMessage("Attendance logout marked successfully.");
    } catch (error) {
      setPopupMessage(String(error));
    }
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-white px-5 py-6">
      <div className="max-w-xl mx-auto">
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

          <h1 className="mt-4 text-3xl font-black">
            Volunteer Attendance
          </h1>

          <p className="mt-2 text-white/60">
            Location must remain ON while attendance is active.
          </p>
        </div>

        <section className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-5">
          <input
            type="text"
            placeholder="Volunteer Name"
            value={name}
            disabled={loggedIn}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none"
          />

          <div className="mt-5 space-y-3 text-white/70">
            <p>
              <strong className="text-purple-300">Status:</strong>{" "}
              {loggedIn ? "Logged In" : "Not Logged In"}
            </p>

            <p>
              <strong className="text-purple-300">Location:</strong>{" "}
              {locationStatus}
            </p>

            <p>
              <strong className="text-purple-300">Warnings:</strong>{" "}
              {warnings}
            </p>

            <p>
              <strong className="text-purple-300">Current Duration:</strong>{" "}
              {duration}
            </p>
          </div>

          {!loggedIn ? (
            <button
              onClick={handleLogin}
              className="mt-6 w-full rounded-2xl bg-green-600 p-4 font-bold"
            >
              Login Attendance
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="mt-6 w-full rounded-2xl bg-red-600 p-4 font-bold"
            >
              Logout Attendance
            </button>
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

              <h2 className="mt-4 text-2xl font-black">
                Attendance
              </h2>

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
      </div>
    </main>
  );
}