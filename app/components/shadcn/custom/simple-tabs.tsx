import * as React from 'react';
import { TabsList, TabsTrigger } from '../ui/tabs';

interface SimpleTabsListProps {
  children: React.ReactNode;
  className?: string;
}

const SimpleTabsList = ({ children, className }: SimpleTabsListProps) => {
  return <TabsList className={`bg-transparent ${className}`}>{children}</TabsList>;
};

interface SimpleTabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const SimpleTabsTrigger = ({ children, value, className, ...rest }: SimpleTabsTriggerProps) => {
  return (
    <TabsTrigger
      value={value}
      className={`rounded-none data-[state=active]:border-b-2 data-[state=active]:border-b-foreground ${className}`}
      {...rest}
    >
      {children}
    </TabsTrigger>
  );
};

export { SimpleTabsList, SimpleTabsTrigger };
