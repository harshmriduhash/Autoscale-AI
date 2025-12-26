'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { GitBranch, Calendar, Rocket, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description?: string | null
    framework?: string | null
    repoUrl?: string | null
    createdAt: string
    deployments?: Array<{
      status: string
      url?: string | null
    }>
    _count?: {
      deployments: number
    }
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const latestDeployment = project.deployments?.[0]
  const deploymentCount = project._count?.deployments || 0

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="glass hover:glass-strong transition-all duration-300 border-white/10 hover:border-blue-500/50 h-full group cursor-pointer overflow-hidden relative">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-300" />
        
        <CardHeader className="relative z-10">
          <div className="flex items-start justify-between mb-2">
            <CardTitle className="text-xl text-white group-hover:text-blue-300 transition-colors">
              {project.name}
            </CardTitle>
            {project.framework && (
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                {project.framework}
              </Badge>
            )}
          </div>
          {project.description && (
            <CardDescription className="text-white/60 group-hover:text-white/80 transition-colors">
              {project.description}
            </CardDescription>
          )}
        </CardHeader>
        
        <CardContent className="relative z-10 space-y-3 text-sm text-white/70">
          {project.repoUrl && (
            <div className="flex items-center space-x-2">
              <GitBranch className="h-4 w-4 text-blue-400" />
              <span className="truncate text-white/60">{project.repoUrl}</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-blue-400" />
            <span className="text-white/60">Created {formatDate(project.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Rocket className="h-4 w-4 text-blue-400" />
            <span className="text-white/60">
              {deploymentCount} deployment{deploymentCount !== 1 ? 's' : ''}
            </span>
          </div>
          {latestDeployment && (
            <div className="pt-2">
              <Badge
                variant={
                  latestDeployment.status === 'success'
                    ? 'success'
                    : latestDeployment.status === 'failed'
                    ? 'destructive'
                    : 'warning'
                }
                className="text-xs"
              >
                {latestDeployment.status}
              </Badge>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="relative z-10 flex justify-between pt-4 border-t border-white/10">
          <Link href={`/projects/${project.id}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full border-white/20 text-white/80 hover:bg-white/10 hover:text-white hover:border-blue-500/50"
            >
              View Details
            </Button>
          </Link>
          <Link href={`/projects/${project.id}/deploy`} className="flex-1 ml-2">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
              <Rocket className="h-4 w-4 mr-2" />
              Deploy
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
