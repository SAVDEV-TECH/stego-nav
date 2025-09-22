 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuth from "../hook/useAuth";

const navItems = [
  { name: "Transactions", path: "/transaction" },
  { name: "Steganography", path: "/steganography" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, setUser, loading } = useAuth();

  const handleLogout = async () => {
    await fetch("/api/authss/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          SecureStego
        </Link>

        {/* Nav Links */}
        <div className="flex gap-6 items-center">
          {!loading && !user && (
            <>
              <Link
                href="/login"
                className={`${
                  pathname === "/login"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "hover:text-blue-300"
                } transition`}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={`${
                  pathname === "/register"
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "hover:text-blue-300"
                } transition`}
              >
                Register
              </Link>
            </>
          )}

          {!loading && user && (
            <>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`${
                    pathname === item.path
                      ? "text-blue-400 border-b-2 border-blue-400"
                      : "hover:text-blue-300"
                  } transition`}
                >
                  {item.name}
                </Link>
              ))}

              <span className="ml-4">
                Acct: {user.accountNo} | Balance: ${user.balance.toFixed(2)}
              </span>

              <button
                onClick={handleLogout}
                className="ml-4 bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
