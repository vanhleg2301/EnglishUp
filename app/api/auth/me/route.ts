import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { getAuthUser, signToken, setAuthCookie } from '@/lib/auth'

export async function GET() {
  try {
    const authUser = await getAuthUser()
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    const user = await User.findById(authUser.userId).select('-password')
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
        createdAt: user.createdAt,
      },
    })
  } catch (err) {
    console.error('[me GET]', err)
    return NextResponse.json({ success: false, error: 'Failed to load account info. Please try again.' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await getAuthUser()
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = (await req.json()) as { name?: unknown }
    const { name } = body

    if (typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Name must be at least 2 characters' },
        { status: 400 }
      )
    }

    await connectDB()

    const user = await User.findByIdAndUpdate(
      authUser.userId,
      { name: name.trim() },
      { new: true }
    ).select('-password')

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

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
    console.error('[me PATCH]', err)
    return NextResponse.json({ success: false, error: 'Failed to update account info. Please try again.' }, { status: 500 })
  }
}

