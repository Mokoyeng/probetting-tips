// app/api/webhook/stripe/route.ts
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const payload = await req.text()
    const signature = headers().get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
    } catch (err: any) {
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      )
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Update user to VIP
        await prisma.user.update({
          where: { id: session.metadata?.userId },
          data: { 
            isVip: true,
            vipExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        })

        // Create subscription record
        await prisma.subscription.create({
          data: {
            userId: session.metadata?.userId!,
            plan: session.metadata?.plan!.replace('VIP ', '').toUpperCase() as any,
            status: 'ACTIVE',
            amount: session.amount_total! / 100,
            currency: session.currency!,
            paymentMethod: 'stripe',
            transactionId: session.id,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        })
        break
      }
      
      case 'invoice.payment_failed': {
        // Handle failed payment
        break
      }
      
      case 'customer.subscription.deleted': {
        // Remove VIP status
        const subscription = event.data.object as Stripe.Subscription
        await prisma.user.update({
          where: { id: subscription.metadata?.userId },
          data: { isVip: false },
        })
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}