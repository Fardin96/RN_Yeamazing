import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import travelLogReducer from '../slices/travelLogSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    travelLogs: travelLogReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
