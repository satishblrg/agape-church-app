"use client";

import { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please enter email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      localStorage.setItem("userEmail", user.email);

      if (!user.emailVerified) {
        setMessage("Please verify your email before logging in.");
        return;
      }

      window.location.href = "/home";
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <img
          src="/church-logo.png"
          alt="Church Logo"
          className="mx-auto h-32 w-32 object-contain"
        />

        <h1 className="mt-4 text-3xl font-black">Agape Bible Church</h1>

        <p className="mt-2 text-white/60">Welcome Back</p>

        <div className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none backdrop-blur-xl"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none backdrop-blur-xl"
          />

          <button
            onClick={handleLogin}
            className="w-full rounded-2xl bg-purple-600 p-4 font-bold shadow-xl"
          >
            Login
          </button>
        </div>

<a href="/forgot-password" className="block mt-4 text-purple-300 font-semibold">
  Forgot Password?
</a>
        {message && <p className="mt-5 text-sm text-purple-300">{message}</p>}

        <div className="mt-6">
          <a href="/signup" className="text-purple-300 font-semibold">
            Don't have an account? Create Account
          </a>
        </div>
      </div>
    </main>
  );
}