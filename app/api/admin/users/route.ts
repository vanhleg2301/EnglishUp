import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import AuditLog from '@/models/AuditLog'
import { getAuthUser, hashPassword } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser()
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    if (authUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    await connectDB()

    const search = req.nextUrl.searchParams.get('search')
    const roleFilter = req.nextUrl.searchParams.get('role')
    const statusFilter = req.nextUrl.searchParams.get('status')

    const filter: Record<string, unknown> = {}
    if (search) filter.email = { $regex: search, $options: 'i' }
    if (roleFilter && roleFilter !== 'all') filter.role = roleFilter
    if (statusFilter && statusFilter !== 'all') filter['subscription.status'] = statusFilter

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      data: users.map((u) => ({
        id: String(u._id),
        name: u.name,
        email: u.email,
        role: u.role,
        subscription: u.subscription,
        createdAt: u.createdAt,
      })),
    })
  } catch (err) {
    console.error('[admin/users GET]', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser()
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    if (authUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { name, email, password, role = 'user', plan = 'free' } = body

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json({ success: false, error: 'Name, email, and password are required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 })
    }

    if (role !== 'user' && role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Invalid role' }, { status: 400 })
    }

    await connectDB()

    const exists = await User.findOne({ email: email.toLowerCase().trim() })
    if (exists) {
      return NextResponse.json({ success: false, error: 'Email already in use' }, { status: 409 })
    }

    const hashedPw = await hashPassword(password)
    const subscriptionStatus = plan === 'free' ? 'free' : 'active'

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPw,
      role,
      subscription: { status: subscriptionStatus, plan },
    })

    await AuditLog.create({
      action: 'ADMIN_CREATE_USER',
      resource: `users/${user._id}`,
      userId: authUser.userId,
      userEmail: authUser.email,
      status: 'success',
      metadata: { createdUserEmail: email, role, plan },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
        createdAt: user.createdAt,
      },
    })
  } catch (err) {
    console.error('[admin/users POST]', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
