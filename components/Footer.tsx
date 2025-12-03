"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#2C3E50] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {/* TODO: Enable when page is created
              <li>
                <Link
                  href="/disclosure"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Disclosure and Privacy Policy
                </Link>
              </li>
              */}
            </ul>
          </motion.div>

          {/* Find Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-4">Find Us</h3>
            <div className="space-y-2 text-gray-300">
              <p>Address: 4 Whetu Place, Level 2 Albany, Auckland</p>
              <p className="text-sm">© 2025 | Price My Property. All Rights Reserved</p>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
