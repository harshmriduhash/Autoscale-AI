'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function NewProjectPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    repoUrl: '',
    framework: '',
    buildCommand: '',
    outputDirectory: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const project = await response.json()
        router.push(`/projects/${project.id}`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 pt-20">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass border-white/10">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="h-6 w-6 text-blue-400" />
                  <CardTitle className="text-2xl text-white">Create New Project</CardTitle>
                </div>
                <CardDescription className="text-white/60">
                  Set up a new project for deployment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white/80">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-white/10 rounded-md bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                      placeholder="my-awesome-app"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-white/80">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-white/10 rounded-md bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                      rows={3}
                      placeholder="A brief description of your project"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-white/80">
                      Repository URL
                    </label>
                    <input
                      type="url"
                      value={formData.repoUrl}
                      onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-white/10 rounded-md bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-white/80">
                      Framework
                    </label>
                    <select
                      value={formData.framework}
                      onChange={(e) => setFormData({ ...formData, framework: e.target.value })}
                      className="w-full px-3 py-2 border border-white/10 rounded-md bg-white/5 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                    >
                      <option value="">Select framework</option>
                      <option value="Next.js">Next.js</option>
                      <option value="React">React</option>
                      <option value="Vue">Vue</option>
                      <option value="Angular">Angular</option>
                      <option value="Svelte">Svelte</option>
                      <option value="Static">Static</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-white/80">
                      Build Command
                    </label>
                    <input
                      type="text"
                      value={formData.buildCommand}
                      onChange={(e) => setFormData({ ...formData, buildCommand: e.target.value })}
                      className="w-full px-3 py-2 border border-white/10 rounded-md bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                      placeholder="npm run build"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-white/80">
                      Output Directory
                    </label>
                    <input
                      type="text"
                      value={formData.outputDirectory}
                      onChange={(e) => setFormData({ ...formData, outputDirectory: e.target.value })}
                      className="w-full px-3 py-2 border border-white/10 rounded-md bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                      placeholder="dist or .next or build"
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
                      >
                        Cancel
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white glow"
                      >
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Create Project
                      </Button>
                    </motion.div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
