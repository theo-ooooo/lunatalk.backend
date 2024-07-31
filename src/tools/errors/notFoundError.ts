import { HttpError } from './httpError';

export class NotFoundError extends HttpError {
  constructor(message = 'NotFound') {
    super(message, 404, 'NotFound');
  }
}
