"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Article {
  id: number;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  image: string;
  tag: string;
}

const articles: Article[] = [
  {
    id: 1,
    title: "NZ House Price Report November 2025",
    author: "Sean McArthur",
    date: "November 11, 2025",
    excerpt:
      "TL;DR    National price pulse: The NZ House Price Report highlights a steady national price pulse, with the REINZ House Price Index up +0.2% YoY for September 2025 (Auckland -1.0%, ex-Auckland +0.9%).    Mortgage specials (end-Oct averages): 1-yr 4.43%, 2-yr 4.52%,...",
    image: "/images/article-1.jpg",
    tag: "PROPERTY SELL TIPS",
  },
  {
    id: 2,
    title: "Open Home Preparation in New Zealand: Complete NZ Specific Checklist",
    author: "Sean McArthur",
    date: "November 4, 2025",
    excerpt:
      "TL;DR (key facts with official NZ sources)    Start with low-cost wins first: declutter, deep clean, small repairs, and street appeal usually beat last-minute big renos. See Preparing your property for sale.    Prep for what buyers actually check: water pressure,...",
    image: "/images/article-2.jpg",
    tag: "PROPERTY SELL TIPS",
  },
  {
    id: 3,
    title: "Sell Your House Privately in NZ (2025): A Complete Step by Step Guide",
    author: "Sean McArthur",
    date: "October 29, 2025",
    excerpt:
      "TL;DR — quick checklist with official links    Know the official private-sale steps: follow the government step-by-step guide, 'Selling privately.'    Use a lawyer and the standard agreement — it sets price, chattels, dates and conditions. See Sale and Purchase Agreement guidance.  ...",
    image: "/images/article-3.jpg",
    tag: "PROPERTY SELL TIPS",
  },
  {
    id: 4,
    title: "Staging a Home for Sale in New Zealand: A Complete 2025 Guide",
    author: "Sean McArthur",
    date: "October 24, 2025",
    excerpt:
      "TL;DR    Be honest in your marketing: the Fair Trading Act prohibits misleading claims or impressions in ads and listings. Consumer Protection    Follow REA marketing rules for photos (accuracy, clear disclosures where needed, and correct boundary indications). The Real Estate...",
    image: "/images/article-4.jpg",
    tag: "PROPERTY SELL TIPS",
  },
];

export default function ArticlesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Article Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {/* Logo Badge */}
                <div className="absolute top-3 left-3 bg-white rounded-full p-2 shadow-md">
                  <svg
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
                  >
                    <circle cx="20" cy="20" r="19" fill="#3B9FE5" />
                    <path d="M20 8L12 16H16V28H24V16H28L20 8Z" fill="white" />
                  </svg>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                  {article.title}
                </h3>

                {/* Meta Info */}
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <span>by {article.author}</span>
                  <span className="mx-2">•</span>
                  <span>{article.date}</span>
                </div>

                {/* Excerpt */}
                <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-4">
                  {article.excerpt}
                </p>

                {/* Tag */}
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span className="font-medium">{article.tag}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
