import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {SignInResult} from '../../types/userData';
import {
  setLocalData,
  clearAllLocalData,
  getLocalData,
} from '../../utils/functions/cachingFunctions';
import {
  AUTH_TOKEN,
  USER_EMAIL,
  USER_ID,
  USER_IMG,
  USER_NAME,
} from '../../assets/constants';
import {addUser} from '../../utils/functions/firestoreFunctions';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

interface UserState {
  isAuthenticated: boolean;
  userId: string | null;
  name: string | null;
  email: string | null;
  photoUrl: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  userId: null,
  name: null,
  email: null,
  photoUrl: null,
  loading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'user/login',
  async (_, {rejectWithValue}) => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const signInResult: SignInResult = await GoogleSignin.signIn();

      if (!signInResult.data || !signInResult.data.idToken) {
        throw new Error('No valid sign-in data received');
      }

      // Store user data in AsyncStorage
      await setLocalData(AUTH_TOKEN, signInResult.data.idToken);
      await setLocalData(USER_IMG, signInResult.data.user.photo || '');
      await setLocalData(USER_NAME, signInResult.data.user.name || '');
      await setLocalData(USER_ID, signInResult.data.user.id || '');
      await setLocalData(USER_EMAIL, signInResult.data.user.email || '');

      // Store user in Firestore
      await addUser(
        signInResult.data.idToken,
        signInResult.data.user.id || '',
        signInResult.data.user.name || '',
        signInResult.data.user.email || '',
        signInResult.data.user.photo || '',
      );

      return {
        userId: signInResult.data.user.id,
        name: signInResult.data.user.name,
        email: signInResult.data.user.email,
        photoUrl: signInResult.data.user.photo,
      };
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  },
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await GoogleSignin.signOut();
  await clearAllLocalData();
  return true;
});

export const checkAuthStatus = createAsyncThunk(
  'user/checkAuth',
  async (_, {rejectWithValue}) => {
    try {
      const userId = await getLocalData(USER_ID);
      const name = await getLocalData(USER_NAME);
      const email = await getLocalData(USER_EMAIL);
      const photoUrl = await getLocalData(USER_IMG);

      if (userId) {
        return {
          userId,
          name,
          email,
          photoUrl,
        };
      }
      return null;
    } catch (error) {
      console.error('Check auth error:', error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to check authentication status');
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Login
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.userId = action.payload.userId || null;
        state.name = action.payload.name || null;
        state.email = action.payload.email || null;
        state.photoUrl = action.payload.photoUrl || null;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logoutUser.fulfilled, state => {
        Object.assign(state, initialState);
      })

      // Check Auth
      .addCase(checkAuthStatus.pending, state => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true;
          state.userId = action.payload.userId;
          state.name = action.payload.name;
          state.email = action.payload.email;
          state.photoUrl = action.payload.photoUrl;
        } else {
          state.isAuthenticated = false;
        }
        state.loading = false;
      })
      .addCase(checkAuthStatus.rejected, state => {
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export default userSlice.reducer;
