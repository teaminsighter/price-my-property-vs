"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            ABOUT US
          </h2>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                Here at Price My Property, we know how hard it is to make that next move.
              </p>

              <p>
                We are based around the country to give you localised advice helping vendors get
                the best advice.
              </p>

              <p>
                Before you decide to sell your home, get the right advice from one of our qualified
                agents.
              </p>

              <p>
                Some of you may want an online electronic market e-valuation (via email), and
                some will want a free face to face market appraisal, you decide when they make
                contact.
              </p>

              <p>
                Whether you're upgrading, downgrading, moving city or selling an investment, you
                always want to know what the market valuation will be before you start. It's what
                we do.
              </p>

              <p>
                All our agents are licenced under the{" "}
                <a href="#" className="text-primary hover:text-secondary font-semibold">
                  Real Estate Agents
                </a>{" "}
                Act 2008.
              </p>
            </div>

            <motion.button
              className="mt-8 px-10 py-4 bg-primary hover:bg-secondary text-white font-semibold rounded-sm transition-colors text-lg w-full lg:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              START NOW!
            </motion.button>
          </motion.div>

          {/* Right Column - Team Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <img
                src="/images/about-team.webp"
                alt="Price My Property team of professional real estate agents"
                className="w-full h-auto object-cover"
                style={{ minHeight: "400px" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
