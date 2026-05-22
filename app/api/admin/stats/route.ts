import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import AuditLog from '@/models/AuditLog'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  try {
    const authUser = await getAuthUser()
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    if (authUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    await connectDB()

    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const [totalUsers, activeSubscriptions, freeUsers, recentLogins, newUsersThisWeek] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ 'subscription.status': 'active' }),
        User.countDocuments({ 'subscription.status': 'free' }),
        AuditLog.countDocuments({ action: 'LOGIN', status: 'success', createdAt: { $gte: since24h } }),
        User.countDocuments({ createdAt: { $gte: since7d } }),
      ])

    return NextResponse.json({
      success: true,
      data: { totalUsers, activeSubscriptions, freeUsers, recentLogins, newUsersThisWeek },
    })
  } catch (err) {
    console.error('[admin/stats]', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
