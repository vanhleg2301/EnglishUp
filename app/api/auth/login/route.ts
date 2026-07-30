import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import AuditLog from '@/models/AuditLog'
import { signToken, comparePassword, setAuthCookie } from '@/lib/auth'
import { checkRateLimit, getClientIP } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const { limited, retryAfterMs } = checkRateLimit(getClientIP(req));
  if (limited) {
    return NextResponse.json(
      { success: false, error: 'Too many attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) } }
    );
  }

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
        { success: false, error: 'This email is not registered. Would you like to create an account?' },
        { status: 401 }
      )
    }

    if (!user.password) {
      return NextResponse.json(
        { success: false, error: 'This account uses Google sign-in. Please use the "Continue with Google" button.' },
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
        { success: false, error: 'Incorrect password. Please try again or use "Forgot?" to reset.' },
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
    const msg = err instanceof Error ? err.message : ''
    if (msg.includes('ECONNREFUSED') || msg.includes('connect') || msg.includes('MongoNetwork')) {
      return NextResponse.json({ success: false, error: 'Cannot connect to server. Please try again later.' }, { status: 503 })
    }
    if (msg.includes('buffering timed out') || msg.includes('timed out')) {
      return NextResponse.json({ success: false, error: 'Server is busy. Please try again in a few seconds.' }, { status: 503 })
    }
    return NextResponse.json({ success: false, error: 'An unexpected error occurred. Please try again.' }, { status: 500 })
  }
}

