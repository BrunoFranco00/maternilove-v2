/**
 * Persistência local do perfil (fallback até integração com API).
 * TODO: Integrar com API quando autenticação estiver habilitada.
 */

const STORAGE_KEY = 'maternilove-profile-local';

export interface LocalProfileData {
  fullName?: string;
  phone?: string;
  city?: string;
  state?: string;
  childName?: string;
  childSex?: string;
  childBirthDate?: string;
  childAgeMonths?: string;
  [key: string]: string | undefined;
}

export function loadLocalProfile(): LocalProfileData {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as LocalProfileData;
  } catch {
    return {};
  }
}

export function saveLocalProfile(data: LocalProfileData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}
