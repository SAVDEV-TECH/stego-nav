 "use client";

import React, { useRef, useState } from "react";
import CryptoJS from "crypto-js";
import { motion } from "framer-motion";
import Image from "next/image";
import SecurityModal from '../../compo/modalsecurity'

/* ---------- Utility Helpers ---------- */
function strToUtf8Bytes(str: string) {
  return new TextEncoder().encode(str);
}
function bytesToStr(bytes: Uint8Array) {
  return new TextDecoder().decode(bytes);
}
function numberTo4Bytes(n: number) {
  const b = new Uint8Array(4);
  b[0] = (n >>> 24) & 0xff;
  b[1] = (n >>> 16) & 0xff;
  b[2] = (n >>> 8) & 0xff;
  b[3] = n & 0xff;
  return b;
}
function bytesToNumber(b: Uint8Array) {
  return ((b[0] << 24) >>> 0) + ((b[1] << 16) >>> 0) + ((b[2] << 8) >>> 0) + (b[3] >>> 0);
}

function embedBytesIntoImageData(imgData: ImageData, payload: Uint8Array) {
  const totalPixels = imgData.data.length / 4;
  const capacityBits = totalPixels * 3;
  const neededBits = payload.length * 8;
  if (neededBits > capacityBits) throw new Error("Message too big for this image!");

  let bitIndex = 0;
  for (let i = 0; i < payload.length; i++) {
    const byte = payload[i];
    for (let bit = 7; bit >= 0; bit--) {
      const bitVal = (byte >> bit) & 1;
      const pixel = Math.floor(bitIndex / 3);
      const channelOffset = bitIndex % 3;
      const dataIndex = pixel * 4 + channelOffset;
      imgData.data[dataIndex] = (imgData.data[dataIndex] & 0xfe) | bitVal;
      bitIndex++;
    }
  }
  return imgData;
}

function extractBytesFromImageData(imgData: ImageData, byteLen: number) {
  const payload = new Uint8Array(byteLen);
  let bitIndex = 0;
  for (let i = 0; i < byteLen; i++) {
    let byte = 0;
    for (let b = 0; b < 8; b++) {
      const pixel = Math.floor(bitIndex / 3);
      const channelOffset = bitIndex % 3;
      const dataIndex = pixel * 4 + channelOffset;
      const bitVal = imgData.data[dataIndex] & 1;
      byte = (byte << 1) | bitVal;
      bitIndex++;
    }
    payload[i] = byte;
  }
  return payload;
}

