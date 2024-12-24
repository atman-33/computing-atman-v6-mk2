import { ClientError, GraphQLResponse } from 'graphql-request';
import { describe, expect, test, vi } from 'vitest';
import { initializeClient } from '~/lib/graphql-client';
import { GetPostsByUserArgs, PostStatus } from '~/lib/graphql/@generated/graphql';
import { getPostsByUser } from './get-posts-by-user';

// モック用の依存関係
vi.mock('~/lib/graphql-client', () => ({
  initializeClient: vi.fn(),
}));

describe('getPostsByUser', () => {
  const mockArgs: GetPostsByUserArgs = { userId: '1' };
  const mockRequest = new Request('http://localhost');
  const mockPosts = {
    edges: [
      {
        node: {
          id: '1',
          emoji: '😊',
          title: 'Test Post 1',
          status: PostStatus.Draft,
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
      },
      {
        node: {
          id: '2',
          emoji: '😎',
          title: 'Test Post 2',
          status: PostStatus.Public,
          tags: [
            {
              tag: {
                id: '2',
                name: 'Another Tag',
                image: 'http://example.com/another-tag.png',
              },
            },
          ],
          createdAt: '2023-01-02T00:00:00Z',
          updatedAt: '2023-01-02T00:00:00Z',
        },
      },
    ],
    totalCount: 2,
  };

  test('投稿データを含む成功レスポンスを返すこと', async () => {
    // モックしたクライアントの作成
    const mockSuccessResponse = { postsByUser: mockPosts };
    const mockClient = {
      request: vi.fn().mockResolvedValue(mockSuccessResponse),
    };

    // initializeClientをモック
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(initializeClient).mockResolvedValue(mockClient as any);

    // テスト実行
    const result = await getPostsByUser(mockArgs, mockRequest);

    // 検証
    expect(result.success).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data).toEqual(mockSuccessResponse.postsByUser);

    // クライアントのrequestメソッドが正しく呼び出されたことを確認
    expect(mockClient.request).toHaveBeenCalledWith(
      expect.anything(), // getPostsByUserGqlが渡されることを確認
      { args: mockArgs },
    );
  });

  test('ClientErrorが発生した場合、エラーレスポンスを返すこと', async () => {
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
    const result = await getPostsByUser(mockArgs, mockRequest);

    // 検証
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe('ClientError mock');
    expect(result.error?.code).toBe('ClientError');
  });

  test('未知のエラーが発生した場合、エラーレスポンスを返すこと', async () => {
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
    const result = await getPostsByUser(mockArgs, mockRequest);

    // 検証
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe('Unknown Error');
    expect(result.error?.code).toBe('UnknownError');
  });
});
