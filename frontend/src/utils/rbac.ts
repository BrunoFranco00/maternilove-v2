/**
 * RBAC Utilitário - LOCK RBAC 1
 * Centraliza toda lógica de permissões baseada em roles
 * Frontend-only, não modifica backend
 */

import { normalizeRole, type NormalizedRole } from '@/lib/normalizeRole';

export type UserRole = 'USER' | 'MOTHER' | 'PROFESSIONAL' | 'COMPANY' | 'ADMIN' | 'SUPER_ADMIN';

export interface RolePermissions {
  canAccessDashboard: boolean;
  requiresOnboarding: boolean;
  onboardingRoute?: string;
  defaultRoute: string;
}

/**
 * Mapeamento de roles para permissões
 */
const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  USER: {
    canAccessDashboard: false,
    requiresOnboarding: false,
    defaultRoute: '/check-in',
  },
  MOTHER: {
    canAccessDashboard: true,
    requiresOnboarding: true,
    onboardingRoute: '/onboarding/mother',
    defaultRoute: '/check-in',
  },
  PROFESSIONAL: {
    canAccessDashboard: true,
    requiresOnboarding: true,
    onboardingRoute: '/onboarding/professional',
    defaultRoute: '/check-in',
  },
  COMPANY: {
    canAccessDashboard: true,
    requiresOnboarding: true,
    onboardingRoute: '/onboarding/company',
    defaultRoute: '/check-in',
  },
  ADMIN: {
    canAccessDashboard: true,
    requiresOnboarding: false,
    defaultRoute: '/admin',
  },
  SUPER_ADMIN: {
    canAccessDashboard: true,
    requiresOnboarding: false,
    defaultRoute: '/admin',
  },
};

/**
 * Obter permissões de um role
 * Sempre usa role normalizado (case-safe).
 */
export function getRolePermissions(role: string): RolePermissions {
  const normalized = normalizeRole(role) as NormalizedRole;
  const key = normalized as UserRole;
  return ROLE_PERMISSIONS[key] || ROLE_PERMISSIONS.USER;
}

/**
 * Verificar se role pode acessar dashboard
 */
export function canAccessDashboard(role: string): boolean {
  return getRolePermissions(role).canAccessDashboard;
}

/**
 * Verificar se role requer onboarding
 */
export function requiresOnboarding(role: string): boolean {
  return getRolePermissions(role).requiresOnboarding;
}

/**
 * Obter rota de onboarding para um role
 */
export function getOnboardingRoute(role: string): string | undefined {
  return getRolePermissions(role).onboardingRoute;
}

/**
 * Obter rota padrão para um role
 */
export function getDefaultRoute(role: string): string {
  return getRolePermissions(role).defaultRoute;
}

/**
 * Verificar se role é admin
 */
export function isAdmin(role: string): boolean {
  const normalized = normalizeRole(role);
  return normalized === 'ADMIN' || normalized === 'SUPER_ADMIN';
}
