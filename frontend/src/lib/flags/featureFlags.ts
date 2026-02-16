export type FeatureFlagKey =
  | 'CORE_EMOTIONAL_ENABLED'
  | 'MARKETPLACE_ENABLED'
  | 'COMMUNITY_ENABLED'
  | 'JOURNEY_ENABLED'
  | 'TESTERS_EXPERIMENTS_ENABLED'
  | 'ADMIN_LOGS_ENABLED';

export interface FeatureFlag {
  key: FeatureFlagKey;
  enabled: boolean;
  description?: string;
}

export const DEFAULT_FEATURE_FLAGS: Record<FeatureFlagKey, FeatureFlag> = {
  CORE_EMOTIONAL_ENABLED: {
    key: 'CORE_EMOTIONAL_ENABLED',
    enabled: true,
    description: 'Habilita o módulo core-emotional (check-in + relief)',
  },
  MARKETPLACE_ENABLED: {
    key: 'MARKETPLACE_ENABLED',
    enabled: false,
    description: 'Habilita o marketplace de produtos',
  },
  COMMUNITY_ENABLED: {
    key: 'COMMUNITY_ENABLED',
    enabled: false,
    description: 'Habilita a comunidade',
  },
  JOURNEY_ENABLED: {
    key: 'JOURNEY_ENABLED',
    enabled: false,
    description: 'Habilita a jornada do usuário',
  },
  TESTERS_EXPERIMENTS_ENABLED: {
    key: 'TESTERS_EXPERIMENTS_ENABLED',
    enabled: false,
    description: 'Habilita experimentos para testers',
  },
  ADMIN_LOGS_ENABLED: {
    key: 'ADMIN_LOGS_ENABLED',
    enabled: false,
    description: 'Habilita logs no admin',
  },
};
