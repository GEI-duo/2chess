import { createContext } from 'react';

export type ThemeContextType = {
  switchColorMode: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  switchColorMode: () => {},
});
