import { createHighlighter } from 'shiki';

export const highlighter = await createHighlighter({
  themes: ['github-dark'],
  langs: [
    'plaintext',
    'text',
    'txt',
    'csv',
    'sh',
    'shell',
    'powershell',
    'bat',
    'html',
    'xml',
    'css',
    'sql',
    'graphql',
    'javascript',
    'typescript',
    'js',
    'jsx',
    'ts',
    'tsx',
    'csharp',
    'cs',
    'vb',
  ],
});
