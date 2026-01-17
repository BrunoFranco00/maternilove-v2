import { FeatureFlagKey, DEFAULT_FEATURE_FLAGS } from './featureFlags';
import { flagsStore } from '@/store/flags.store';

export function resolveFeatureFlag(flagKey: FeatureFlagKey): boolean {
  const storeValue = flagsStore.getState().flags[flagKey];
  if (storeValue !== undefined) {
    return storeValue.enabled;
  }
  return DEFAULT_FEATURE_FLAGS[flagKey]?.enabled ?? false;
}

export function getFlagValue(flagKey: FeatureFlagKey): boolean {
  return resolveFeatureFlag(flagKey);
}

export function getAllFlags(): Record<FeatureFlagKey, boolean> {
  const store = flagsStore.getState();
  const result: Partial<Record<FeatureFlagKey, boolean>> = {};
  
  Object.keys(DEFAULT_FEATURE_FLAGS).forEach((key) => {
    const flagKey = key as FeatureFlagKey;
    result[flagKey] = getFlagValue(flagKey);
  });

  return result as Record<FeatureFlagKey, boolean>;
}
