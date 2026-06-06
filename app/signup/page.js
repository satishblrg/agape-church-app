"use client";

import { useState } from "react";
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function SignupPage() {
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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [popupMessage, setPopupMessage] = useState("");

  const handleSignup = async () => {
    if (
      !fullName ||
      !gender ||
      !dob ||
      !phone ||
      !email ||
      !area ||
      !areaLeader ||
      !memberType ||
      !maritalStatus ||
      !password ||
      !confirmPassword
    ) {
      setPopupMessage("Please fill all details.");
      return;
    }

    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      setPopupMessage("Please enter a valid Indian mobile number.");
      return;
    }

    if (password.length < 8) {
      setPopupMessage("Password must be at least 8 characters long.");
      return;
    }

    if (maritalStatus === "Married" && (!spouseName || !anniversaryDate)) {
      setPopupMessage("Please enter spouse name and wedding anniversary date.");
      return;
    }

    if (password !== confirmPassword) {
      setPopupMessage("Passwords do not match.");
      return;
    }

    try {
      const phoneCheck = query(
        collection(db, "users"),
        where("phone", "==", phone)
      );

      const phoneSnapshot = await getDocs(phoneCheck);

      if (!phoneSnapshot.empty) {
        setPopupMessage("This phone number is already registered.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, "users", user.uid), {
        fullName,
        gender,
        dob,
        phone,
        email,
        area,
        areaLeader,
        memberType,
        isVolunteer: memberType === "Volunteer",
        volunteerStatus:
          memberType === "Volunteer" ? "Pending" : "Not Volunteer",
        maritalStatus,
        spouseName: maritalStatus === "Married" ? spouseName : "",
        anniversaryDate:
          maritalStatus === "Married" ? anniversaryDate : "",
        emailVerified: false,
        createdAt: new Date().toISOString(),
      });

      setPopupMessage(
        "Account created successfully. Verification email sent. Please check your inbox."
      );

      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (error) {
      setPopupMessage(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md text-center">
        <img
          src="/church-logo.png"
          alt="Church Logo"
          className="mx-auto h-28 w-28 object-contain"
        />

        <h1 className="mt-4 text-3xl font-black">Create Account</h1>

        <p className="mt-2 text-white/60">Join Agape Bible Church App</p>

        <div className="mt-8 space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none"
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none"
          >
            <option value="" className="text-black">
              Gender
            </option>
            <option value="Male" className="text-black">
              Male
            </option>
            <option value="Female" className="text-black">
              Female
            </option>
          </select>

          <div className="space-y-2 text-left">
            <label className="text-sm font-bold text-purple-300">
              Date of Birth
            </label>

            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none"
            />
          </div>

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none"
          />

          <input
            type="email"
            placeholder="Mail ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none"
          />

          <input
            type="text"
            placeholder="Area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none"
          />

          <input
            type="text"
            placeholder="Area Leader Name"
            value={areaLeader}
            onChange={(e) => setAreaLeader(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none"
          />

          <select
            value={memberType}
            onChange={(e) => setMemberType(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none"
          >
            <option value="" className="text-black">
              Member Type
            </option>
            <option value="Member" className="text-black">
              Member
            </option>
            <option value="Visitor" className="text-black">
              Visitor
            </option>
            <option value="Volunteer" className="text-black">
              Volunteer
            </option>
          </select>

          <select
            value={maritalStatus}
            onChange={(e) => setMaritalStatus(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none"
          >
            <option value="" className="text-black">
              Marital Status
            </option>
            <option value="Unmarried" className="text-black">
              Unmarried
            </option>
            <option value="Married" className="text-black">
              Married
            </option>
          </select>

          {maritalStatus === "Married" && (
            <>
              <input
                type="text"
                placeholder="Spouse Name"
                value={spouseName}
                onChange={(e) => setSpouseName(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none"
              />

              <div className="space-y-2 text-left">
                <label className="text-sm font-bold text-purple-300">
                  Wedding Anniversary Date
                </label>

                <input
                  type="date"
                  value={anniversaryDate}
                  onChange={(e) => setAnniversaryDate(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none"
                />
              </div>
            </>
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none"
          />

          <button
            onClick={handleSignup}
            className="w-full rounded-2xl bg-purple-600 p-4 font-bold"
          >
            Create Account
          </button>
        </div>

        <div className="mt-6">
          <a href="/login" className="text-purple-300 font-semibold">
            Already have an account? Login
          </a>
        </div>

        {popupMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5">
            <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-[#0F172A] p-6 text-center shadow-2xl">
              <img
                src="/church-logo.png"
                alt="Agape Bible Church Logo"
                className="mx-auto h-24 w-24 object-contain"
              />

              <h2 className="mt-4 text-2xl font-black">Signup</h2>

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