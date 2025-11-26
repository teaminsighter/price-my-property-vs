"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function SalesValueSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative w-20 h-20">
            <svg
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              {/* House with chart icon */}
              <rect x="20" y="35" width="40" height="35" fill="#3B9FE5" opacity="0.2" />
              <path d="M40 15L15 35H25V65H35V45H45V65H55V35H65L40 15Z" fill="#2B7AC5" />

              {/* Chart/Graph overlay */}
              <path d="M50 25L55 30L60 22L65 28" stroke="#3B9FE5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="65" cy="28" r="3" fill="#3B9FE5"/>
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            How we determine the sales value of your property
          </h2>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Virtual Sales Valuation */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Virtual Sales Valuation/Appraisal
              </h3>
              <p className="text-gray-700 leading-relaxed">
                The agent can give you an electronic summary of recent sales and listings in your
                location, showing you the average RV-to-sales ratios and similar properties sold in
                your area. This is sent to you after a short phone conversation. You can evaluate
                this information for your research purposes. You can elect to have this emailed,
                dropped off or posted to you. However, for a more accurate assessment, a brief
                onsite visit is recommended.
              </p>
            </div>

            {/* Onsite Sales Valuation */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Onsite Sales Valuation/Appraisal
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                To be able to do this, the agent will visit your property for around 15 to 20 minutes
                and come back with a comprehensive written appraisal and marketing
                recommendation. The agent will also factor in current market conditions at that
                given time and any renovations or property updates that have happened. This is
                most likely done with one or two agents to gauge a better understanding of the
                value your property could achieve on the market if sold.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Note:</strong> If you are a real estate agent and wish to be considered for this service, you
                can <a href="#" className="text-primary hover:text-secondary font-semibold">apply here</a> for your priority postcode options. Please note that not all
                postcodes are available, as most experienced agents have these.
              </p>
            </div>
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
                src="/images/virtual-v2.webp"
                alt="Real estate agent presenting property details to couple"
                className="w-full h-auto object-cover"
                style={{ minHeight: "500px" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
