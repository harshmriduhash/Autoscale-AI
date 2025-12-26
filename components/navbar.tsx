'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Sparkles, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="h-7 w-7 text-blue-400 group-hover:text-blue-300 transition-colors" />
            </motion.div>
            <motion.span
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              Autoscale-AI
            </motion.span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {session ? (
              <>
                <Link href="/dashboard">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                      Dashboard
                    </Button>
                  </motion.div>
                </Link>
                <div className="flex items-center space-x-3 px-3 py-1.5 rounded-full glass">
                  {session.user?.image && (
                    <motion.img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="h-8 w-8 rounded-full ring-2 ring-blue-400/50"
                      whileHover={{ scale: 1.1 }}
                    />
                  )}
                  <span className="text-sm text-white/90">{session.user?.name}</span>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      onClick={() => signOut()}
                      className="border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
                    >
                      Sign Out
                    </Button>
                  </motion.div>
                </div>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/auth/signin">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 glow">
                    Sign In
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>

          <button
            className="md:hidden text-white/80 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 space-y-2 pb-4"
            >
              {session ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" className="w-full text-white/80 hover:text-white hover:bg-white/10">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => signOut()}
                    className="w-full border-white/20 text-white/80 hover:bg-white/10"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link href="/auth/signin">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    Sign In
                  </Button>
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
