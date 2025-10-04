"use client";

import { useState } from "react";
import SecurityModal from '@/compo/modalsecurity.tsx'

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
    const [showSecurityModal, setShowSecurityModal] = useState(false);
   const [failedAttempts, setFailedAttempts] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/authss/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage("Login successful! Redirecting...");
      setTimeout(() => (window.location.href = "/steganography"), 1000);
    } else {
       setFailedAttempts(prev => prev + 1);
        setShowSecurityModal(true);
      setMessage(data.error || "Login failed.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow"
      >
        <h1 className="mb-4 text-2xl font-bold">Login</h1>

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="mb-2 w-full rounded border p-2"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="mb-2 w-full rounded border p-2"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && <p className="mt-2 text-sm">{message}</p>}
      </form>
      <SecurityModal
  isOpen={showSecurityModal}
  onClose={() => setShowSecurityModal(false)}
  attemptCount={failedAttempts}
/>
    </div>
  );
}
