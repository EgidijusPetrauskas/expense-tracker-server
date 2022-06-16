import { UserDocument } from '../models/user-model';

declare global {
  declare namespace Express {
    export interface Request {
      tokenData?: {
        username: string,
        token: string
      },
      authUserDoc?: UserDocument
    }
  }

}
export { };
