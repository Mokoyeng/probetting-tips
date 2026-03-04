// components/pricing-section.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Crown, Zap, Star } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Basic predictions for casual bettors',
    features: [
      '3-5 free tips daily',
      'Basic match analysis',
      'Community access',
      'Email notifications',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'VIP Weekly',
    price: 9.99,
    period: 'week',
    description: 'Full access for serious bettors',
    features: [
      'All premium predictions',
      'Detailed analysis & stats',
      'High confidence picks (80%+)',
      'BTTS & Correct Score tips',
      'HT/FT predictions',
      'WhatsApp notifications',
      'Priority support',
    ],
    cta: 'Start Weekly Plan',
    popular: false,
  },
  {
    name: 'VIP Monthly',
    price: 29.99,
    period: 'month',
    description: 'Best value for professional bettors',
    features: [
      'Everything in Weekly',
      'Early access to tips',
      'Bankroll management guide',
      'Exclusive betting strategies',
      'Live chat support',
      'Cancel anytime',
    ],
    cta: 'Go VIP Monthly',
    popular: true,
  },
  {
    name: 'VIP Yearly',
    price: 199.99,
    period: 'year',
    description: 'Maximum savings for committed users',
    features: [
      'Everything in Monthly',
      'Save 45% vs monthly',
      'Personal betting consultant',
      'Custom predictions',
      'API access',
      'White-label options',
    ],
    cta: 'Get Yearly Access',
    popular: false,
  },
]

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const { data: session } = useSession()
  const router = useRouter()

  const handleSubscribe = async (planName: string) => {
    if (!session) {
      router.push('/login?callbackUrl=/pricing')
      return
    }

    if (planName === 'Free') {
      router.push('/tips/free')
      return
    }

    setLoading(planName)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planName }),
      })
      
      const { sessionId } = await response.json()
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      
      await stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <section className="py-20 bg-dark-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/10 via-dark-950 to-dark-950" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Choose Your <span className="gradient-text">Winning Plan</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Join thousands of successful bettors. Upgrade to VIP for exclusive access to our highest-confidence predictions.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'relative rounded-2xl p-6 border transition-all duration-300',
                plan.popular 
                  ? 'bg-gradient-to-b from-primary-900/50 to-dark-900 border-primary-500/50 scale-105 shadow-2xl shadow-primary-500/20' 
                  : 'glass-card hover:border-white/20'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10 mb-4">
                  {plan.name === 'Free' ? (
                    <Zap className="w-6 h-6 text-primary-500" />
                  ) : (
                    <Crown className="w-6 h-6 text-amber-400" />
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-400">/{plan.period}</span>
                </div>
                <p className="text-sm text-gray-400">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className={cn(
                      "w-5 h-5 shrink-0",
                      plan.name === 'Free' ? 'text-gray-500' : 'text-accent-500'
                    )} />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.name)}
                disabled={loading === plan.name}
                className={cn(
                  'w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2',
                  plan.popular
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : plan.name === 'Free'
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30'
                )}
              >
                {loading === plan.name ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  plan.cta
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {/* M-Pesa Notice */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400">
            M-Pesa payments available for Kenyan users. Contact support for details.
          </p>
        </div>
      </div>
    </section>
  )
}