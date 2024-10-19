import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import RelayPlugin from '@pothos/plugin-relay';
import { Prisma } from '@prisma/client';
import { DateTimeResolver } from 'graphql-scalars';
import { prisma } from '~/lib/prisma';
// eslint-disable-next-line import/no-named-as-default
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
// eslint-disable-next-line import/no-named-as-default
import PothosSimpleObjectsPlugin from '@pothos/plugin-simple-objects';
import { Context } from './context';

export const builder = new SchemaBuilder<{
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
  // NOTE: 権限設定
  AuthScopes: {
    loggedIn: boolean;
  };
  Connection: {
    totalCount: number | (() => number | Promise<number>);
  };
  PrismaTypes: PrismaTypes;
  // NOTE: ログインユーザー情報のコンテキスト
  Context: Context;
}>({
  plugins: [ScopeAuthPlugin, PrismaPlugin, RelayPlugin, PothosSimpleObjectsPlugin],
  scopeAuth: {
    authorizeOnSubscribe: true,
    authScopes: async (ctx) => ({
      loggedIn: !!ctx.user,
    }),
  },
  relay: {},
  prisma: {
    client: prisma,
    dmmf: Prisma.dmmf,
  },
});

builder.queryType();
builder.mutationType();

builder.addScalarType('DateTime', DateTimeResolver, {});
