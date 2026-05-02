"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import {
  glossarySections,
  type GlossaryCategoryId,
} from "../qlossary/qlossarySections";

const categoryBadgeClasses: Record<GlossaryCategoryId, string> = {
  core: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/35",
  math: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/35",
  circuits: "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/35",
  physics: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/35",
  algorithms: "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/35",
  errors: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/35",
  hardware: "bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/35",
};

function termKey(sectionId: GlossaryCategoryId, term: string) {
  return `${sectionId}::${term}`;
}

export default function QlossaryClient() {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0c16] text-gray-300">
      <Header />
      <main className="flex-1 w-full pt-20 md:pt-24 pb-16 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-orbitron text-4xl sm:text-5xl mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Quantum Glossary
          </h1>
          <p className="text-gray-400 text-base sm:text-lg mb-12 leading-relaxed max-w-2xl">
            Click a term to expand its definition. Category tags group ideas the way they often appear in papers and tooling.
          </p>

          <div className="flex flex-col gap-14">
            {glossarySections.map((section) => (
              <section key={section.id} aria-labelledby={`heading-${section.id}`}>
                <h2
                  id={`heading-${section.id}`}
                  className="font-orbitron text-xl sm:text-2xl text-gray-100 mb-6 border-b border-white/10 pb-3"
                >
                  {section.heading}
                </h2>
                <ul className="flex flex-col gap-2 list-none m-0 p-0">
                  {section.terms.map((entry) => {
                    const key = termKey(section.id, entry.term);
                    const isOpen = Boolean(open[key]);
                    return (
                      <li
                        key={key}
                        className="rounded-xl border border-white/10 bg-[#101223]/80 overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => toggle(key)}
                          className="w-full flex items-start gap-3 text-left px-4 py-3.5 hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/70"
                          aria-expanded={isOpen}
                        >
                          <span
                            className={`mt-0.5 shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide font-orbitron ${categoryBadgeClasses[section.id]}`}
                          >
                            {section.id}
                          </span>
                          <span className="flex-1 min-w-0 font-medium text-gray-100 pr-2">
                            {entry.term}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 shrink-0 text-gray-500 transition-transform duration-200 mt-0.5 ${isOpen ? "rotate-180" : ""}`}
                            aria-hidden
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                              className="overflow-hidden border-t border-white/5"
                            >
                              <p className="px-4 py-4 text-gray-400 text-sm sm:text-[15px] leading-relaxed">
                                {entry.definition}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>

          <p className="mt-14 text-center text-gray-500 text-sm">
            <Link
              href="/#home"
              className="text-cyan-400/90 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/40"
            >
              ← Back to home
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
