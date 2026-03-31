import Colors from './Colors';

export type ThemeMode = 'dark' | 'light';

export interface Theme {
  mode: ThemeMode;
  // Backgrounds
  bg: string;
  bgCard: string;
  bgSurface: string;
  // Text
  text: string;
  textSub: string;
  textMuted: string;
  // Borders
  border: string;
  // Navigation
  tabBar: string;
  tabBarInactive: string;
  header: string;
  headerText: string;
  // Input
  inputBg: string;
  inputText: string;
  inputPlaceholder: string;
  inputBorder: string;
  // Status bar
  statusBar: 'light' | 'dark';
}

export const darkTheme: Theme = {
  mode: 'dark',
  bg: Colors.dark,
  bgCard: Colors.primary,
  bgSurface: Colors.secondary + '55',
  text: '#ffffff',
  textSub: 'rgba(255,255,255,0.55)',
  textMuted: 'rgba(255,255,255,0.4)',
  border: Colors.secondary,
  tabBar: Colors.secondary,
  tabBarInactive: '#888888',
  header: Colors.primary,
  headerText: '#ffffff',
  inputBg: Colors.primary,
  inputText: '#ffffff',
  inputPlaceholder: 'rgba(255,255,255,0.3)',
  inputBorder: Colors.gold + '66',
  statusBar: 'light',
};

export const lightTheme: Theme = {
  mode: 'light',
  bg: '#f5f6f8',
  bgCard: '#ffffff',
  bgSurface: '#f0f2f5',
  text: Colors.primary,
  textSub: 'rgba(2,16,27,0.6)',
  textMuted: 'rgba(2,16,27,0.4)',
  border: '#e4e7ec',
  tabBar: '#ffffff',
  tabBarInactive: '#94a3b8',
  header: '#ffffff',
  headerText: Colors.primary,
  inputBg: '#f9f9f9',
  inputText: Colors.primary,
  inputPlaceholder: 'rgba(2,16,27,0.35)',
  inputBorder: Colors.gold + '66',
  statusBar: 'dark',
};
