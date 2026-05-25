import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import AuditLog from '@/models/AuditLog'
import { signToken, hashPassword, setAuthCookie } from '@/lib/auth'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      name?: unknown
      email?: unknown
      password?: unknown
    }
    const { name, email, password } = body

    if (typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Name must be at least 2 characters' },
        { status: 400 }
      )
    }
    if (typeof email !== 'string' || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      )
    }
    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    await connectDB()

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email already in use' },
        { status: 409 }
      )
    }

    const hashedPassword = await hashPassword(password)

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
      subscription: {
        status: 'free',
        plan: 'free',
        expiresAt: null,
      },
    })

    await AuditLog.create({
      action: 'REGISTER',
      resource: 'auth',
      userId: user._id,
      userEmail: user.email,
      status: 'success',
      metadata: { name: user.name },
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
    console.error('[register]', err)
    if ((err as { code?: number }).code === 11000) {
      return NextResponse.json({ success: false, error: 'This email is already registered. Please log in or use a different email.' }, { status: 409 })
    }
    const msg = err instanceof Error ? err.message : ''
    if (msg.includes('ECONNREFUSED') || msg.includes('MongoNetwork')) {
      return NextResponse.json({ success: false, error: 'Cannot connect to server. Please try again later.' }, { status: 503 })
    }
    if (msg.includes('buffering timed out') || msg.includes('timed out')) {
      return NextResponse.json({ success: false, error: 'Server is busy. Please try again in a few seconds.' }, { status: 503 })
    }
    return NextResponse.json({ success: false, error: 'An unexpected error occurred. Please try again.' }, { status: 500 })
  }
}

