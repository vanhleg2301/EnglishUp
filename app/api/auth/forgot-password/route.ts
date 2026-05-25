import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import AuditLog from '@/models/AuditLog'

async function sha256Hex(input: string): Promise<string> {
  const buffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(input)
  )
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { email?: unknown }
    const { email } = body

    if (typeof email !== 'string' || !email.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    await connectDB()

    const user = await User.findOne({ email: email.toLowerCase() })

    // Always return success to avoid email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        data: { message: 'If the email exists, a reset code has been sent' },
      })
    }

    const resetCode = Math.random().toString(36).slice(2, 8).toUpperCase()
    const hashedToken = await sha256Hex(resetCode)

    user.resetPasswordToken = hashedToken
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    await user.save()

    await AuditLog.create({
      action: 'FORGOT_PASSWORD',
      resource: 'auth',
      userId: user._id,
      userEmail: user.email,
      status: 'success',
      metadata: {},
    })

    return NextResponse.json({
      success: true,
      data: { resetCode },
    })
  } catch (err) {
    console.error('[forgot-password]', err)
    const msg = err instanceof Error ? err.message : ''
    if (msg.includes('ECONNREFUSED') || msg.includes('MongoNetwork')) {
      return NextResponse.json({ success: false, error: 'Cannot connect to server. Please try again later.' }, { status: 503 })
    }
    return NextResponse.json({ success: false, error: 'An error occurred. Please try again.' }, { status: 500 })
  }
}

