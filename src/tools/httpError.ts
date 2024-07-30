export class HttpError extends Error {
  message: string;
  statusCode: number;
  name: string;

  constructor(message: string, statusCode: number, name: string) {
    super();

    this.message = message;
    this.statusCode = statusCode;
    this.name = name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const isHttpError = (e: unknown): e is HttpError =>
  e instanceof HttpError;
