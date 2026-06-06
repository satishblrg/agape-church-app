"use client";

import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function AdminMembersPage() {
  const [members, setMembers] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    const snapshot = await getDocs(collection(db, "users"));

    const data = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    setMembers(data);
  };

  const approveVolunteer = async (id) => {
    await updateDoc(doc(db, "users", id), {
      isVolunteer: true,
      volunteerStatus: "Approved",
    });

    setPopupMessage("Volunteer approved successfully.");
    loadMembers();
  };

  const removeVolunteer = async (id) => {
    await updateDoc(doc(db, "users", id), {
      isVolunteer: false,
      volunteerStatus: "Rejected",
    });

    setPopupMessage("Volunteer removed successfully.");
    loadMembers();
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-white px-5 py-6">
      <div className="max-w-6xl mx-auto">
        <a
          href="/admin"
          className="inline-block rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold"
        >
          ← Back to Admin
        </a>

        <h1 className="mt-8 text-3xl font-black">Member Management</h1>

        <section className="mt-8 space-y-4">
          {members.length === 0 ? (
            <p className="text-white/60">No members found.</p>
          ) : (
            members.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-white/15 bg-white/10 p-5"
              >
                <h2 className="text-xl font-black text-purple-300">
                  {item.fullName}
                </h2>

                <div className="mt-4 grid gap-3 md:grid-cols-3 text-white/70">
                  <p>
                    <strong>Email:</strong>
                    <br />
                    {item.email || "-"}
                  </p>

                  <p>
                    <strong>Phone:</strong>
                    <br />
                    {item.phone || "-"}
                  </p>

                  <p>
                    <strong>Gender:</strong>
                    <br />
                    {item.gender || "-"}
                  </p>

                  <p>
                    <strong>DOB:</strong>
                    <br />
                    {item.dob || "-"}
                  </p>

                  <p>
                    <strong>Area:</strong>
                    <br />
                    {item.area || "-"}
                  </p>

                  <p>
                    <strong>Area Leader:</strong>
                    <br />
                    {item.areaLeader || "-"}
                  </p>

                  <p>
                    <strong>Member Type:</strong>
                    <br />
                    {item.memberType || "-"}
                  </p>

                  <p>
                    <strong>Volunteer Status:</strong>
                    <br />
                    {item.volunteerStatus || "-"}
                  </p>
                </div>

                {item.memberType === "Volunteer" && (
                  <div className="mt-5">
                    {item.volunteerStatus === "Pending" && (
                      <div className="grid gap-3 md:grid-cols-2">
                        <button
                          onClick={() => approveVolunteer(item.id)}
                          className="rounded-2xl bg-green-600 p-3 font-bold"
                        >
                          Approve Volunteer
                        </button>

                        <button
                          onClick={() => removeVolunteer(item.id)}
                          className="rounded-2xl bg-red-600 p-3 font-bold"
                        >
                          Reject Volunteer
                        </button>
                      </div>
                    )}

                    {item.volunteerStatus === "Approved" && (
                      <button
                        onClick={() => removeVolunteer(item.id)}
                        className="w-full rounded-2xl bg-red-600 p-3 font-bold"
                      >
                        Remove Volunteer
                      </button>
                    )}

                    {item.volunteerStatus === "Rejected" && (
                      <button
                        onClick={() => approveVolunteer(item.id)}
                        className="w-full rounded-2xl bg-green-600 p-3 font-bold"
                      >
                        Approve Volunteer
                      </button>
                    )}
                  </div>
                )}
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

              <h2 className="mt-2 text-2xl font-black">Members</h2>

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