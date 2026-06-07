"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditProfilePage() {
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(true);
  const [popupMessage, setPopupMessage] = useState("");

  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [area, setArea] = useState("");
  const [areaLeader, setAreaLeader] = useState("");
  const [memberType, setMemberType] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [spouseName, setSpouseName] = useState("");
  const [anniversaryDate, setAnniversaryDate] = useState("");
  const [children, setChildren] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "/login";
        return;
      }

      setUid(user.uid);

      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists()) {
        const data = snap.data();

        setFullName(data.fullName || "");
        setGender(data.gender || "");
        setDob(data.dob || "");
        setPhone(data.phone || "");
        setEmail(data.email || user.email || "");
        setArea(data.area || "");
        setAreaLeader(data.areaLeader || "");
        setMemberType(data.memberType || "");
        setMaritalStatus(data.maritalStatus || "");
        setSpouseName(data.spouseName || "");
        setAnniversaryDate(data.anniversaryDate || "");
        setChildren(data.children || []);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addChild = () => {
    setChildren([...children, { name: "", dob: "" }]);
  };

  const updateChild = (index, field, value) => {
    const updated = [...children];
    updated[index][field] = value;
    setChildren(updated);
  };

  const removeChild = (index) => {
    setChildren(children.filter((_, i) => i !== index));
  };

  const saveProfile = async () => {
    if (
      !fullName ||
      !gender ||
      !dob ||
      !phone ||
      !area ||
      !areaLeader ||
      !memberType ||
      !maritalStatus
    ) {
      setPopupMessage("Please fill all required details.");
      return;
    }

    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      setPopupMessage("Please enter a valid Indian mobile number.");
      return;
    }

    if (maritalStatus === "Married" && (!spouseName || !anniversaryDate)) {
      setPopupMessage("Please enter spouse name and wedding anniversary date.");
      return;
    }

    for (const child of children) {
      if (!child.name || !child.dob) {
        setPopupMessage("Please enter name and DOB for all children.");
        return;
      }
    }

    await updateDoc(doc(db, "users", uid), {
      fullName,
      gender,
      dob,
      phone,
      area,
      areaLeader,
      memberType,
      isVolunteer: memberType === "Volunteer",
      maritalStatus,
      spouseName: maritalStatus === "Married" ? spouseName : "",
      anniversaryDate: maritalStatus === "Married" ? anniversaryDate : "",
      children: maritalStatus === "Married" ? children : [],
    });

    setPopupMessage("Profile updated successfully.");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center">
        Loading profile...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F172A] text-white px-6 py-8">
      <div className="max-w-md mx-auto">
        <a
          href="/profile"
          className="inline-block rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold"
        >
          ← Back to Profile
        </a>

        <h1 className="mt-8 text-3xl font-black text-center">Edit Profile</h1>

        <div className="mt-8 space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
          >
            <option value="" className="text-black">Gender</option>
            <option value="Male" className="text-black">Male</option>
            <option value="Female" className="text-black">Female</option>
          </select>

          <div className="space-y-2">
            <label className="text-sm font-bold text-purple-300">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
            />
          </div>

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
          />

          <input
            type="email"
            value={email}
            disabled
            className="w-full rounded-2xl border border-white/15 bg-white/5 p-4 text-white/50 outline-none"
          />

          <input
            type="text"
            placeholder="Area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
          />

          <input
            type="text"
            placeholder="Area Leader Name"
            value={areaLeader}
            onChange={(e) => setAreaLeader(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
          />

          <select
            value={memberType}
            onChange={(e) => setMemberType(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
          >
            <option value="" className="text-black">Member Type</option>
            <option value="Member" className="text-black">Member</option>
            <option value="Visitor" className="text-black">Visitor</option>
            <option value="Volunteer" className="text-black">Volunteer</option>
          </select>

          <select
            value={maritalStatus}
            onChange={(e) => {
              setMaritalStatus(e.target.value);
              if (e.target.value !== "Married") {
                setSpouseName("");
                setAnniversaryDate("");
                setChildren([]);
              }
            }}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
          >
            <option value="" className="text-black">Marital Status</option>
            <option value="Unmarried" className="text-black">Unmarried</option>
            <option value="Married" className="text-black">Married</option>
          </select>

          {maritalStatus === "Married" && (
            <>
              <input
                type="text"
                placeholder="Spouse Name"
                value={spouseName}
                onChange={(e) => setSpouseName(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
              />

              <div className="space-y-2">
                <label className="text-sm font-bold text-purple-300">
                  Wedding Anniversary Date
                </label>
                <input
                  type="date"
                  value={anniversaryDate}
                  onChange={(e) => setAnniversaryDate(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
                />
              </div>

              <div className="rounded-3xl border border-white/15 bg-white/10 p-4">
                <h2 className="font-black text-purple-300">Children Details</h2>

                <div className="mt-4 space-y-4">
                  {children.map((child, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/10 bg-white/10 p-4"
                    >
                      <input
                        type="text"
                        placeholder={`Child ${index + 1} Name`}
                        value={child.name}
                        onChange={(e) => updateChild(index, "name", e.target.value)}
                        className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
                      />

                      <div className="mt-3 space-y-2">
                        <label className="text-sm font-bold text-purple-300">
                          Child {index + 1} DOB
                        </label>
                        <input
                          type="date"
                          value={child.dob}
                          onChange={(e) => updateChild(index, "dob", e.target.value)}
                          className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 outline-none"
                        />
                      </div>

                      <button
                        onClick={() => removeChild(index)}
                        className="mt-3 w-full rounded-2xl bg-red-600 p-3 font-bold"
                      >
                        Remove Child
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addChild}
                  className="mt-4 w-full rounded-2xl bg-green-600 p-3 font-bold"
                >
                  + Add Child
                </button>
              </div>
            </>
          )}

          <button
            onClick={saveProfile}
            className="w-full rounded-2xl bg-purple-600 p-4 font-bold"
          >
            Save Profile
          </button>
        </div>

        {popupMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5">
            <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-[#0F172A] p-6 text-center">
              <img
                src="/church-logo.png"
                alt="Agape Bible Church Logo"
                className="mx-auto h-24 w-24 object-contain"
              />
              <h2 className="mt-4 text-2xl font-black">Profile</h2>
              <p className="mt-4 text-white/70">{popupMessage}</p>
              <button
                onClick={() => {
                  setPopupMessage("");
                  if (popupMessage === "Profile updated successfully.") {
                    window.location.href = "/profile";
                  }
                }}
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