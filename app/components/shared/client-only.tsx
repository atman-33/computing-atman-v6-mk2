import * as React from 'react';
import { useSyncExternalStore } from 'react';

const subscribe = () => {
  return () => {};
};

const useHydrated = () => {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
};

interface Props {
  children(): React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Render the children only after the JS has loaded client-side. Use an optional
 * fallback component if the JS is not yet loaded.
 *
 * Example: Render a Chart component if JS loads, renders a simple FakeChart
 * component server-side or if there is no JS. The FakeChart can have only the
 * UI without the behavior or be a loading spinner or skeleton.
 * ```tsx
 * return (
 *   <ClientOnly fallback={<FakeChart />}>
 *     {() => <Chart />}
 *   </ClientOnly>
 * );
 * ```
 * @param children - A function that returns a React node to be rendered after hydration
 * @param fallback - A React node to be rendered as a fallback until hydration occurs
 * @returns A React node that is either the children or the fallback based on hydration status
 */
export const ClientOnly = ({ children, fallback = null }: Props) => {
  const isHydrated = useHydrated();

  return isHydrated ? <>{children()}</> : <>{fallback}</>;
};
