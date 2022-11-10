import { AuthorizedRequest } from 'src/utils/types';

export function getUserId(req: AuthorizedRequest): string {
  return req.user.userId;
}
