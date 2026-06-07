"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "/login";
        return;
      }

      try {
        const profileRef = doc(db, "users", user.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          setUserData(profileSnap.data());
          setLoading(false);
          return;
        }

        const userQuery = query(
          collection(db, "users"),
          where("email", "==", user.email)
        );

        const snapshot = await getDocs(userQuery);

        if (!snapshot.empty) {
          setUserData(snapshot.docs[0].data());
        } else {
          setPopupMessage(
            `Profile not found for ${user.email}. Please signup again or contact admin.`
          );
        }
      } catch (error) {
        setPopupMessage(error.message);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getInitials = (name) => {
    if (!name) return "P";

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("userEmail");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center">
        <p className="text-white/70">Loading profile...</p>
      </main>
    );
  }

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
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-4 border-purple-500 bg-purple-600 text-4xl font-black text-white shadow-xl">
            {getInitials(userData?.fullName)}
          </div>

          <h1 className="mt-4 text-3xl font-black">
            {userData?.fullName || "My Profile"}
          </h1>

          <p className="mt-2 text-white/60">
            {userData?.memberType || "Church Member"}
          </p>
        </div>

        {userData && (
          <section className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-6">
            <h2 className="text-2xl font-black text-purple-300">
              Personal Details
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2 text-white/70">
              <p>
                <strong className="text-purple-300">Name:</strong>
                <br />
                {userData.fullName || "-"}
              </p>

              <p>
                <strong className="text-purple-300">Gender:</strong>
                <br />
                {userData.gender || "-"}
              </p>

              <p>
                <strong className="text-purple-300">Date of Birth:</strong>
                <br />
                {userData.dob || "-"}
              </p>

              <p>
                <strong className="text-purple-300">Phone Number:</strong>
                <br />
                {userData.phone || "-"}
              </p>

              <p>
                <strong className="text-purple-300">Email:</strong>
                <br />
                {userData.email || "-"}
              </p>

              <p>
                <strong className="text-purple-300">Area:</strong>
                <br />
                {userData.area || "-"}
              </p>

              <p>
                <strong className="text-purple-300">Area Leader:</strong>
                <br />
                {userData.areaLeader || "-"}
              </p>

              <p>
                <strong className="text-purple-300">Member Type:</strong>
                <br />
                {userData.memberType || "-"}
              </p>

              <p>
                <strong className="text-purple-300">Volunteer Status:</strong>
                <br />
                {userData.volunteerStatus || "-"}
              </p>

              <p>
                <strong className="text-purple-300">Marital Status:</strong>
                <br />
                {userData.maritalStatus || "-"}
              </p>
            </div>

            {userData.maritalStatus === "Married" && (
              <div className="mt-8">
                <h2 className="text-2xl font-black text-purple-300">
                  Family Details
                </h2>

                <div className="mt-5 grid gap-4 md:grid-cols-2 text-white/70">
                  <p>
                    <strong className="text-purple-300">Spouse Name:</strong>
                    <br />
                    {userData.spouseName || "-"}
                  </p>

                  <p>
                    <strong className="text-purple-300">
                      Wedding Anniversary:
                    </strong>
                    <br />
                    {userData.anniversaryDate || "-"}
                  </p>
                </div>

                {userData.children && userData.children.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xl font-black text-purple-300">
                      Children
                    </h3>

                    <div className="mt-4 space-y-3">
                      {userData.children.map((child, index) => (
                        <div
                          key={index}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4"
                        >
                          <p className="text-white/80">
                            <strong className="text-purple-300">
                              Child {index + 1}:
                            </strong>{" "}
                            {child.name || "-"}
                          </p>

                          <p className="mt-2 text-white/60">
                            <strong>DOB:</strong> {child.dob || "-"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <a
              href="/edit-profile"
              className="mt-8 block w-full rounded-2xl bg-purple-600 p-4 text-center font-bold"
            >
              Edit Profile
            </a>

            <button
              onClick={handleLogout}
              className="mt-4 w-full rounded-2xl bg-red-600 p-4 font-bold"
            >
              Logout
            </button>
          </section>
        )}

        {popupMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5">
            <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-[#0F172A] p-6 text-center shadow-2xl">
              <img
                src="/church-logo.png"
                alt="Agape Bible Church Logo"
                className="mx-auto h-24 w-24 object-contain"
              />

              <h2 className="mt-4 text-2xl font-black">Profile</h2>

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