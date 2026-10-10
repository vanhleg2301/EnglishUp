import type { AuthUser } from '@/contexts/AuthContext';

/**
 * Temporary: the app is free and usable without an account. Flip to false to
 * bring back Pro gating for lessons, SG Sprint and Vocabulary SRS.
 * AI Chat stays gated regardless — it calls a paid API.
 */
export const FREE_ACCESS = true;

export function hasFullAccess(user: AuthUser | null): boolean {
  return FREE_ACCESS || user?.role === 'admin' || user?.subscription?.status === 'active';
}
