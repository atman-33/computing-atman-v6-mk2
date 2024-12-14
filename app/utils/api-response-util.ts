import { ApiResponse } from '~/types/api-response';

const createSuccessResponse = <T>(status: number, data: T): ApiResponse<T> => {
  return {
    success: true,
    status,
    data,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createErrorResponse = <T>(message: string, code?: string, details?: any): ApiResponse<T> => {
  return {
    success: false,
    status: 400,
    error: {
      message,
      code,
      details,
    },
  };
};

export { createErrorResponse, createSuccessResponse };
