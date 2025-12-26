'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Project {
  id: string
  name: string
  description?: string | null
  repoUrl?: string | null
  framework?: string | null
  buildCommand?: string | null
  outputDirectory?: string | null
}

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState<Project>({
    id: '',
    name: '',
    description: '',
    repoUrl: '',
    framework: '',
    buildCommand: '',
    outputDirectory: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      fetchProject()
    }
  }, [params.id, status, router])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setFormData({
          id: data.id,
          name: data.name,
          description: data.description || '',
          repoUrl: data.repoUrl || '',
          framework: data.framework || '',
          buildCommand: data.buildCommand || '',
          outputDirectory: data.outputDirectory || '',
        })
      } else if (response.status === 404) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push(`/projects/${params.id}`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update project')
      }
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Failed to update project')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 text-blue-400" />
        </motion.div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 pt-20">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link href={`/projects/${params.id}`}>
            <Button variant="ghost" className="mb-4 text-white/80 hover:text-white hover:bg-white/10">
              ← Back to Project
            </Button>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass border-white/10">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="h-6 w-6 text-blue-400" />
                  <CardTitle className="text-2xl text-white">Edit Project</CardTitle>
                </div>
                <CardDescription className="text-white/60">
                  Update your project settings
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
                        Save Changes
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
