import { ClientError } from 'graphql-request';

interface OriginalError {
  message: string;
}

const getOriginalErrorMessage = (error: ClientError): string | null => {
  if (error instanceof ClientError) {
    const originalError = error.response?.errors?.[0]?.extensions?.originalError as
      | OriginalError
      | undefined;

    if (originalError?.message) {
      return originalError.message;
    }
  }
  return null;
};

export { getOriginalErrorMessage };
