/**
 * Normalização única de roles em todo o frontend.
 * Sempre retorna o valor canônico em UPPERCASE ou null.
 */

export type NormalizedRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'USER'
  | 'TESTER'
  | 'MOTHER'
  | 'PROFESSIONAL'
  | 'COMPANY';

const ALLOWED_ROLES: NormalizedRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'USER',
  'TESTER',
  'MOTHER',
  'PROFESSIONAL',
  'COMPANY',
];

export function normalizeRole(role?: string | null): NormalizedRole | null {
  if (!role) return null;
  const upper = role.toUpperCase();
  return (ALLOWED_ROLES as readonly string[]).includes(upper)
    ? (upper as NormalizedRole)
    : null;
}

