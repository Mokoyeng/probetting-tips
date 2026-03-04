// app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, Users, TrendingUp, Settings, 
  Plus, Edit2, Trash2, Search 
} from 'lucide-react'
import { cn } from '@/lib/utils'

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'predictions', label: 'Predictions', icon: TrendingUp },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState<any>({})
  const [predictions, setPredictions] = useState([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/')
    } else {
      fetchDashboardData()
    }
  }, [session, status])

  const fetchDashboardData = async () => {
    // Fetch stats and predictions
    const res = await fetch('/api/admin/stats')
    const data = await res.json()
    setStats(data)
  }

  if (status === 'loading') return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-dark-950 pt-20">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-dark-900 border-r border-white/10 min-h-screen p-4">
          <div className="mb-8 px-4">
            <h2 className="text-xl font-bold gradient-text">Admin Panel</h2>
          </div>
          
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                  activeTab === item.id 
                    ? 'bg-primary-600 text-white' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats.totalUsers || 0} trend="+12%" />
                <StatCard title="Active VIPs" value={stats.activeVips || 0} trend="+5%" />
                <StatCard title="Today's Tips" value={stats.todayTips || 0} />
                <StatCard title="Win Rate" value={`${stats.winRate || 0}%`} trend="+2%" />
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6">Recent Predictions</h3>
                <PredictionsTable predictions={predictions} />
              </div>
            </div>
          )}

          {activeTab === 'predictions' && <PredictionsManager />}
        </main>
      </div>
    </div>
  )
}

function StatCard({ title, value, trend }: { title: string; value: string | number; trend?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-2xl"
    >
      <div className="text-sm text-gray-400 mb-2">{title}</div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      {trend && (
        <div className="text-sm text-green-400 flex items-center gap-1">
          <TrendingUp className="w-4 h-4" />
          {trend}
        </div>
      )}
    </motion.div>
  )
}

function PredictionsManager() {
  const [isCreating, setIsCreating] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Predictions</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Prediction
        </button>
      </div>

      {isCreating && <CreatePredictionForm onClose={() => setIsCreating(false)} />}
    </div>
  )
}

function CreatePredictionForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    homeTeam: '',
    awayTeam: '',
    league: '',
    matchDate: '',
    prediction: '',
    predictionType: 'MATCH_WINNER',
    confidence: 75,
    isVip: false,
    odds1X2: { home: '', draw: '', away: '' },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          matchDate: new Date(formData.matchDate),
          odds1X2: {
            home: parseFloat(formData.odds1X2.home),
            draw: parseFloat(formData.odds1X2.draw),
            away: parseFloat(formData.odds1X2.away),
          },
        }),
      })
      
      if (res.ok) {
        toast.success('Prediction created successfully')
        onClose()
      }
    } catch (error) {
      toast.error('Failed to create prediction')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="glass-card p-6 rounded-2xl mb-6"
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Home Team</label>
          <input
            type="text"
            value={formData.homeTeam}
            onChange={(e) => setFormData({...formData, homeTeam: e.target.value})}
            className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Away Team</label>
          <input
            type="text"
            value={formData.awayTeam}
            onChange={(e) => setFormData({...formData, awayTeam: e.target.value})}
            className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">League</label>
          <input
            type="text"
            value={formData.league}
            onChange={(e) => setFormData({...formData, league: e.target.value})}
            className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Match Date</label>
          <input
            type="datetime-local"
            value={formData.matchDate}
            onChange={(e) => setFormData({...formData, matchDate: e.target.value})}
            className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Prediction Type</label>
          <select
            value={formData.predictionType}
            onChange={(e) => setFormData({...formData, predictionType: e.target.value})}
            className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
          >
            <option value="MATCH_WINNER">Match Winner (1X2)</option>
            <option value="OVER_UNDER">Over/Under</option>
            <option value="BTTS">Both Teams To Score</option>
            <option value="CORRECT_SCORE">Correct Score</option>
            <option value="HT_FT">Half Time/Full Time</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Prediction</label>
          <input
            type="text"
            value={formData.prediction}
            onChange={(e) => setFormData({...formData, prediction: e.target.value})}
            placeholder="e.g., Home Win or Over 2.5"
            className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Confidence (%)</label>
          <input
            type="range"
            min="1"
            max="100"
            value={formData.confidence}
            onChange={(e) => setFormData({...formData, confidence: parseInt(e.target.value)})}
            className="w-full"
          />
          <div className="text-center mt-1">{formData.confidence}%</div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isVip}
              onChange={(e) => setFormData({...formData, isVip: e.target.checked})}
              className="w-5 h-5 rounded border-white/10 bg-dark-800 text-primary-600"
            />
            <span>VIP Only</span>
          </label>
        </div>

        <div className="md:col-span-2 flex justify-end gap-4">
          <button type="button" onClick={onClose} className="btn-glass">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Create Prediction
          </button>
        </div>
      </form>
    </motion.div>
  )
}