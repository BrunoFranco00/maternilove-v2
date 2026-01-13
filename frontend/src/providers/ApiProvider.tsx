'use client';

/**
 * API Provider
 * Expõe httpClient e helpers via React Context
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { getHttpClient, HttpClient } from '@/services/httpClient';
import type { ApiResult } from '@/types/api';

interface ApiContextValue {
  httpClient: HttpClient;
  // Helpers podem ser adicionados aqui no futuro
}

const ApiContext = createContext<ApiContextValue | undefined>(undefined);

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within ApiProvider');
  }
  return context;
}

interface ApiProviderProps {
  children: ReactNode;
}

export function ApiProvider({ children }: ApiProviderProps) {
  const httpClient = getHttpClient();

  const value: ApiContextValue = {
    httpClient,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}
