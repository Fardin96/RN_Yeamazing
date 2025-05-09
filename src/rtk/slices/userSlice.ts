import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {UserState} from '../../types/userData';
import {signUp} from '../../utils/functions/auth/authFunctions';

const initialState: UserState = {
  isAuthenticated: false,
  userId: null,
  name: null,
  email: null,
  photoUrl: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (_, {rejectWithValue}) => {
    try {
      const signInResult = await signUp();

      return {
        userId: signInResult.data?.user.id,
        name: signInResult.data?.user.name,
        email: signInResult.data?.user.email,
        photoUrl: signInResult.data?.user.photo,
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

/*
  using signOut() from authFunctions.ts
*/
// export const logoutUser = createAsyncThunk('user/logout', async () => {
//   await GoogleSignin.signOut();
//   await clearAllLocalData();

//   return true;
// });

/*
  using isAuthenticated() from authFunctions.ts
*/
// export const checkAuthStatus = createAsyncThunk(
//   'user/checkAuth',
//   async (_, {rejectWithValue}) => {
//     try {
//       const userId = await getLocalData(USER_ID);
//       const name = await getLocalData(USER_NAME);
//       const email = await getLocalData(USER_EMAIL);
//       const photoUrl = await getLocalData(USER_IMG);

//       if (userId) {
//         return {
//           userId,
//           name,
//           email,
//           photoUrl,
//         };
//       }
//       return null;
//     } catch (error) {
//       console.error('Check auth error:', error);
//       if (error instanceof Error) {
//         return rejectWithValue(error.message);
//       }
//       return rejectWithValue('Failed to check authentication status');
//     }
//   },
// );

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
      });

    // Logout
    // .addCase(logoutUser.fulfilled, state => {
    //   Object.assign(state, initialState);
    // })

    // Check Auth
    // .addCase(checkAuthStatus.pending, state => {
    //   state.loading = true;
    // })
    // .addCase(checkAuthStatus.fulfilled, (state, action) => {
    //   if (action.payload) {
    //     state.isAuthenticated = true;
    //     state.userId = action.payload.userId;
    //     state.name = action.payload.name;
    //     state.email = action.payload.email;
    //     state.photoUrl = action.payload.photoUrl;
    //   } else {
    //     state.isAuthenticated = false;
    //   }
    //   state.loading = false;
    // })
    // .addCase(checkAuthStatus.rejected, state => {
    //   state.isAuthenticated = false;
    //   state.loading = false;
    // });
  },
});

export default userSlice.reducer;
