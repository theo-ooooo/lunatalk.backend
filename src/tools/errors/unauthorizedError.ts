import { HttpError } from './httpError';

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'unauthorized');
  }
}
