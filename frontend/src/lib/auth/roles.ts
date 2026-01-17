export type UserRole = 
  | 'USER'
  | 'MOTHER'
  | 'PROFESSIONAL'
  | 'COMPANY'
  | 'ADMIN'
  | 'SUPER_ADMIN';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  USER: 0,
  MOTHER: 1,
  PROFESSIONAL: 2,
  COMPANY: 3,
  ADMIN: 4,
  SUPER_ADMIN: 5,
};

export function isRoleEqual(role1: UserRole, role2: UserRole): boolean {
  return role1 === role2;
}

export function hasMinimumRole(userRole: UserRole, minimumRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole];
}

export function normalizeRole(role: string): UserRole {
  const upperRole = role.toUpperCase() as UserRole;
  return upperRole in ROLE_HIERARCHY ? upperRole : 'USER';
}
