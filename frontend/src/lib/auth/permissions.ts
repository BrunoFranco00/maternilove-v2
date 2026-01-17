import { UserRole, hasMinimumRole } from './roles';

export interface RoleAccessConfig {
  roles: UserRole[];
  requireAll?: boolean;
}

export function checkRoleAccess(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

export function checkRoleAccessWithConfig(userRole: UserRole, config: RoleAccessConfig): boolean {
  if (config.requireAll) {
    return config.roles.every(role => hasMinimumRole(userRole, role));
  }
  return config.roles.some(role => checkRoleAccess(userRole, [role]));
}

export function canAccessSegment(userRole: UserRole | undefined, segment: string): boolean {
  if (!userRole) return false;

  const segmentRoleMap: Record<string, UserRole[]> = {
    'user': ['USER', 'MOTHER', 'PROFESSIONAL', 'COMPANY'],
    'admin': ['ADMIN', 'SUPER_ADMIN'],
    'testers': ['SUPER_ADMIN'],
    'core-emotional': ['MOTHER', 'PROFESSIONAL', 'COMPANY', 'USER'],
  };

  const allowedRoles = segmentRoleMap[segment] || [];
  return checkRoleAccess(userRole, allowedRoles);
}
