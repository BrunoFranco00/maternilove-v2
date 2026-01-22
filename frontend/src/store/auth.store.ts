import { create } from 'zustand';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { SessionDto } from '@/types/dto/session.dto';
import { UserRole } from '@/lib/auth/roles';

interface AuthState {
  session: SessionDto | null;
  role: UserRole | null;
  isLoading: boolean;
  error: string | null;
  loadSession: () => Promise<void>;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  role: null,
  isLoading: false,
  error: null,

  loadSession: async () => {
    set({ isLoading: true, error: null });
    try {
      const session = await apiClient.get<SessionDto>(API_ENDPOINTS.AUTH.SESSION);
      set({
        session,
        role: session.user.role as UserRole,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar sessão';
      set({
        session: null,
        role: null,
        isLoading: false,
        error: message,
      });
    }
  },

  clearSession: () => {
    set({
      session: null,
      role: null,
      error: null,
    });
  },
}));
