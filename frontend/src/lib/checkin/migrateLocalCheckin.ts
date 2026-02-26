/**
 * Migração de dados de check-in local para backend após login.
 * TODO: Backend precisa expor endpoint para receber streak/pontos/histórico.
 * Por enquanto apenas limpa dados locais após tentativa (evitar duplicação no futuro).
 */

import { getLocalCheckinState } from './localCheckinStorage';

const STORAGE_KEY = 'maternilove-checkin-local';

export interface LocalCheckinMigratable {
  lastMood: string;
  lastCheckinAt: string;
  streakCount: number;
  points: number;
}

/**
 * Retorna dados locais para migração, se existirem.
 */
export function getLocalCheckinForMigration(): LocalCheckinMigratable | null {
  const state = getLocalCheckinState();
  if (!state.lastCheckinAt) return null;
  return {
    lastMood: state.lastMood,
    lastCheckinAt: state.lastCheckinAt,
    streakCount: state.streakCount,
    points: state.points,
  };
}

/**
 * Chamado após login. Se backend tiver endpoint de migração, enviar dados.
 * TODO: POST /api/v1/core/checkin/migrate-local com payload.
 */
export async function migrateLocalCheckinOnLogin(): Promise<void> {
  const data = getLocalCheckinForMigration();
  if (!data) return;

  // TODO: Chamar API quando endpoint existir
  // await apiClient.post(API_ENDPOINTS.CORE.CHECKIN_MIGRATE_LOCAL, data);

  // Por enquanto não limpa localStorage para manter streak visível no app
  // Quando integração estiver pronta: localStorage.removeItem(STORAGE_KEY);
}
