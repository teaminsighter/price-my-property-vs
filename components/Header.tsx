"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-12 h-12">
              <svg
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <circle cx="25" cy="25" r="24" fill="#3B9FE5" />
                <path
                  d="M25 10L15 20H20V35H30V20H35L25 10Z"
                  fill="white"
                />
                <path
                  d="M38 22C38 22 40 24 40 28C40 32 38 34 38 34"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary leading-tight">
                PRICE MY PROPERTY
              </span>
              <span className="text-xs text-gray-600">
                Value your next move
              </span>
            </div>
          </Link>

          {/* Navigation - Links disabled until pages are created */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* TODO: Enable when pages are created
            <Link
              href="/about"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              ABOUT US
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              CONTACT US
            </Link>
            <Link
              href="/articles"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              ARTICLES
            </Link>
            */}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
