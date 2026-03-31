import { useSelector } from 'react-redux';
import { darkTheme, lightTheme, Theme } from '../constants/Theme';

export function useTheme(): Theme {
  const themeMode = useSelector(
    (state: any) => (state.settings?.theme ?? 'dark') as 'dark' | 'light'
  );
  return themeMode === 'light' ? lightTheme : darkTheme;
}
