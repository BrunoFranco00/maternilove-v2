export type MoodType =
  | 'HAPPY'
  | 'CALM'
  | 'TIRED'
  | 'ANXIOUS'
  | 'SAD'
  | 'OVERWHELMED';

export interface CheckInRequestDto {
  mood: MoodType;
  note?: string;
}

export interface CheckInResponseDto {
  id: string;
  userId: string;
  mood: MoodType;
  note?: string;
  createdAt: string;
}
