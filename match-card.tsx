// components/match-card.tsx
'use client'

import { motion } from 'framer-motion'
import { Lock, Clock, TrendingUp, Shield, AlertCircle } from 'lucide-react'
import { cn, calculateTimeLeft, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface MatchCardProps {
  id: string
  homeTeam: string
  awayTeam: string
  league: string
  matchDate: Date
  prediction: string
  predictionType: string
  confidence: number
  odds?: any
  isVip?: boolean
  isFeatured?: boolean
  status?: string
  result?: string
  userIsVip?: boolean
}

export function MatchCard({
  id,
  homeTeam,
  awayTeam,
  league,
  matchDate,
  prediction,
  predictionType,
  confidence,
  odds,
  isVip = false,
  isFeatured = false,
  status = 'PENDING',
  result,
  userIsVip = false,
}: MatchCardProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(matchDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(matchDate))
    }, 1000)
    return () => clearInterval(timer)
  }, [matchDate])

  const isLocked = isVip && !userIsVip
  const isWon = status === 'WON'
  const isLost = status === 'LOST'

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border transition-all duration-300',
        isFeatured 
          ? 'bg-gradient-to-br from-primary-900/50 to-dark-900 border-primary-500/30' 
          : 'glass-card',
        isWon && 'border-green-500/50 shadow-lg shadow-green-500/10',
        isLost && 'border-red-500/50 shadow-lg shadow-red-500/10'
      )}
    >
      {/* VIP Badge */}
      {isVip && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Lock className="w-3 h-3" />
            VIP
          </div>
        </div>
      )}

      {/* Status Badge */}
      {status !== 'PENDING' && (
        <div className={cn(
          "absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold",
          isWon ? "bg-green-500/20 text-green-400 border border-green-500/30" :
          isLost ? "bg-red-500/20 text-red-400 border border-red-500/30" :
          "bg-gray-500/20 text-gray-400"
        )}>
          {status}
        </div>
      )}

      <div className="p-6">
        {/* League & Time */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            {league}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {timeLeft.isExpired ? 'Live' : `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`}
          </span>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-white/5 flex items-center justify-center text-2xl font-bold">
              {homeTeam.slice(0, 2).toUpperCase()}
            </div>
            <div className="font-semibold text-sm">{homeTeam}</div>
          </div>
          
          <div className="px-4 text-center">
            <div className="text-2xl font-bold text-gray-500">VS</div>
            <div className="text-xs text-gray-500 mt-1">{formatDate(matchDate)}</div>
          </div>
          
          <div className="text-center flex-1">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-white/5 flex items-center justify-center text-2xl font-bold">
              {awayTeam.slice(0, 2).toUpperCase()}
            </div>
            <div className="font-semibold text-sm">{awayTeam}</div>
          </div>
        </div>

        {/* Prediction */}
        <div className={cn(
          "relative rounded-xl p-4 mb-4 text-center",
          isLocked ? 'bg-dark-800/50 blur-sm' : 'bg-primary-500/10 border border-primary-500/20'
        )}>
          {isLocked ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="w-8 h-8 text-gray-500" />
            </div>
          ) : (
            <>
              <div className="text-xs text-primary-400 uppercase tracking-wider mb-1">
                {predictionType.replace('_', ' ')}
              </div>
              <div className="text-2xl font-bold text-white mb-2">{prediction}</div>
              {odds && (
                <div className="text-sm text-gray-400">
                  Odds: <span className="text-accent-500 font-semibold">@{odds}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Confidence & CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex-1 w-24 h-2 bg-dark-800 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  confidence >= 80 ? 'bg-green-500' : 
                  confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                )}
                style={{ width: `${confidence}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">{confidence}%</span>
          </div>

          {isLocked ? (
            <Link 
              href="/pricing"
              className="text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              Unlock <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link 
              href={`/match/${id}`}
              className="text-sm font-semibold text-primary-400 hover:text-primary-300"
            >
              Analysis →
            </Link>
          )}
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-primary-500/5 to-transparent" />
      </div>
    </motion.div>
  )
}