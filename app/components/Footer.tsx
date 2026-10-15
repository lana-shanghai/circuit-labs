"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Footer() {
  const [fullname, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "success">("idle");

  const handleSendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fullname.trim() || !message.trim()) {
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, message, website }),
      });

      if (res.ok) {
        setStatus("success");
        setFullName("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <footer id="contact" className="w-full bg-[#0a0c16] border-t border-white/10 py-10 px-6 md:px-12 mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto flex flex-col items-center gap-6"
      >
        <div className="text-center md:text-left">
          <h3 className="font-orbitron text-3xl bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            Get in Touch
          </h3>
          <p className="text-gray-400 text-sm md:text-base mt-2">
            Have a project in mind? <span className="text-blue-400">Send us a message.</span>
          </p>
        </div>

        <form onSubmit={handleSendEmail} className="flex flex-col gap-3 w-full max-w-md">
          <input
            type="text"
            name="fullname"
            placeholder="Full name"
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
            required
            maxLength={100}
            className="bg-[#101223] border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
          />

          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] w-px h-px opacity-0"
          />

          <textarea
            name="message"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            maxLength={5000}
            className="bg-[#101223] border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400 resize-none h-28 w-full"
          />

          <div className="flex flex-col md:flex-row justify-center gap-3 mt-3 items-center">
            <button
              type="submit"
              disabled={status === "sending"}
              className="bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 hover:from-blue-500 hover:via-indigo-400 hover:to-blue-300 active:from-blue-700 active:via-indigo-600 active:to-blue-500 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>

            {status === "error" && <span className="text-red-400 text-sm mt-2 md:mt-0">Please fill in all fields or try again.</span>}
            {status === "success" && <span className="text-green-400 text-sm mt-2 md:mt-0">Message sent successfully!</span>}
          </div>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-10 text-center text-gray-500 text-sm"
      >
        &copy; {new Date().getFullYear()} CircuitLabs. All rights reserved.
      </motion.div>
    </footer>
  );
}
