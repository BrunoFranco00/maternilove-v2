import { create } from 'zustand';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { CheckInRequestDto, CheckInResponseDto } from '@/types/dto/checkin.dto';
import { ReliefResponseDto } from '@/types/dto/relief.dto';

interface CoreState {
  checkIn: (data: CheckInRequestDto) => Promise<CheckInResponseDto | null>;
  getRelief: (id: string) => Promise<ReliefResponseDto | null>;
  isLoading: boolean;
  error: string | null;
}

export const useCoreStore = create<CoreState>((set) => ({
  isLoading: false,
  error: null,

  checkIn: async (data: CheckInRequestDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<CheckInResponseDto>(
        API_ENDPOINTS.CORE.CHECK_IN,
        data
      );
      set({ isLoading: false });
      return response;
    } catch {
      set({ isLoading: false, error: null });
      return null;
    }
  },

  getRelief: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<ReliefResponseDto>(
        API_ENDPOINTS.CORE.RELIEF(id)
      );
      set({ isLoading: false });
      return response;
    } catch {
      set({ isLoading: false, error: null });
      return null;
    }
  },
}));
