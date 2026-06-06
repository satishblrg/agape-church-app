"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

    const adminAccounts = [
    {
      email: "satishblrg@gmail.com",
      password: "Agape@1990",
      role: "Super Admin",
    },
    {
      email: "abcabfindia@gmail.com",
      password: "Admin@1990",
      role: "Church Admin",
    },
  ];

  const handleAdminLogin = async () => {
    if (!email || !password) {
      setMessage("Please enter admin email and password.");
      return;
    }

    try {
     const matchedAdmin = adminAccounts.find(
  (admin) => admin.email === email && admin.password === password
);

if (!matchedAdmin) {
  setMessage("Invalid admin email or password.");
  return;
}

localStorage.setItem("adminEmail", matchedAdmin.email);
localStorage.setItem("adminRole", matchedAdmin.role);
localStorage.setItem("adminLoggedIn", "true");

window.location.href = "/admin";
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

        <h1 className="mt-4 text-3xl font-black">Admin Login</h1>

        <p className="mt-2 text-white/60">Agape Bible Church App</p>

        <div className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none backdrop-blur-xl"
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 text-white outline-none backdrop-blur-xl"
          />

          <button
            onClick={handleAdminLogin}
            className="w-full rounded-2xl bg-purple-600 p-4 font-bold shadow-xl"
          >
            Login as Admin
          </button>
        </div>

        {message && <p className="mt-5 text-sm text-purple-300">{message}</p>}
      </div>
    </main>
  );
}