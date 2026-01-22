import { UserDto } from './user.dto';

export interface SessionDto {
  user: UserDto;
  expiresAt: string;
}
