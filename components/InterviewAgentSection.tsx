"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function InterviewAgentSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-start gap-4 mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                How to Interview an agent?
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

                  {/* Agent/Person Icon with Tie */}
                  <circle cx="48" cy="36" r="5" fill="#3B9FE5"/>
                  <path d="M48 42C43 42 40 45 40 48V54H56V48C56 45 53 42 48 42Z" fill="#3B9FE5"/>
                  <rect x="47" y="40" width="2" height="8" fill="#2B7AC5"/>
                </svg>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 leading-relaxed mb-8">
              <p>
                Choosing the right agent is a big part of the selling process. Are you unsure who
                you want to use? Check out our free guide on how to interview an agent.
                Download our guide and learn the EXACT questions you should ask each agent.
              </p>

              <p>
                We'll walk you through step-by-step, giving you the right questions and actions to
                take that will lead you to the real estate agent that will help you earn top dollar for
                your home. Our advice is based on years of information collected from some of
                New Zealand's top real estate agents.
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

          {/* Right Column - Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <img
                src="/images/interview-agent.webp"
                alt="Agent interviewing couple about their property"
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
