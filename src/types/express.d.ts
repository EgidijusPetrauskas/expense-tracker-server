import { UserDocument } from '../models/user-model';

declare global {
  declare namespace Express {
    export interface Request {
      tokenData?: {
        username: string,
      },
      authUserDoc?: UserDocument
    }
  }

}
export { };
