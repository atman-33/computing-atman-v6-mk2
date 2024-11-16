import { useFetcher } from '@remix-run/react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '~/components/shadcn/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/shadcn/ui/dropdown-menu';

const ThemeDropdown = () => {
  const fetcher = useFetcher();

  const handleThemeChange = (newTheme: string) => {
    fetcher.submit({ theme: newTheme }, { method: 'post', action: '/resources/theme' });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-9 px-0">
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleThemeChange('light')}>Light</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange('dark')}>Dark</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange('system')}>System</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ThemeDropdown;
