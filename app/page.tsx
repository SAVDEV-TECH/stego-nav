 "use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function HomePage() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    // Check if token exists in cookies
    const token = document.cookie.split("; ").find((c) => c.startsWith("token="));
    if (token) setUserLoggedIn(true);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6">
      {/* Hero Section */}
      <motion.div
        className="flex flex-col md:flex-row items-center gap-10 max-w-6xl w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Text */}
        <motion.div
          className="text-center md:text-left"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            SecureStego
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Hide your messages in images with AES-256 encryption for maximum security.
            Perform secure financial transactions with confidence.
          </p>
        </motion.div>

        {/* Image */}
        <motion.div
          className="w-64 h-64 md:w-96 md:h-96 relative"
          animate={{ rotate: [0, 5, -5, 5, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          <Image
            src="https://images.unsplash.com/photo-1591696331112-3f30827946da?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
            alt="Secure Steganography"
            fill
            className="object-cover rounded-xl shadow-2xl"
          />
        </motion.div>
      </motion.div>

      {/* CTA Button */}
      {!userLoggedIn && (
        <motion.a
          href="/register"
          className="mt-10 rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold hover:bg-blue-700 transition"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          Get Started
        </motion.a>
      )}
    </div>
  );
}

