import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import AuditLog from '@/models/AuditLog'
import { signToken, comparePassword, setAuthCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { email?: unknown; password?: unknown }
    const { email, password } = body

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    await connectDB()

    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      await AuditLog.create({
        action: 'LOGIN_FAILED',
        resource: 'auth',
        userId: null,
        userEmail: email.toLowerCase(),
        status: 'error',
        metadata: { reason: 'User not found' },
      })
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const passwordMatch = await comparePassword(password, user.password)

    if (!passwordMatch) {
      await AuditLog.create({
        action: 'LOGIN_FAILED',
        resource: 'auth',
        userId: user._id,
        userEmail: user.email,
        status: 'error',
        metadata: { reason: 'Wrong password' },
      })
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if subscription expired
    if (
      user.subscription.status === 'active' &&
      user.subscription.expiresAt &&
      new Date(user.subscription.expiresAt) < new Date()
    ) {
      user.subscription.status = 'expired'
      await user.save()
    }

    await AuditLog.create({
      action: 'LOGIN',
      resource: 'auth',
      userId: user._id,
      userEmail: user.email,
      status: 'success',
      metadata: {},
    })

    const token = await signToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
      subscriptionStatus: user.subscription.status,
    })

    const response = NextResponse.json({
      success: true,
      data: {
        userId: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
      },
    })

    return setAuthCookie(response, token)
  } catch (err) {
    console.error('[login]', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

