import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import AuditLog from '@/models/AuditLog'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser()
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    if (authUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const limitParam = req.nextUrl.searchParams.get('limit')
    const limit = Math.min(
      limitParam ? Math.max(1, parseInt(limitParam, 10)) : 50,
      100
    )

    await connectDB()

    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(limit)

    return NextResponse.json({
      success: true,
      data: logs.map((log) => ({
        id: String(log._id),
        action: log.action,
        resource: log.resource,
        userId: log.userId ? String(log.userId) : null,
        userEmail: log.userEmail,
        status: log.status,
        metadata: log.metadata,
        createdAt: log.createdAt,
      })),
    })
  } catch (err) {
    console.error('[admin/audit]', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

