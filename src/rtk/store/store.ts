import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import travelLogReducer from '../slices/travelLogSlice';
import chatReducer from '../slices/chatSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    travelLogs: travelLogReducer,
    chats: chatReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
