import * as React from 'react';
import { TabsList, TabsTrigger } from '../ui/tabs';

interface SimpleTabsListProps {
  children: React.ReactNode;
  className?: string;
}

const SimpleTabsList = ({ children, className }: SimpleTabsListProps) => {
  return <TabsList className={`bg-transparent ${className}`}>{children}</TabsList>;
};

interface SimpleTabsProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

const SimpleTabsTrigger = ({ children, value, className }: SimpleTabsProps) => {
  return (
    <TabsTrigger
      value={value}
      className={`rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-foreground ${className}`}
    >
      {children}
    </TabsTrigger>
  );
};

export { SimpleTabsList, SimpleTabsTrigger };
