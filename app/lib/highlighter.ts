import { createHighlighter } from 'shiki';

export const highlighter = await createHighlighter({
  themes: ['nord', 'github-dark', 'github-light'],
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
