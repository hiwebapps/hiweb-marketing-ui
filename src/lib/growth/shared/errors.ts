export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;

  constructor(
    message: string,
    options: { statusCode?: number; code?: string } = {},
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = options.statusCode ?? 500;
    this.code = options.code ?? "INTERNAL_ERROR";
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
