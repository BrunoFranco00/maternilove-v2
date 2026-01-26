/**
 * RBAC Utilitário - LOCK RBAC 1
 * Centraliza toda lógica de permissões baseada em roles
 * Frontend-only, não modifica backend
 */

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
    defaultRoute: '/dashboard',
  },
  MOTHER: {
    canAccessDashboard: true,
    requiresOnboarding: true,
    onboardingRoute: '/onboarding/mother',
    defaultRoute: '/dashboard',
  },
  PROFESSIONAL: {
    canAccessDashboard: true,
    requiresOnboarding: true,
    onboardingRoute: '/onboarding/professional',
    defaultRoute: '/dashboard',
  },
  COMPANY: {
    canAccessDashboard: true,
    requiresOnboarding: true,
    onboardingRoute: '/onboarding/company',
    defaultRoute: '/dashboard',
  },
  ADMIN: {
    canAccessDashboard: true,
    requiresOnboarding: false,
    defaultRoute: '/admin/overview',
  },
  SUPER_ADMIN: {
    canAccessDashboard: true,
    requiresOnboarding: false,
    defaultRoute: '/admin/overview',
  },
};

/**
 * Obter permissões de um role
 */
export function getRolePermissions(role: string): RolePermissions {
  const normalizedRole = role.toUpperCase() as UserRole;
  return ROLE_PERMISSIONS[normalizedRole] || ROLE_PERMISSIONS.USER;
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
  const normalizedRole = role.toUpperCase();
  return normalizedRole === 'ADMIN' || normalizedRole === 'SUPER_ADMIN';
}
