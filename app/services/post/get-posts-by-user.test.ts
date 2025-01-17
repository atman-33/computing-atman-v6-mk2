import { ClientError, GraphQLResponse } from 'graphql-request';
import { describe, expect, it, vi } from 'vitest';
import { initializeClient } from '~/lib/graphql-client';
import { getPostsByUser } from './get-posts-by-user';

// モック用の依存関係
vi.mock('~/lib/graphql-client', () => ({
  initializeClient: vi.fn(),
}));

describe('getPostsByUser', () => {
  const mockArgs = { userId: '1' };

  it('should successfully get posts by user', async () => {
    // モックしたクライアントの作成
    const mockSuccessResponse = {
      postsByUser: {
        edges: [
          {
            node: {
              id: '1',
              emoji: '😊',
              title: 'Test Post 1',
              status: 'DRAFT',
              tags: [
                {
                  tag: {
                    id: '1',
                    name: 'Test Tag',
                    image: 'http://example.com/tag.png',
                  },
                },
              ],
              createdAt: '2023-01-01T00:00:00Z',
              updatedAt: '2023-01-01T00:00:00Z',
            },
            cursor: 'cursor1',
          },
        ],
        pageInfo: {
          endCursor: 'cursor1',
          hasNextPage: false,
        },
        totalCount: 1,
      },
    };
    const mockClient = {
      request: vi.fn().mockResolvedValue(mockSuccessResponse),
    };

    // initializeClientをモック
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(initializeClient).mockResolvedValue(mockClient as any);

    // テスト実行
    const result = await getPostsByUser(mockArgs, 1);

    // 検証
    expect(result.success).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data).toEqual(mockSuccessResponse.postsByUser);

    // クライアントのrequestメソッドが正しく呼び出されたことを確認
    expect(mockClient.request).toHaveBeenCalledWith(
      expect.anything(), // クエリ部分を無視
      { args: mockArgs, first: 1, after: undefined },
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
    const result = await getPostsByUser(mockArgs, 1);

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
    const result = await getPostsByUser(mockArgs, 1);

    // 検証
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe('Unknown Error');
    expect(result.error?.code).toBe('UnknownError');
  });
});
