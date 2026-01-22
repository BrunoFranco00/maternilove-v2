export interface CheckInRequestDto {
  emotions: string[];
  notes?: string;
  mood?: string;
}

export interface CheckInResponseDto {
  id: string;
  userId: string;
  emotions: string[];
  notes?: string;
  mood?: string;
  createdAt: string;
}
