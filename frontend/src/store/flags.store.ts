import { create } from 'zustand';
import { FeatureFlagKey, FeatureFlag, DEFAULT_FEATURE_FLAGS } from '@/lib/flags/featureFlags';

interface FlagsState {
  flags: Record<FeatureFlagKey, FeatureFlag>;
  setFlag: (key: FeatureFlagKey, enabled: boolean) => void;
  setFlags: (flags: Partial<Record<FeatureFlagKey, FeatureFlag>>) => void;
  resetFlags: () => void;
}

export const flagsStore = create<FlagsState>((set) => ({
  flags: DEFAULT_FEATURE_FLAGS,
  setFlag: (key, enabled) =>
    set((state) => ({
      flags: {
        ...state.flags,
        [key]: {
          ...state.flags[key],
          enabled,
        },
      },
    })),
  setFlags: (newFlags) =>
    set((state) => ({
      flags: {
        ...state.flags,
        ...newFlags,
      },
    })),
  resetFlags: () =>
    set({
      flags: DEFAULT_FEATURE_FLAGS,
    }),
}));
