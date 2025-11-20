"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function SellForMoreSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <img
                src="/images/sell-for-more.jpg"
                alt="Happy couple looking at phone excited about selling their house"
                className="w-full h-auto object-cover"
                style={{ minHeight: "400px" }}
              />
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-start gap-4 mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                How to Sell Your House for More?
              </h2>
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  {/* House Icon */}
                  <rect x="18" y="28" width="28" height="28" fill="#3B9FE5" opacity="0.2" />
                  <path d="M32 12L12 28H20V52H28V36H36V52H44V28H52L32 12Z" fill="#2B7AC5" />

                  {/* Person/Agent Icon */}
                  <circle cx="48" cy="38" r="4" fill="#3B9FE5"/>
                  <path d="M48 44C44 44 42 46 42 48V52H54V48C54 46 52 44 48 44Z" fill="#3B9FE5"/>
                </svg>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 leading-relaxed mb-8">
              <p>
                Are you ready to sell your house for more? Complete our online assessment, and
                we'll send you our free guide. In this guide, you'll learn what to do and not to do to
                get the best price for your home. The answers may shock you!
              </p>

              <p>
                Selling your home for top dollar doesn't mean completely renovating it. Download
                our guide to learn the
              </p>
            </div>

            <motion.button
              className="px-10 py-4 bg-primary hover:bg-secondary text-white font-semibold rounded-sm transition-colors text-lg w-full lg:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              CLICK HERE TO DOWNLOAD
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
