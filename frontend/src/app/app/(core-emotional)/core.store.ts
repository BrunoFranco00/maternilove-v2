import { create } from 'zustand';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { CheckInRequestDto, CheckInResponseDto } from '@/types/dto/checkin.dto';
import { generateCheckinResponse } from '@/modules/checkin/CheckinResponseEngine';
import { saveCheckinResponseForRelief } from '@/lib/checkin/checkinResponseStorage';
import { mockMaternalContext } from '@/modules/feed/mock/maternalContext.mock';

interface CoreState {
  checkIn: (data: CheckInRequestDto) => Promise<CheckInResponseDto | null>;
  getLatestCheckIn: () => Promise<CheckInResponseDto | null>;
  getCheckInHistory: () => Promise<CheckInResponseDto[]>;
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
      const week = mockMaternalContext.gestationalWeek ?? 24;
      const phase = mockMaternalContext.mode;
      const engineOutput = generateCheckinResponse({
        weekNumber: week,
        mood: data.mood,
        phase,
        riskFlags: mockMaternalContext.riskFlags as string[],
      });
      saveCheckinResponseForRelief({ ...engineOutput, mood: data.mood });
      set({ isLoading: false });
      return response;
    } catch (err: unknown) {
      set({ isLoading: false, error: null });
      const status = (err as { status?: number })?.status;
      if (status === 401) throw err;
      return null;
    }
  },

  getLatestCheckIn: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<CheckInResponseDto>(
        API_ENDPOINTS.CORE.CHECKIN_LATEST
      );
      set({ isLoading: false });
      return response;
    } catch {
      set({ isLoading: false, error: null });
      return null;
    }
  },

  getCheckInHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<CheckInResponseDto[]>(
        API_ENDPOINTS.CORE.CHECKIN_HISTORY
      );
      set({ isLoading: false });
      return response ?? [];
    } catch {
      set({ isLoading: false, error: null });
      return [];
    }
  },
}));
