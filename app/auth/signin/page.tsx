'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { Github, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black pt-20">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass border-white/10">
              <CardHeader className="text-center space-y-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="flex justify-center"
                >
                  <Sparkles className="h-12 w-12 text-blue-400" />
                </motion.div>
                <CardTitle className="text-3xl bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Sign In to Autoscale-AI
                </CardTitle>
                <CardDescription className="text-white/60 text-lg">
                  Deploy your applications with AI-powered optimizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg py-6 glow-strong"
                    onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
                  >
                    <Github className="h-5 w-5 mr-2" />
                    Sign in with GitHub
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
