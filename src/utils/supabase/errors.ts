export class SupabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'SupabaseError';
  }
}

export function handleSupabaseError(error: any): SupabaseError {
  if (error instanceof SupabaseError) return error;

  const message = error.message || 'An unknown error occurred';
  const code = error.code || 'UNKNOWN';
  
  return new SupabaseError(message, code, error);
}