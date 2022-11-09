export type AuthorizedRequest = Express.Request & { user: { userId: string } };
