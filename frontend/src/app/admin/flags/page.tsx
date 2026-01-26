'use client';

import { FeatureFlagKey, DEFAULT_FEATURE_FLAGS } from '@/lib/flags/featureFlags';
import { flagsStore } from '@/store/flags.store';

export default function AdminFlagsPage() {
  const flags = flagsStore((state) => state.flags);
  const setFlag = flagsStore((state) => state.setFlag);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Feature Flags
          </h1>
          <p className="text-gray-600">
            Gerencie feature flags do sistema
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-4">
            {Object.keys(DEFAULT_FEATURE_FLAGS).map((key) => {
              const flagKey = key as FeatureFlagKey;
              const flag = flags[flagKey] || DEFAULT_FEATURE_FLAGS[flagKey];

              return (
                <div key={flagKey} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{flagKey}</h3>
                    {flag.description && (
                      <p className="text-sm text-gray-600 mt-1">{flag.description}</p>
                    )}
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={flag.enabled}
                      onChange={(e) => setFlag(flagKey, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
