import { useFetcher } from '@remix-run/react';
import { useState } from 'react';

export const useLogout = () => {
  const fetcher = useFetcher();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await fetcher.submit(null, {
        method: 'post',
        action: '/resources/auth/logout',
      });
    } catch (err) {
      setError('ログアウトに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading, error };
};
