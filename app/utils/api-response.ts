interface ApiResponse<T> {
  /** 操作の成功/失敗を示すフラグ */
  success: boolean;
  /** HTTPステータスコード */
  status?: number;
  /** 成功時のデータ (オプショナル) */
  data?: T;
  /** エラー情報 */
  error?: {
    /** エラーメッセージ */
    message: string;
    /** エラーコード */
    code?: string | number;
    /** 追加のエラー詳細情報 */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: any;
  };
}

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
export type { ApiResponse };
