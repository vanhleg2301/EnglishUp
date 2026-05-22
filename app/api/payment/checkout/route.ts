import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import AuditLog from '@/models/AuditLog'
import { getAuthUser, signToken, setAuthCookie } from '@/lib/auth'

const PLAN_DURATION_MS: Record<'monthly' | 'yearly', number> = {
  monthly: 30 * 24 * 60 * 60 * 1000,
  yearly: 365 * 24 * 60 * 60 * 1000,
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser()
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = (await req.json()) as { plan?: unknown }
    const { plan } = body

    if (plan !== 'monthly' && plan !== 'yearly') {
      return NextResponse.json(
        { success: false, error: 'Plan must be "monthly" or "yearly"' },
        { status: 400 }
      )
    }

    await connectDB()

    const expiresAt = new Date(Date.now() + PLAN_DURATION_MS[plan])

    const user = await User.findByIdAndUpdate(
      authUser.userId,
      {
        'subscription.status': 'active',
        'subscription.plan': plan,
        'subscription.expiresAt': expiresAt,
      },
      { new: true }
    ).select('-password')

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    await AuditLog.create({
      action: 'SUBSCRIPTION_PURCHASE',
      resource: 'payment/checkout',
      userId: user._id,
      userEmail: user.email,
      status: 'success',
      metadata: { plan, expiresAt },
    })

    const token = await signToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
      subscriptionStatus: 'active',
    })

    const response = NextResponse.json({
      success: true,
      data: {
        subscription: user.subscription,
      },
    })

    return setAuthCookie(response, token)
  } catch (err) {
    console.error('[checkout]', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

