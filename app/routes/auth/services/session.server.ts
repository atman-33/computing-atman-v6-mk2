import { createCookieSessionStorage } from '@remix-run/node';
import { env } from '~/config/env';

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [env.SESSION_SECRET || ''],
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
