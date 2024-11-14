import { Form } from '@remix-run/react';
import { FaMoon, FaSun } from 'react-icons/fa';

// TODO: useFetcherを用いて、バケツリレーを無くせないか要検討

const ToggleThemeButton = ({ theme }: { theme: string }) => {
  const themeToToggleTo = theme === 'dark' ? 'light' : 'dark';

  return (
    <Form action="/preferences/theme" method="POST" className="flex items-center">
      <input type="hidden" name="theme" value={themeToToggleTo} />
      {theme === 'dark' ? (
        <button>
          <FaSun className="h-6 w-6" />
        </button>
      ) : (
        <button>
          <FaMoon className="h-6 w-6" />
        </button>
      )}
    </Form>
  );
};

export default ToggleThemeButton;
