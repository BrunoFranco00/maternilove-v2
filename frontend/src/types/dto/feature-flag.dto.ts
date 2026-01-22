import { FeatureFlagKey } from '@/lib/flags/featureFlags';

export interface FeatureFlagDto {
  key: FeatureFlagKey;
  enabled: boolean;
  description?: string;
}

export interface FeatureFlagsListDto {
  flags: FeatureFlagDto[];
}
