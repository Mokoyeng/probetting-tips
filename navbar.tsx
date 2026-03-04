// components/navbar.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, X, Crown, User, LogOut, 
  ChevronDown, Zap, Shield 
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Free Tips', href: '/tips/free' },
  { name: 'VIP Tips', href: '/tips/vip', isVip: true },
  { name: 'Categories', href: '/categories' },
  { name: 'Blog', href: '/blog' },
  { name: 'Pricing', href: '/pricing' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-dark-950/80 backdrop-blur-xl border-b border-white/10' 
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <Zap className="w-8 h-8 text-primary-500 relative z-10" />
            </div>
            <span className="text-2xl font-bold">
              Pro<span className="gradient-text">Betting</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'relative text-sm font-medium transition-colors hover:text-primary-400',
                  link.isVip && 'flex items-center gap-1 text-amber-400 hover:text-amber-300'
                )}
              >
                {link.isVip && <Crown className="w-4 h-4" />}
                {link.name}
                {link.isVip && (
                  <span className="absolute -top-2 -right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">{session.user?.name || 'User'}</span>
                  {session.user?.isVip && <Crown className="w-4 h-4 text-amber-400" />}
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 py-2 bg-dark-800 rounded-xl border border-white/10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-white/5">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-white/5">
                    Profile
                  </Link>
                  {session.user?.role === 'ADMIN' && (
                    <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-white/5 text-primary-400">
                      Admin Panel
                    </Link>
                  )}
                  <hr className="my-2 border-white/10" />
                  <button 
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium hover:text-primary-400 transition-colors">
                  Sign in
                </Link>
                <Link href="/register" className="btn-primary text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-950/95 backdrop-blur-xl border-b border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'block py-2 text-lg font-medium',
                    link.isVip && 'flex items-center gap-2 text-amber-400'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.isVip && <Crown className="w-5 h-5" />}
                  {link.name}
                </Link>
              ))}
              <hr className="border-white/10" />
              {session ? (
                <button 
                  onClick={() => signOut()}
                  className="w-full py-3 text-center text-red-400 font-medium"
                >
                  Sign out
                </button>
              ) : (
                <div className="space-y-3">
                  <Link 
                    href="/login" 
                    className="block w-full py-3 text-center rounded-xl bg-white/5 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link 
                    href="/register" 
                    className="block w-full py-3 text-center rounded-xl bg-primary-600 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}