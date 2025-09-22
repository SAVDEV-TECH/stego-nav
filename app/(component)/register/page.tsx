 "use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [accountNo, setAccountNo] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setAccountNo(null);

    const res = await fetch("/api/authss/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setAccountNo(data.user.accountNo);
      setMessage("Account created successfully!");
      setTimeout(() => (window.location.href = "/login"), 4000);
    } else {
      setMessage(data.error || "Registration failed.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow"
      >
        <h1 className="mb-4 text-2xl font-bold">Register</h1>

        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="mb-2 w-full rounded border p-2"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="mb-2 w-full rounded border p-2"
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className="mb-2 w-full rounded border p-2"
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
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}

        {accountNo && (
          <div className="mt-4 rounded bg-green-100 p-3 text-center text-green-700">
            🎉 Your Account Number: <strong>{accountNo}</strong>
            <p className="text-xs text-gray-600">
              Save this number, you’ll need it for transactions.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
