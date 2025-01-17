import { ClientError, GraphQLResponse } from 'graphql-request';
import { describe, expect, test, vi } from 'vitest';
import { initializeClient } from '~/lib/graphql-client';
import { GetPostArgs, PostStatus } from '~/lib/graphql/@generated/graphql';
import { getPost } from './get-post';

// モック用の依存関係
vi.mock('~/lib/graphql-client', () => ({
  initializeClient: vi.fn(),
}));

describe('getPost', () => {
  const mockArgs: GetPostArgs = { id: '1' };
  const mockRequest = new Request('http://localhost');
  const mockPost = {
    id: '1',
    emoji: '😊',
    title: 'Test Post',
    status: PostStatus.Draft,
    content: 'This is a test post.',
    tags: [
      {
        tag: {
          id: '1',
          name: 'Test Tag',
          image: 'http://example.com/tag.png',
        },
      },
    ],
  };

  test('投稿データを含む成功レスポンスを返すこと', async () => {
    // モックしたクライアントの作成
    const mockSuccessResponse = { post: mockPost };
    const mockClient = {
      request: vi.fn().mockResolvedValue(mockSuccessResponse),
    };

    // initializeClientをモック
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(initializeClient).mockResolvedValue(mockClient as any);

    // テスト実行
    const result = await getPost(mockArgs, mockRequest);

    // 検証
    expect(result.success).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data).toEqual(mockSuccessResponse.post);

    // クライアントのrequestメソッドが正しく呼び出されたことを確認
    expect(mockClient.request).toHaveBeenCalledWith(
      expect.anything(), // getPostGqlが渡されることを確認
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
    const result = await getPost(mockArgs, mockRequest);

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
    const result = await getPost(mockArgs, mockRequest);

    // 検証
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe('Unknown Error');
    expect(result.error?.code).toBe('UnknownError');
  });
});
