import type { User } from '@prisma/client';
import { useFetcher } from '@remix-run/react';
import { useEffect, useState } from 'react';

export const useAuthUser = () => {
  const fetcher = useFetcher();
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // console.log('fetcher.load');
    // 初回データ取得
    fetcher.load('/resources/auth');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // fetcher の状態を監視
    if (fetcher.state === 'idle' && fetcher.data !== undefined) {
      if (fetcher.data) {
        setUser(fetcher.data as Omit<User, 'password'>);
        setHasError(false);
      } else {
        setUser(null);
        setHasError(true);
      }
      setIsLoading(false);
    }
  }, [fetcher.state, fetcher.data]);

  return { user, isLoading, hasError };
};
