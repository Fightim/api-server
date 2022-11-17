import { UserResponseDto } from 'src/users/dto';
import { User } from 'src/users/schemas/user.schema';
import { AuthorizedRequest } from 'src/utils/types';

export function getUserId(req: AuthorizedRequest): string {
  return req.user.userId;
}

export function getUserResponseDto(user: User): UserResponseDto {
  return { email: user.email };
}
