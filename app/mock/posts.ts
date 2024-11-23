export const mockPosts = [
  {
    id: 'post-1',
    title: 'テスト記事1',
    emoji: '🚀',
    content: `
    # テスト記事1
    テスト記事です...
    `,
    tags: [
      {
        id: 'post-tag-1',
        name: 'タグA',
      },
      {
        id: 'post-tag-2',
        name: 'タグB',
      },
    ],
    status: 'PUBLIC',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'post-2',
    title:
      'テスト記事2 xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx',
    emoji: '🚀',
    content: `
    # テスト記事2
    テスト記事です...
    `,
    tags: [
      {
        id: 'post-tag-1',
        name: 'タグA',
      },
      {
        id: 'post-tag-2',
        name: 'タグB',
      },
    ],
    status: 'PUBLIC',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
