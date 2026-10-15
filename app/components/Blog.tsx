"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "../blog/posts";

export default function Blog() {
  return (
    <div id="blog" className="min-h-screen p-4 md:p-8 pt-20 md:pt-34">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-orbitron mb-4 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent"
          >
            Blog
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base md:text-xl text-gray-300 px-4"
          >
            Notes from the Circuit Labs team on cryptography, privacy, and the systems we build.
          </motion.p>
        </div>

        <div className="flex flex-col gap-6">
          {blogPosts.map((post) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-lg p-6 md:p-8 hover:border-cyan-400/60 transition-colors"
            >
              <h3 className="font-orbitron text-2xl md:text-3xl mb-3">
                <Link
                  href={`/blog/${post.slug}`}
                  className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hover:drop-shadow-[0_0_10px_rgba(0,255,255,0.5)] transition"
                >
                  {post.title}
                </Link>
              </h3>
              <p className="text-gray-400 leading-relaxed mb-5">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
              >
                Read post
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
