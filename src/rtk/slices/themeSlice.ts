import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  colors: {
    BG_PRIMARY: string;
    BG_SECONDARY: string;
    TEXT_PRIMARY: string;
    TEXT_SECONDARY: string;
    // Add more colors as needed
  };
}

const darkColors = {
  BG_PRIMARY: '#121212',
  BG_SECONDARY: '#333',
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#999',
};

const lightColors = {
  BG_PRIMARY: '#f5f5f5',
  BG_SECONDARY: '#ffffff',
  TEXT_PRIMARY: '#121212',
  TEXT_SECONDARY: '#666',
};

const initialState: ThemeState = {
  mode: 'dark',
  colors: darkColors,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      state.colors = action.payload === 'light' ? lightColors : darkColors;
      // Note: For 'system' mode, you'd need to check system preference
      // in a middleware or at the component level
    },
  },
});

export const {setThemeMode} = themeSlice.actions;
export default themeSlice.reducer;
