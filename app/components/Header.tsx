'use client';

import React, { FC, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";


interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: "/#home", label: "Home" },
    { href: "/#about", label: "About" },
    { href: "/#solutions", label: "Solutions" },
    { href: "/#research", label: "Research" },
    { href: "/qlossary", label: "Qlossary" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-gray-900/95 backdrop-blur-sm text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-2">
        {/* Логотип */}
        <div className="flex items-center space-x-3">
          {/* Контейнер для логотипа */}
          <img
            src="/LogoCircuit.png"
            alt="Circuit Labs logo"
            width={60}
            height={60}
            className="w-14 h-14 md:w-18 md:h-18 object-contain"
          />

          <Link
            href="/#home"
            className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent text-xl sm:text-3xl font-orbitron font-bold"
          >
            CircuitLabs
          </Link>
        </div>

        {/* Десктопная навигация */}
        <nav className="hidden md:flex space-x-6 font-orbitron text-lg md:text-xl">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent
                         transition-transform hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Кнопка гамбургера */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white focus:outline-none z-50"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Мобильное меню */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-900 border-t border-gray-800"
          >
            <nav className="flex flex-col space-y-4 px-6 py-6 font-orbitron">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent
                             text-lg font-orbitron transition-transform hover:scale-105
                             hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;