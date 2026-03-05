"use client"
import {motion} from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export const Landing = () => {
    return ( <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden px-6">
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-status-want opacity-60"
        animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-32 right-16 w-48 h-48 rounded-full bg-status-reading opacity-50"
        animate={{ y: [0, 15, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-status-completed opacity-40"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative z-10 text-center max-w-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-semibold tracking-tight leading-[1.05] mb-8">
          Your Reading,
          <br />
          <span className="italic font-normal">Reimagined.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto mb-12 font-sans">
          A quiet space to log your books, reflect on your habits, and rediscover your favorite authors.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full text-base font-medium font-sans hover:opacity-90 transition-opacity"
        >
          Get Started
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>)
}