import { CustomError } from './custom-errors';

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Unauthorized');

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Unauthorized' }];
  }
  createErrors(): { message: string; field?: string | undefined }[] {
    throw new Error('Unauthorized');
  }
}
