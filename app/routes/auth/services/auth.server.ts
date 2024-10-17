import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Authenticator, AuthorizationError } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { GoogleStrategy } from 'remix-auth-google';
import { env } from '~/config/env';
import { prisma } from '~/lib/prisma';
import { sessionStorage } from './session.server';

const SESSION_SECRET = env.SESSION_SECRET;

if (!SESSION_SECRET) {
  throw new Error('SESSION_SECRET is not defined');
}

const authenticator = new Authenticator<Omit<User, 'password'>>(sessionStorage);

// ---- FormStrategy ---- //
const formStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get('email');
  const password = form.get('password');

  if (!(email && password)) {
    throw new Error('Invalid Request');
  }

  const user = await prisma.user.findUnique({ where: { email: String(email) } });

  if (!user) {
    console.log(`${email} ユーザーが存在しません`);
    throw new AuthorizationError(`${email} ユーザーが存在しません`);
  }

  const passwordsMatch = await bcrypt.compare(String(password), user.password);

  if (!passwordsMatch) {
    console.log(`パスワードが一致しません`);
    throw new AuthorizationError(`パスワードが一致しません`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
});

// NOTE: フォームストラテジーには「user-pass」の名称を設定
authenticator.use(formStrategy, 'user-pass');

// ---- GoogleStrategy ---- //
if (!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.CLIENT_URL)) {
  throw new Error('GOOGLE_CLIENT_ID、GOOGLE_CLIENT_SECRET、CLIENT_URLが設定されていません。');
}

const googleStrategy = new GoogleStrategy<User>(
  {
    clientID: env.GOOGLE_CLIENT_ID || '',
    clientSecret: env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: `${env.CLIENT_URL}/api/auth/google/callback`,
  },
  async ({ profile }) => {
    const user = await prisma.user.findUnique({
      where: { email: profile.emails[0].value },
    });

    if (user) {
      return user;
    }

    const newUser = await prisma.user.create({
      data: {
        id: profile.id,
        email: profile.emails[0].value || '',
        password: '',
        name: profile.displayName,
        image: profile.photos[0].value || '',
        provider: 'google',
      },
    });
    return newUser;
  },
);

authenticator.use(googleStrategy); // name: 'google'

export { authenticator };
