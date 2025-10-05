 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import useAuth from "../hook/useAuth";
import { useRouter } from "next/navigation";

const navItems = [
  { name: "Transactions", path: "/transaction" },
  { name: "Steganography", path: "/steganography" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, setUser, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const handleLogout = async () => {
    await fetch("/api/authss/logout", { method: "POST" });
    setUser(null);
    setIsOpen(false);
     router.push("/");
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          SecureStego
        </Link>

        {/* Hamburger Button (Mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col gap-1 z-50"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-transform ${
              isOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white transition-opacity ${
              isOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-white transition-transform ${
              isOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </button>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-6 items-center">
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

        {/* Mobile Slide-in Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out z-40 md:hidden ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col gap-6 p-6 mt-16">
            {!loading && !user && (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
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
                  onClick={closeMenu}
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
                    onClick={closeMenu}
                    className={`${
                      pathname === item.path
                        ? "text-blue-400 border-b-2 border-blue-400"
                        : "hover:text-blue-300"
                    } transition`}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="border-t border-gray-700 pt-4">
                  <div className="text-sm mb-2">Acct: {user.accountNo}</div>
                  <div className="text-sm mb-4">Balance: ${user.balance.toFixed(2)}</div>
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-3 py-2 rounded hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* Overlay (Mobile) */}
        {isOpen && (
          <div
            onClick={closeMenu}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          ></div>
        )}
      </div>
    </nav>
  );
}