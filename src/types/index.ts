export interface Deal {
  id: string
  title: string
  company: string
  value: number
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost'
  probability: number
  closeDate: string
  owner: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface ForecastData {
  id: string
  period: string
  committed: number
  bestCase: number
  pipeline: number
  closed: number
  userId: string
  createdAt: string
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  quota: number
  achieved: number
  deals: number
  avatar?: string
}

export interface PipelineStage {
  id: string
  name: string
  probability: number
  deals: Deal[]
  value: number
}