import type { User } from '@prisma/client';
import { useFetcher } from '@remix-run/react';
import { useEffect, useState } from 'react';

export const useAuthUser = () => {
  const fetcher = useFetcher();
  const [user, setUser] = useState<Omit<User, 'password'> | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetcher.load('/resources/auth');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // NOTE: fetcher.loadは非同期性のため、データ取得後の処理を別途書く必要がある。
  useEffect(() => {
    if (fetcher.data || fetcher.data === null) {
      setUser(fetcher.data as Omit<User, 'password'>);
      setIsLoading(false);
    }
  }, [fetcher.data]);

  return { user, isLoading };
};
