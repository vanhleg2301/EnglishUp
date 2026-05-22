import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? 'fallback-secret');

interface JwtPayload {
  userId: string;
  role: string;
  [key: string]: unknown;
}

async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as JwtPayload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('auth-token')?.value;

  const isProtectedApp = pathname.startsWith('/app') || pathname.startsWith('/profile');
  const isAdmin = pathname.startsWith('/admin');
  const isAuth = pathname.startsWith('/auth');

  if (isAuth) {
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        return NextResponse.redirect(new URL('/app', req.url));
      }
    }
    return NextResponse.next();
  }

  if (isProtectedApp || isAdmin) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    const payload = await verifyToken(token);
    if (!payload) {
      const res = NextResponse.redirect(new URL('/auth/login', req.url));
      res.cookies.delete('auth-token');
      return res;
    }

    if (isAdmin && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/app', req.url));
    }

    const res = NextResponse.next();
    res.headers.set('x-user-role', payload.role as string);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/admin/:path*', '/profile/:path*', '/auth/:path*'],
};
