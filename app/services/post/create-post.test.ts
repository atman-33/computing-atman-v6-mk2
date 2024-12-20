import { ClientError, GraphQLResponse } from 'graphql-request';
import { describe, expect, it, vi } from 'vitest';
import { initializeClient } from '~/lib/graphql-client';
import { CreatePostInput, PostStatus } from '~/lib/graphql/@generated/graphql';
import { createPost } from './create-post';

// モック用の依存関係
vi.mock('~/lib/graphql-client', () => ({
  initializeClient: vi.fn(),
}));

describe('createPost', () => {
  const mockInput: CreatePostInput = {
    title: 'Test Post',
    content: 'Test Content',
    emoji: '🚀',
    status: PostStatus.Draft,
  };

  it('should successfully create a post', async () => {
    // モックしたクライアントの作成
    const mockSuccessResponse = {
      createPost: {
        id: '123',
        title: 'Test Post',
        emoji: '🚀',
        content: 'Test Content',
        status: PostStatus.Draft,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    };
    const mockClient = {
      request: vi.fn().mockResolvedValue(mockSuccessResponse),
    };

    // initializeClientをモック
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(initializeClient).mockResolvedValue(mockClient as any);

    // テスト実行
    const result = await createPost(mockInput);

    // 検証
    expect(result.success).toBe(true);
    expect(result.status).toBe(201);
    expect(result.data).toEqual(mockSuccessResponse.createPost);

    // クライアントのrequestメソッドが正しく呼び出されたことを確認
    expect(mockClient.request).toHaveBeenCalledWith(
      expect.anything(), // createPostGqlが渡されることを確認
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
              message: 'ClientrError mock',
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
    const result = await createPost(mockInput);

    // 検証
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe('ClientrError mock');
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
    const result = await createPost(mockInput);

    // 検証
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe('Unknown Error');
    expect(result.error?.code).toBe('UnknownError');
  });
});
