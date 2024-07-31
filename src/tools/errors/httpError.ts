export class HttpError extends Error {
  message: string;
  statusCode: number;
  name: string;
  code: string;

  constructor(message: string, statusCode: number, name: string) {
    super();

    this.message = message;
    this.statusCode = statusCode;
    this.name = name;
    this.code = name.toUpperCase();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const isHttpError = (e: unknown): e is HttpError =>
  e instanceof HttpError;
