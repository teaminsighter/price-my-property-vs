"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function RefinancingSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Considering Refinancing Your Mortgage?
          </h2>
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              {/* House Icon */}
              <rect x="16" y="28" width="32" height="28" fill="#3B9FE5" opacity="0.2" />
              <path d="M32 10L10 28H18V52H28V36H36V52H46V28H54L32 10Z" fill="#2B7AC5" />

              {/* Bar Chart */}
              <rect x="44" y="40" width="4" height="16" fill="#3B9FE5" rx="1"/>
              <rect x="50" y="32" width="4" height="24" fill="#3B9FE5" rx="1"/>
              <rect x="56" y="36" width="4" height="20" fill="#3B9FE5" rx="1"/>
            </svg>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <img
                src="/images/mortgage-refinance.jpg"
                alt="Mortgage refinance application on laptop"
                className="w-full h-auto object-cover"
                style={{ minHeight: "400px" }}
              />
            </div>
          </motion.div>

          {/* Right Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                Did you know 84% of people that move homes stay with their same bank because
                it seems too hard to change?
              </p>

              <p>
                Your bank doesn't need to compete for your business – they already have it;
                therefore, they're not keen to offer any goodies to keep your business. However,
                other banks are;
              </p>

              <p>
                All banks are vying for new business; you only have to see who's spending the
                money on traditional media. Most will offer more attractive terms than your
                existing bank can provide. New banks want to bring you in as a customer so that
                they may offer more attractive terms. Sometimes you'll see very lucrative cash
                incentives to 'come on over'.
              </p>

              <p>
                A mortgage broker has relationships with many providers. This gives you options,
                but you only have to complete one mortgage application. Get multiple quotes with
                different interest rates and mortgage terms.
              </p>

              <p>
                Learn how you can save money just by trimming your interest rate or knocking
                down your term. Marvel at the bottom line figures that have you save thousands of
                dollars, all with this free service.
              </p>
            </div>

            <motion.button
              className="mt-8 px-10 py-4 bg-primary hover:bg-secondary text-white font-semibold rounded-sm transition-colors text-lg w-full lg:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              VALUE HOME & SAVE ON MY LOAN
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
