import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import AuditLog from '@/models/AuditLog'
import { signToken, setAuthCookie } from '@/lib/auth'

interface GoogleTokenResponse {
  access_token?: string
  error?: string
}

interface GoogleUserInfo {
  id: string
  email: string
  name: string
  picture: string
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  if (!code) {
    return NextResponse.redirect(`${appUrl}/auth/login?error=oauth_cancelled`)
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${appUrl}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = (await tokenRes.json()) as GoogleTokenResponse
    if (!tokens.access_token) {
      return NextResponse.redirect(`${appUrl}/auth/login?error=oauth_failed`)
    }

    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const googleUser = (await userInfoRes.json()) as GoogleUserInfo

    if (!googleUser.email) {
      return NextResponse.redirect(`${appUrl}/auth/login?error=oauth_failed`)
    }

    await connectDB()

    let user = await User.findOne({ email: googleUser.email.toLowerCase() })

    if (!user) {
      user = await User.create({
        email: googleUser.email.toLowerCase(),
        name: googleUser.name || googleUser.email.split('@')[0],
        password: '',
        googleId: googleUser.id,
        role: 'user',
        subscription: { status: 'free', plan: 'free', expiresAt: null },
      })

      await AuditLog.create({
        action: 'REGISTER_GOOGLE',
        resource: 'auth',
        userId: user._id,
        userEmail: user.email,
        status: 'success',
        metadata: { name: user.name },
      })
    } else {
      if (!user.googleId) {
        user.googleId = googleUser.id
        await user.save()
      }

      await AuditLog.create({
        action: 'LOGIN_GOOGLE',
        resource: 'auth',
        userId: user._id,
        userEmail: user.email,
        status: 'success',
      })
    }

    const token = await signToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
      subscriptionStatus: user.subscription.status,
    })

    const response = NextResponse.redirect(`${appUrl}/app`)
    return setAuthCookie(response, token)
  } catch (err) {
    console.error('[google/callback]', err)
    return NextResponse.redirect(`${appUrl}/auth/login?error=server_error`)
  }
}
