import { create } from 'zustand';
import { FeatureFlagKey, FeatureFlag, DEFAULT_FEATURE_FLAGS } from '@/lib/flags/featureFlags';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { FeatureFlagsListDto, FeatureFlagDto } from '@/types/dto/feature-flag.dto';

interface FlagsState {
  flags: Record<FeatureFlagKey, FeatureFlag>;
  isLoading: boolean;
  error: string | null;
  loadFlags: () => Promise<void>;
  setFlag: (key: FeatureFlagKey, enabled: boolean) => void;
  setFlags: (flags: Partial<Record<FeatureFlagKey, FeatureFlag>>) => void;
  resetFlags: () => void;
}

export const flagsStore = create<FlagsState>((set, get) => ({
  flags: DEFAULT_FEATURE_FLAGS,
  isLoading: false,
  error: null,

  loadFlags: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<FeatureFlagsListDto>(API_ENDPOINTS.ADMIN.FLAGS);
      
      const backendFlags: Partial<Record<FeatureFlagKey, FeatureFlag>> = {};
      response.flags.forEach((flagDto: FeatureFlagDto) => {
        backendFlags[flagDto.key] = {
          key: flagDto.key,
          enabled: flagDto.enabled,
          description: flagDto.description,
        };
      });

      set((state) => ({
        flags: {
          ...DEFAULT_FEATURE_FLAGS,
          ...backendFlags,
        },
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar flags';
      set({
        flags: DEFAULT_FEATURE_FLAGS,
        isLoading: false,
        error: message,
      });
    }
  },

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
