"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

type WorkshopId = "history" | "intro" | "math" | "shor";

type Workshop = {
  id: WorkshopId;
  label: string;
  title: string;
  description: string;
  href?: string;
};

const workshops: Workshop[] = [
  {
    id: "history",
    label: "history",
    title: "History of Quantum Computing",
    description:
      "Learn about the development of quantum mechanics and the thought experiments that led to the ideas of the universal quantum computer, first quantum algorithms, and first commercial applications of quantum phenomena in quantum computation.",
  },
  {
    id: "intro",
    label: "intro",
    title: "Intro to Quantum Computing",
    description:
      "Learn what is a qubit, a circuit, a gate, a measurement, entanglement, and more. Write your first circuit and run measurements on the IBM backend.",
  },
  {
    id: "math",
    label: "math",
    title: "Math for Quantum Computing",
    description:
      "Learn about states, matrices, unitary operators, braket notation, basic gates, QFT, and more.",
  },
  {
    id: "shor",
    label: "algorithm",
    title: "Shor's Algorithm",
    description:
      "Learn about one of the most powerful algorithms in the history of quantum computing, understand where the quantum advantage comes from, and why this algorithm shook entire industries. Implement a toy example of Shor's algorithm.",
    href: "/shors-algorithm",
  },
];

const workshopBadgeClasses: Record<WorkshopId, string> = {
  history: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/35",
  intro: "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/35",
  math: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/35",
  shor: "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/35",
};

export default function WorkshopsClient() {
  const [open, setOpen] = useState<Record<WorkshopId, boolean>>({
    history: false,
    intro: false,
    math: false,
    shor: false,
  });

  const toggle = (id: WorkshopId) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0c16] text-gray-300">
      <Header />
      <main className="flex-1 w-full pt-20 md:pt-24 pb-16 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-orbitron text-4xl sm:text-5xl mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Workshops
          </h1>

          <section aria-labelledby="workshops-heading">
            <h2
              id="workshops-heading"
              className="font-orbitron text-xl sm:text-2xl text-gray-100 mt-12 mb-6 border-b border-white/10 pb-3"
            >
              Quantum Computing Workshops
            </h2>
            <ul className="flex flex-col gap-2 list-none m-0 p-0">
              {workshops.map((workshop) => {
                const isOpen = open[workshop.id];
                const panelId = `${workshop.id}-description`;

                return (
                  <li
                    key={workshop.id}
                    className="rounded-xl border border-white/10 bg-[#101223]/80 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggle(workshop.id)}
                      className="w-full flex items-start gap-3 text-left px-4 py-3.5 hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/70"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                    >
                      <span
                        className={`mt-0.5 shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide font-orbitron ${workshopBadgeClasses[workshop.id]}`}
                      >
                        {workshop.label}
                      </span>
                      <span className="flex-1 min-w-0 font-medium text-gray-100 pr-2">
                        {workshop.title}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 shrink-0 text-gray-500 transition-transform duration-200 mt-0.5 ${isOpen ? "rotate-180" : ""}`}
                        aria-hidden
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden border-t border-white/5"
                        >
                          <div className="px-4 py-4">
                            <p className="text-gray-400 text-sm sm:text-[15px] leading-relaxed">
                              {workshop.description}
                            </p>
                            {workshop.href && (
                              <Link
                                href={workshop.href}
                                className="mt-4 inline-flex items-center gap-2 rounded-md border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 font-orbitron text-xs font-semibold uppercase tracking-wide text-cyan-300 transition-colors hover:border-cyan-300/70 hover:bg-cyan-400/15 hover:text-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/70"
                              >
                                go to workshop
                                <ArrowRight className="h-4 w-4" aria-hidden />
                              </Link>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </section>

          <p className="mt-14 text-center text-gray-500 text-sm">
            <Link
              href="/#home"
              className="text-cyan-400/90 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/40"
            >
              Back to home
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
