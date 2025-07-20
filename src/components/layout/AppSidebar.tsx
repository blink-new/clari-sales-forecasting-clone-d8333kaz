import { useState } from 'react'
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  Users, 
  Settings, 
  Home,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface AppSidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'pipeline', name: 'Pipeline', icon: BarChart3 },
  { id: 'forecasting', name: 'Forecasting', icon: TrendingUp },
  { id: 'deals', name: 'Deals', icon: Target },
  { id: 'team', name: 'Team', icon: Users },
  { id: 'settings', name: 'Settings', icon: Settings },
]

export function AppSidebar({ currentPage, onPageChange }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg text-gray-900">Clari</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 h-8 w-8"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-5 h-5 mr-3")} />
                  {!collapsed && <span>{item.name}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Profile */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
              <p className="text-xs text-gray-500 truncate">Sales Manager</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}