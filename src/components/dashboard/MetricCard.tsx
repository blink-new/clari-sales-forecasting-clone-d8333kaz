import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string
  change: number
  changeLabel: string
  icon?: React.ReactNode
  trend?: 'up' | 'down'
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeLabel, 
  icon,
  trend = 'up'
}: MetricCardProps) {
  const isPositive = change > 0
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-gray-400">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-2">
          {value}
        </div>
        <div className="flex items-center space-x-2">
          <Badge 
            variant="secondary" 
            className={cn(
              "flex items-center space-x-1",
              isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            )}
          >
            <TrendIcon className="w-3 h-3" />
            <span>{Math.abs(change)}%</span>
          </Badge>
          <span className="text-xs text-gray-500">{changeLabel}</span>
        </div>
      </CardContent>
    </Card>
  )
}