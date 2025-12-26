'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Rocket, Zap, Shield, Globe, Brain, TrendingUp, Lock, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-24 pt-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-20"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center space-x-3 mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-16 w-16 text-blue-400" />
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"
            >
              Autoscale-AI
            </motion.h1>
          </motion.div>
          
          <motion.p
            variants={itemVariants}
            className="text-2xl md:text-3xl text-white/90 mb-4 max-w-3xl mx-auto font-light"
          >
            The Next Evolution of Cloud Deployment
          </motion.p>
          
          <motion.p
            variants={itemVariants}
            className="text-lg text-white/70 mb-12 max-w-2xl mx-auto"
          >
            Deploy applications with AI-powered optimizations, predictive scaling, and autonomous error fixing. 
            Experience infrastructure that thinks, learns, and adapts to your needs.
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center space-x-4 flex-wrap gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/auth/signin">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg px-8 py-6 glow-strong">
                  <Rocket className="h-5 w-5 mr-2" />
                  Get Started Free
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="border-white/20 text-white/90 hover:bg-white/10 hover:text-white text-lg px-8 py-6">
                  View Dashboard
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {[
            { 
              icon: Rocket, 
              title: 'One-Click Deployment', 
              desc: 'Deploy static and dynamic applications instantly with automated build processes and zero configuration required.' 
            },
            { 
              icon: Brain, 
              title: 'AI-Powered Intelligence', 
              desc: 'Self-healing deployments that automatically detect and fix errors, with intelligent optimization suggestions.' 
            },
            { 
              icon: Shield, 
              title: 'Predictive Scaling', 
              desc: 'Zero cold starts with AI-driven auto-scaling that predicts traffic patterns and scales before you need it.' 
            },
            { 
              icon: Globe, 
              title: 'Global Edge Network', 
              desc: 'Deploy to edge locations worldwide for optimal performance and ultra-low latency for your users.' 
            },
          ].map((feature, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Card className="glass hover:glass-strong transition-all duration-300 border-white/10 hover:border-blue-500/50 group cursor-pointer h-full">
                <CardHeader>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="h-10 w-10 text-blue-400 mb-4 group-hover:text-blue-300 transition-colors" />
                  </motion.div>
                  <CardTitle className="text-white group-hover:text-blue-300 transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-white/60 group-hover:text-white/80 transition-colors">
                    {feature.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <Card className="glass-strong border-blue-500/30 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl text-white mb-2">Why Choose Autoscale-AI?</CardTitle>
              <CardDescription className="text-white/70">
                Revolutionary AI features that set us apart from traditional deployment platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: Zap, text: 'AI Self-Healing: Automatically detects and fixes deployment errors without manual intervention' },
                  { icon: Brain, text: 'Intelligent Log Analysis: AI-powered insights that transform noise into actionable intelligence' },
                  { icon: TrendingUp, text: 'Predictive Scaling: Scale infrastructure before traffic spikes hit, ensuring zero downtime' },
                  { icon: Lock, text: 'Security Scanner: Automated vulnerability detection and security recommendations' },
                  { icon: Rocket, text: 'Build Intelligence: Learn from past deployments to optimize build times by up to 90%' },
                  { icon: Shield, text: 'Cost Optimization: AI-driven FinOps that reduces cloud costs while improving performance' },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <item.icon className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Everything You Need to Deploy</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              From code to production in minutes, with AI that works alongside you every step of the way.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Smart Builds',
                description: 'AI analyzes your codebase and suggests optimal build configurations, reducing build times significantly.',
                features: ['Incremental builds', 'Intelligent caching', 'Dependency optimization']
              },
              {
                title: 'Autonomous Operations',
                description: 'Deployments that monitor themselves, fix errors automatically, and optimize performance in real-time.',
                features: ['Self-healing errors', 'Auto-rollbacks', 'Performance tuning']
              },
              {
                title: 'Predictive Infrastructure',
                description: 'AI predicts traffic patterns and scales your infrastructure proactively, eliminating cold starts.',
                features: ['Traffic forecasting', 'Auto-scaling', 'Cost optimization']
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="glass border-white/10 h-full">
                  <CardHeader>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                    <CardDescription className="text-white/70">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.features.map((f, i) => (
                        <li key={i} className="flex items-center space-x-2 text-white/80 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-blue-400" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Card className="glass-strong border-blue-500/30 max-w-2xl mx-auto">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Deployments?</h2>
              <p className="text-white/70 mb-8 text-lg">
                Join thousands of developers deploying faster and smarter with AI-powered infrastructure.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/auth/signin">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg px-8 py-6 glow-strong">
                    <Rocket className="h-5 w-5 mr-2" />
                    Start Deploying Now
                  </Button>
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
