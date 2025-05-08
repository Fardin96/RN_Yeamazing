import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {TravelLog} from '../../types/travelLog';
import {
  addTravelLog as addTravelLogToFirestore,
  fetchTravelLogs as fetchTravelLogsFromFirestore,
} from '../../utils/functions/travelLogFunctions';

interface TravelLogState {
  logs: TravelLog[];
  loading: boolean;
  error: string | null;
  selectedLog: TravelLog | null;
}

const initialState: TravelLogState = {
  logs: [],
  loading: false,
  error: null,
  selectedLog: null,
};

export const fetchTravelLogs = createAsyncThunk(
  'travelLogs/fetchAll',
  async (_, {rejectWithValue}) => {
    try {
      const logs = await fetchTravelLogsFromFirestore();
      return logs;
    } catch (error) {
      console.error('Error fetching travel logs:', error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch travel logs');
    }
  },
);

export const addTravelLog = createAsyncThunk(
  'travelLogs/add',
  async (
    {
      imageUrl,
      location,
      dateTime,
      details,
    }: {
      imageUrl: string;
      location: string;
      dateTime: number;
      details: string;
    },
    {rejectWithValue},
  ) => {
    try {
      const logId = await addTravelLogToFirestore(
        imageUrl,
        location,
        dateTime,
        details,
      );

      if (!logId) {
        throw new Error('Failed to add travel log');
      }

      // Return the complete log object
      return {
        id: logId,
        imageUrl,
        location,
        dateTime,
        details,
        createdAt: Date.now(),
      } as TravelLog;
    } catch (error) {
      console.error('Error adding travel log:', error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to add travel log');
    }
  },
);

// export const modifyTravelLog = createAsyncThunk(
//   'travelLogs/update',
//   async (logData: TravelLog, { rejectWithValue }) => {
//     try {
//       const updatedLog = await updateTravelLog(logData);
//       return updatedLog;
//     } catch (error) {
//       return rejectWithValue('Failed to update travel log');
//     }
//   }
// );

// export const removeTravelLog = createAsyncThunk(
//   'travelLogs/delete',
//   async (logId: string, { rejectWithValue }) => {
//     try {
//       await deleteTravelLog(logId);
//       return logId;
//     } catch (error) {
//       return rejectWithValue('Failed to delete travel log');
//     }
//   }
// );

const travelLogSlice = createSlice({
  name: 'travelLogs',
  initialState,
  reducers: {
    selectLog: (state, action) => {
      state.selectedLog = action.payload;
    },
    clearSelectedLog: state => {
      state.selectedLog = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch travel logs
      .addCase(fetchTravelLogs.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTravelLogs.fulfilled, (state, action) => {
        state.logs = action.payload;
        state.loading = false;
      })
      .addCase(fetchTravelLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add travel log
      .addCase(addTravelLog.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTravelLog.fulfilled, (state, action) => {
        state.logs.unshift(action.payload as TravelLog);
        state.loading = false;
      })
      .addCase(addTravelLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    //   // Update log
    //   .addCase(modifyTravelLog.fulfilled, (state, action) => {
    //     const index = state.logs.findIndex(log => log.id === action.payload.id);
    //     if (index !== -1) {
    //       state.logs[index] = action.payload;
    //     }
    //     state.loading = false;
    //   })

    //   // Delete log
    //   .addCase(removeTravelLog.fulfilled, (state, action) => {
    //     state.logs = state.logs.filter(log => log.id !== action.payload);
    //     state.loading = false;
    //   });
  },
});

export const {selectLog, clearSelectedLog} = travelLogSlice.actions;
export default travelLogSlice.reducer;
