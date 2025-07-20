import { useState, useEffect } from 'react'
import { blink } from '@/blink/client'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { AppHeader } from '@/components/layout/AppHeader'
import { Dashboard } from '@/pages/Dashboard'
import { Pipeline } from '@/pages/Pipeline'
import { Forecasting } from '@/pages/Forecasting'
import { Deals } from '@/pages/Deals'
import { Team } from '@/pages/Team'
import { Settings } from '@/pages/Settings'

const pageComponents = {
  dashboard: Dashboard,
  pipeline: Pipeline,
  forecasting: Forecasting,
  deals: Deals,
  team: Team,
  settings: Settings,
}

const pageTitles = {
  dashboard: 'Dashboard',
  pipeline: 'Sales Pipeline',
  forecasting: 'Revenue Forecasting',
  deals: 'Deal Management',
  team: 'Team Performance',
  settings: 'Settings',
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('dashboard')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm text-gray-600">Loading Clari...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Clari</h1>
          <p className="text-gray-600 mb-6">
            AI-powered sales forecasting platform that helps teams predict revenue, track deals, and analyze performance.
          </p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    )
  }

  const CurrentPageComponent = pageComponents[currentPage as keyof typeof pageComponents]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AppSidebar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader title={pageTitles[currentPage as keyof typeof pageTitles]} />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <CurrentPageComponent />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App