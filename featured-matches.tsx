// components/featured-matches.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MatchCard } from './match-card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Flame, Clock, CheckCircle } from 'lucide-react'

export function FeaturedMatches() {
  const [matches, setMatches] = useState([])
  const [activeTab, setActiveTab] = useState('today')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMatches()
  }, [activeTab])

  const fetchMatches = async () => {
    try {
      const res = await fetch(`/api/predictions?filter=${activeTab}&limit=6`)
      const data = await res.json()
      setMatches(data.predictions || [])
    } catch (error) {
      console.error('Failed to fetch matches:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'today', label: 'Today', icon: Flame },
    { id: 'upcoming', label: 'Upcoming', icon: Clock },
    { id: 'results', label: 'Results', icon: CheckCircle },
  ]

  return (
    <section className="py-20 bg-dark-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured <span className="gradient-text">Predictions</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Hand-picked matches with the highest probability of success based on our AI analysis
          </p>
        </div>

        <Tabs defaultValue="today" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-8">
            <TabsList className="bg-dark-800/50 border border-white/10 p-1 rounded-xl">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-primary-600 data-[state=active]:text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-dark-800/50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {matches.map((match: any) => (
                <MatchCard key={match.id} {...match} />
              ))}
            </motion.div>
          )}
        </Tabs>

        <div className="text-center mt-12">
          <a href="/tips/free" className="btn-glass inline-flex items-center gap-2">
            View All Predictions
          </a>
        </div>
      </div>
    </section>
  )
}