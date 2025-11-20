"use client";

import { motion } from "framer-motion";

export default function ScrollingText() {
  const text =
    "This website is designed to help you better understand what your property is worth in today's market";

  // Duplicate the text for seamless loop
  const duplicatedText = `${text} • ${text} • ${text} • `;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 overflow-hidden">
      <div className="py-4">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: [0, -1000],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          <span className="text-gray-700 text-sm md:text-base font-medium px-4">
            {duplicatedText}
          </span>
          <span className="text-gray-700 text-sm md:text-base font-medium px-4">
            {duplicatedText}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