/* ---------- Component ---------- */
export default function StegoPage() {
  const [showSecurityModal, setShowSecurityModal] = useState(false);
   const [failedAttempts, setFailedAttempts] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tab, setTab] = useState<"embed" | "decode">("embed");

  const [coverSrc, setCoverSrc] = useState<string | null>(null);
  const [stegoSrc, setStegoSrc] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [decodedMsg, setDecodedMsg] = useState<string | null>(null);
  const [key, setKey] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  /* Load uploaded image into canvas */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setCoverSrc(url);
    setStegoSrc(null);
    setDecodedMsg(null);
    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
    };
    img.src = url;
  };
 /* Decode */
  const handleDecode = () => {
  setStatus(null);
  try {
    if (!canvasRef.current) throw new Error("No image loaded");
    if (!key) throw new Error("Key required");

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const header = extractBytesFromImageData(imgData, 4);
    const cipherLen = bytesToNumber(header);
    const cipherBytes = extractBytesFromImageData(imgData, 4 + cipherLen).slice(4);
    const cipherText = bytesToStr(cipherBytes);

    const plain = decryptMessage(cipherText, key);
    setDecodedMsg(plain);
    setStatus("✅ Message decoded successfully!");
    setFailedAttempts(0); // Reset on success
  } catch (err) {
    if (err instanceof Error) {
      // Check if it's a wrong password error
      if (err.message.includes("Wrong key") || err.message.includes("corrupted data")) {
        setFailedAttempts(prev => prev + 1);
        setShowSecurityModal(true); // Trigger security modal
        setStatus(""); // Clear status when modal shows
      } else {
        setStatus("❌ " + err.message);
      }
    }
  }
};
  const encryptMessage = (plain: string, secret: string) =>
    CryptoJS.AES.encrypt(plain, secret).toString();

  const decryptMessage = (ciphertext: string, secret: string) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
    const plain = bytes.toString(CryptoJS.enc.Utf8);
    if (!plain) throw new Error("Wrong key or corrupted data");
    return plain;
  };

  /* Embed */
  const handleEmbed = () => {
    setStatus(null);
    try {
      if (!canvasRef.current) throw new Error("No image loaded");
      if (!message) throw new Error("Message empty");
      if (!key) throw new Error("Key required");

      const cipher = encryptMessage(message, key);
      const cipherBytes = strToUtf8Bytes(cipher);
      const lenBytes = numberTo4Bytes(cipherBytes.length);
      const payload = new Uint8Array(4 + cipherBytes.length);
      payload.set(lenBytes, 0);
      payload.set(cipherBytes, 4);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      embedBytesIntoImageData(imgData, payload);
      ctx.putImageData(imgData, 0, 0);

      const dataUrl = canvas.toDataURL("image/png");
      setStegoSrc(dataUrl);
      setStatus("✅ Message hidden successfully!");
    } catch (err) {
      if (err instanceof Error) {
        setStatus("❌ " + err.message);
      }
    }
  };

  const handleDownload = () => {
    if (!stegoSrc) return;
    const a = document.createElement("a");
    a.href = stegoSrc;
    a.download = "stego.png";
    a.click();
  };

  
  // const handleDecode = () => {
  //   setStatus(null);
  //   try {
  //     if (!canvasRef.current) throw new Error("No image loaded");
  //     if (!key) throw new Error("Key required");

  //     const canvas = canvasRef.current;
  //     const ctx = canvas.getContext("2d")!;
  //     const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  //     const header = extractBytesFromImageData(imgData, 4);
  //     const cipherLen = bytesToNumber(header);
  //     const cipherBytes = extractBytesFromImageData(imgData, 4 + cipherLen).slice(4);
  //     const cipherText = bytesToStr(cipherBytes);

  //     const plain = decryptMessage(cipherText, key);
  //     setDecodedMsg(plain);
  //     setStatus("✅ Message decoded successfully!");
  //   } catch (err) {
  //     if (err instanceof Error) {
  //       setStatus("❌ " + err.message);
  //     }
  //   }
  // };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-extrabold text-center">🖼️ Steganography Tool</h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setTab("embed")}
          className={`px-4 py-2 rounded-xl font-semibold ${
            tab === "embed" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Embed
        </button>
        <button
          onClick={() => setTab("decode")}
          className={`px-4 py-2 rounded-xl font-semibold ${
            tab === "decode" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Decode
        </button>
      </div>

      {/* Upload box */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer bg-gray-50"
        onClick={() => document.getElementById("imgInput")?.click()}
      >
        <input
          id="imgInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        {coverSrc ? (
          <Image
            src={coverSrc}
            alt="preview"
            width={400}
            height={400}
            className="mx-auto max-h-64 rounded-xl shadow object-contain"
          />
        ) : (
          <p className="text-gray-500">Click to upload an image</p>
        )}
      </motion.div>

      {/* Canvas (hidden) */}
      <canvas ref={canvasRef} className="hidden" />

      {tab === "embed" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Secret Key"
            className="w-full border rounded-lg p-2"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Type your secret message..."
            className="w-full border rounded-lg p-2"
          />
          <div className="flex gap-3">
            <button
              onClick={handleEmbed}
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
            >
              🔒 Encrypt & Embed
            </button>
            {stegoSrc && (
              <button
                onClick={handleDownload}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800"
              >
                ⬇️ Download Stego
              </button>
            )}
          </div>
        </motion.div>
      )}

      {tab === "decode" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter Key to Decode"
            className="w-full border rounded-lg p-2"
          />
          <button
            onClick={handleDecode}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
          >
            🔓 Decode Message
          </button>
          {decodedMsg && (
            <div className="bg-yellow-50 border rounded-lg p-4 shadow">
              <p className="font-bold">Decoded Message:</p>
              <p className="mt-2 text-gray-700">{decodedMsg}</p>
            </div>
          )}
        </motion.div>
      )}

      {status && <p className="text-center text-sm">{status}</p>}
      {/* Security Modal */}
<SecurityModal
  isOpen={showSecurityModal}
  onClose={() => setShowSecurityModal(false)}
  attemptCount={failedAttempts}
/>
    </div>
  );
}
