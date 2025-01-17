import { ClientError, GraphQLResponse } from 'graphql-request';
import { describe, expect, it, vi } from 'vitest';
import { initializeClient } from '~/lib/graphql-client';
import { deletePost } from './delete-post';

// モック用の依存関係
vi.mock('~/lib/graphql-client', () => ({
  initializeClient: vi.fn(),
}));

describe('deletePost', () => {
  const mockInput = { id: '123' };

  it('should successfully delete a post', async () => {
    // モックしたクライアントの作成
    const mockSuccessResponse = {
      deletePost: {
        id: '123',
      },
    };
    const mockClient = {
      request: vi.fn().mockResolvedValue(mockSuccessResponse),
    };

    // initializeClientをモック
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(initializeClient).mockResolvedValue(mockClient as any);

    // テスト実行
    const result = await deletePost(mockInput);

    // 検証
    expect(result.success).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data).toEqual(mockSuccessResponse.deletePost);

    // クライアントのrequestメソッドが正しく呼び出されたことを確認
    expect(mockClient.request).toHaveBeenCalledWith(
      expect.anything(), // deletePostGqlが渡されることを確認
      { input: mockInput },
    );
  });

  it('should handle ClientError', async () => {
    // ClientErrorのモック
    const mockResponse = {
      errors: [
        {
          extensions: {
            originalError: {
              message: 'ClientError mock',
            },
          },
        },
      ],
    } as unknown as GraphQLResponse;

    const mockClientError = new ClientError(mockResponse, {
      query: '',
    });

    // モックしたクライアントの作成
    const mockClient = {
      request: vi.fn().mockRejectedValue(mockClientError),
    };

    // initializeClientをモック
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(initializeClient).mockResolvedValue(mockClient as any);

    // テスト実行
    const result = await deletePost(mockInput);

    // 検証
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe('ClientError mock');
    expect(result.error?.code).toBe('ClientError');
  });

  it('should handle unknown errors', async () => {
    // 一般的なエラーのモック
    const mockError = new Error('Unknown Error');

    // モックしたクライアントの作成
    const mockClient = {
      request: vi.fn().mockRejectedValue(mockError),
    };

    // initializeClientをモック
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(initializeClient).mockResolvedValue(mockClient as any);

    // テスト実行
    const result = await deletePost(mockInput);

    // 検証
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe('Unknown Error');
    expect(result.error?.code).toBe('UnknownError');
  });
});
