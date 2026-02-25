/**
 * Armazena temporariamente a resposta do check-in para exibir na página de alívio.
 * Usado quando auth está desabilitado (modo demo).
 */

const RESPONSE_KEY = 'maternilove-last-checkin-response';

export interface StoredCheckinResponse {
  title: string;
  message: string;
  suggestionLabel: string;
  suggestionAction: string;
  contentCategory: string;
  mood: string;
}

export function saveCheckinResponseForRelief(response: StoredCheckinResponse): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(RESPONSE_KEY, JSON.stringify(response));
  } catch {
    // ignore
  }
}

export function getCheckinResponseForRelief(): StoredCheckinResponse | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(RESPONSE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredCheckinResponse;
  } catch {
    return null;
  }
}
