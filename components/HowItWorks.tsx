"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative w-16 h-16">
              <svg
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                {/* House Icon */}
                <rect x="16" y="28" width="32" height="28" fill="#3B9FE5" opacity="0.2" />
                <path d="M32 8L8 28H16V52H28V36H36V52H48V28H56L32 8Z" fill="#3B9FE5" />

                {/* Price Tag */}
                <rect x="38" y="18" width="20" height="14" rx="2" fill="#2B7AC5" />
                <text x="48" y="28" fontSize="8" fill="white" fontWeight="bold" textAnchor="middle">
                  PRICE
                </text>
              </svg>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Considering Selling Your Home?
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
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              HOW DOES THE WEBSITE WORK?
            </h3>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                When a property owner considers selling their home, they often seek an
                understanding of its potential market value. In cases where a mortgage is involved,
                a property valuation is typically required by the bank. Our platform facilitates the
                arrangement of a market valuation, sometimes referred to as a market appraisal,
                through the collaboration with a knowledgeable local real estate professional
                affiliated with the Real Estate Association (REA) since 2008. The primary objective
                of this platform is to connect you with a highly skilled agent in your vicinity.
              </p>

              <p>
                The recommended agent we connect you with is a top-notch professional
                dedicated to assisting you. We charge the agent for this introduction based on the
                postcode and the number of market valuations they've performed. This approach
                ensures you always receive the most suitable agent for your needs.
              </p>

              <p>
                The market valuation or appraisal entails a comprehensive report that presents all
                relevant information on comparable property listings and recent sales in your
                area. Additionally, you'll receive guidance on the recommended sales approach to
                achieve the best possible price for your property.
              </p>
            </div>

            <motion.button
              className="mt-8 px-10 py-4 bg-primary hover:bg-secondary text-white font-semibold rounded-sm transition-colors text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              START HERE
            </motion.button>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <img
                src="/images/how-it-works.jpg"
                alt="Real estate agent showing property details to couple"
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
