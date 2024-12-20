import { ClientError, GraphQLResponse } from 'graphql-request';
import { describe, expect, test, vi } from 'vitest';
import { initializeClient } from '~/lib/graphql-client';
import { PostStatus, UpdatePostInput } from '~/lib/graphql/@generated/graphql';
import { updatePost } from './update-post';

// mock用の依存関係
vi.mock('~/lib/graphql-client', () => ({
  initializeClient: vi.fn(),
}));

describe('updatePost', () => {
  // 共通処理
  const mockInput: UpdatePostInput = {
    id: '123',
    title: 'Test Post',
    content: 'Test Content',
    emoji: '🚀',
    status: PostStatus.Draft,
  };

  test('Postを正しく更新できること', async () => {
    // Arrange
    const mockSuccessResponse = {
      updatePost: {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(initializeClient).mockResolvedValue(mockClient as any);

    // Act
    const result = await updatePost(mockInput);

    // Assert
    expect(result.success).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data).toEqual(mockSuccessResponse.updatePost);
    expect(mockClient.request).toHaveBeenCalledWith(expect.anything(), { input: mockInput });
  });

  test('ClientErrorをハンドリングできること', async () => {
    // Arrange
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

    const mockClient = {
      request: vi.fn().mockRejectedValue(mockClientError),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(initializeClient).mockResolvedValue(mockClient as any);

    // Act
    const result = await updatePost(mockInput);

    // Assert
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe('ClientrError mock');
    expect(result.error?.code).toBe('ClientError');
  });

  test('UnknownErrorをハンドリングできること', async () => {
    // Arrange
    const mockError = new Error('Unknown Error');
    const mockClient = {
      request: vi.fn().mockRejectedValue(mockError),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(initializeClient).mockResolvedValue(mockClient as any);

    // Act
    const result = await updatePost(mockInput);

    // Assert
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe('Unknown Error');
    expect(result.error?.code).toBe('UnknownError');
  });
});
