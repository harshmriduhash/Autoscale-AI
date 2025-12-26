'use client'

import { Badge } from '@/components/ui/badge'
import { getStatusColor } from '@/lib/utils'
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react'

interface DeploymentStatusProps {
  status: string
}

export function DeploymentStatus({ status }: DeploymentStatusProps) {
  const statusConfig = {
    success: {
      icon: CheckCircle,
      variant: 'success' as const,
      label: 'Success',
    },
    failed: {
      icon: XCircle,
      variant: 'destructive' as const,
      label: 'Failed',
    },
    building: {
      icon: Loader2,
      variant: 'warning' as const,
      label: 'Building',
    },
    deploying: {
      icon: Loader2,
      variant: 'warning' as const,
      label: 'Deploying',
    },
    pending: {
      icon: Clock,
      variant: 'warning' as const,
      label: 'Pending',
    },
  }

  const config = statusConfig[status.toLowerCase() as keyof typeof statusConfig] || {
    icon: Clock,
    variant: 'default' as const,
    label: status,
  }

  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="flex items-center space-x-1">
      {status === 'building' || status === 'deploying' ? (
        <Icon className="h-3 w-3 animate-spin" />
      ) : (
        <Icon className="h-3 w-3" />
      )}
      <span>{config.label}</span>
    </Badge>
  )
}

