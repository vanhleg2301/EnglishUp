import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import AuditLog from '@/models/AuditLog'
import { hashPassword } from '@/lib/auth'

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
    const body = (await req.json()) as {
      email?: unknown
      resetCode?: unknown
      newPassword?: unknown
    }
    const { email, resetCode, newPassword } = body

    if (
      typeof email !== 'string' ||
      typeof resetCode !== 'string' ||
      typeof newPassword !== 'string'
    ) {
      return NextResponse.json(
        { success: false, error: 'email, resetCode and newPassword are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 8 characters' },
        { status: 400 }
      )
    }

    await connectDB()

    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired reset code' },
        { status: 400 }
      )
    }

    if (new Date(user.resetPasswordExpires) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Reset code has expired' },
        { status: 400 }
      )
    }

    const hashedCode = await sha256Hex(resetCode.toUpperCase())

    if (hashedCode !== user.resetPasswordToken) {
      return NextResponse.json(
        { success: false, error: 'Invalid reset code' },
        { status: 400 }
      )
    }

    user.password = await hashPassword(newPassword)
    user.resetPasswordToken = null
    user.resetPasswordExpires = null
    await user.save()

    await AuditLog.create({
      action: 'RESET_PASSWORD',
      resource: 'auth',
      userId: user._id,
      userEmail: user.email,
      status: 'success',
      metadata: {},
    })

    return NextResponse.json({
      success: true,
      data: { message: 'Password reset successfully' },
    })
  } catch (err) {
    console.error('[reset-password]', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

