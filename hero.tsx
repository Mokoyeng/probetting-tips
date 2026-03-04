// components/hero.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Target, Award } from 'lucide-react'

const stats = [
  { label: 'Accuracy Rate', value: '85%', icon: Target },
  { label: 'Total Tips', value: '12,000+', icon: TrendingUp },
  { label: 'Happy Users', value: '50K+', icon: Award },
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-dark-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/20 via-dark-950 to-dark-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
          </span>
          Live Predictions Available Now
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          Expert Football
          <span className="block gradient-text">Betting Tips</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto mb-10"
        >
          Get daily predictions with high accuracy rates. Join thousands of successful bettors 
          using our AI-powered analysis and expert insights.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/tips/free" className="btn-primary flex items-center gap-2 text-lg px-8">
            View Free Tips
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/pricing" className="btn-glass flex items-center gap-2 text-lg px-8">
            Upgrade to VIP
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="glass-card p-6 hover-lift">
              <stat.icon className="w-8 h-8 text-primary-500 mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-10 top-1/3 glass-card p-4 hidden lg:block"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <div className="text-sm font-semibold">Match Won</div>
            <div className="text-xs text-gray-400">Man City vs Arsenal</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute right-10 bottom-1/3 glass-card p-4 hidden lg:block"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <div className="text-sm font-semibold">New Prediction</div>
            <div className="text-xs text-gray-400">Champions League</div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}