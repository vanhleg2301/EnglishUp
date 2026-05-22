import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import AuditLog from '@/models/AuditLog'
import { getAuthUser } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
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

    const { id } = await params

    const body = (await req.json()) as {
      role?: unknown
      subscription?: unknown
    }

    const update: Record<string, unknown> = {}

    if (body.role !== undefined) {
      if (body.role !== 'admin' && body.role !== 'user') {
        return NextResponse.json(
          { success: false, error: 'Invalid role' },
          { status: 400 }
        )
      }
      update.role = body.role
    }

    if (body.subscription !== undefined) {
      if (
        typeof body.subscription === 'object' &&
        body.subscription !== null &&
        !Array.isArray(body.subscription)
      ) {
        const sub = body.subscription as Record<string, unknown>
        if (sub.status !== undefined) {
          update['subscription.status'] = sub.status
        }
        if (sub.plan !== undefined) {
          update['subscription.plan'] = sub.plan
        }
        if (sub.expiresAt !== undefined) {
          update['subscription.expiresAt'] = sub.expiresAt
        }
      }
    }

    await connectDB()

    const user = await User.findByIdAndUpdate(id, update, { new: true }).select(
      '-password'
    )

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    await AuditLog.create({
      action: 'ADMIN_UPDATE_USER',
      resource: `users/${id}`,
      userId: authUser.userId,
      userEmail: authUser.email,
      status: 'success',
      metadata: { targetUserId: id, changes: body },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        subscription: user.subscription,
      },
    })
  } catch (err) {
    console.error('[admin/users PATCH]', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
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

    const { id } = await params

    await connectDB()

    const user = await User.findByIdAndDelete(id)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    await AuditLog.create({
      action: 'ADMIN_DELETE_USER',
      resource: `users/${id}`,
      userId: authUser.userId,
      userEmail: authUser.email,
      status: 'success',
      metadata: { deletedUserEmail: user.email },
    })

    return NextResponse.json({
      success: true,
      data: { message: 'User deleted successfully' },
    })
  } catch (err) {
    console.error('[admin/users DELETE]', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
