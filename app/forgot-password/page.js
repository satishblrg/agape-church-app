"use client";

import { useState } from "react";
import { auth } from "../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const resetPassword = async () => {
    if (!email) {
      setPopupMessage("Please enter your registered email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setPopupMessage("Password reset link sent. Please check your email.");
      setEmail("");
    } catch (error) {
      setPopupMessage(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <img
          src="/church-logo.png"
          alt="Agape Bible Church Logo"
          className="mx-auto h-28 w-28 object-contain"
        />

        <h1 className="mt-4 text-3xl font-black">Forgot Password</h1>

        <p className="mt-2 text-white/60">
          Enter your registered email address to receive a password reset link.
        </p>

        <div className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Registered Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none"
          />

          <button
            onClick={resetPassword}
            className="w-full rounded-2xl bg-purple-600 p-4 font-bold"
          >
            Send Reset Link
          </button>
        </div>

        <div className="mt-6">
          <a href="/login" className="text-purple-300 font-semibold">
            Back to Login
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

              <h2 className="mt-4 text-2xl font-black">Password Reset</h2>

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