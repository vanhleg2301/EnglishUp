'use client';

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  subscription: {
    status: 'free' | 'active' | 'expired';
    plan: 'free' | 'monthly' | 'yearly';
    expiresAt: string | null;
  };
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const json = await res.json();
        if (json.success && mounted.current) {
          setUser(json.data);
          return;
        }
      }
      if (mounted.current) setUser(null);
    } catch {
      if (mounted.current) setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => {
      if (mounted.current) setLoading(false);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error ?? 'Login failed');
    if (mounted.current) setUser(json.data);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error ?? 'Registration failed');
    if (mounted.current) setUser(json.data);
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    if (mounted.current) setUser(null);
    router.push('/auth/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
