import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define the type for team member data
interface TeamMember {
  id: string;
  name: string;
  position: string;
  image_url: string;
  social_links?: {
    linkedin?: string;
    github?: string;
    instagram?: string;
    twitter?: string;
  };
}

interface TeamState {
  core: {
    data: TeamMember[];
    loading: boolean;
    error: string | null;
  };
  gb: {
    data: TeamMember[];
    loading: boolean;
    error: string | null;
  };
  execom: {
    data: TeamMember[];
    loading: boolean;
    error: string | null;
  };
}

const initialState: TeamState = {
  core: {
    data: [],
    loading: false,
    error: null
  },
  gb: {
    data: [],
    loading: false,
    error: null
  },
  execom: {
    data: [],
    loading: false,
    error: null
  }
};

// Create async thunks for fetching team data
export const fetchCoreTeam = createAsyncThunk(
  'team/fetchCore',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/team/core');
      if (!response.ok) throw new Error('Failed to fetch core team data');
      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchGBTeam = createAsyncThunk(
  'team/fetchGB',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/team/gb');
      if (!response.ok) throw new Error('Failed to fetch GB team data');
      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchExecomTeam = createAsyncThunk(
  'team/fetchExecom',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/team/execom');
      if (!response.ok) throw new Error('Failed to fetch execom team data');
      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Core team
    builder
      .addCase(fetchCoreTeam.pending, (state) => {
        state.core.loading = true;
        state.core.error = null;
      })
      .addCase(fetchCoreTeam.fulfilled, (state, action) => {
        state.core.loading = false;
        state.core.data = action.payload;
      })
      .addCase(fetchCoreTeam.rejected, (state, action) => {
        state.core.loading = false;
        state.core.error = action.payload as string;
      })
      // GB team
      .addCase(fetchGBTeam.pending, (state) => {
        state.gb.loading = true;
        state.gb.error = null;
      })
      .addCase(fetchGBTeam.fulfilled, (state, action) => {
        state.gb.loading = false;
        state.gb.data = action.payload;
      })
      .addCase(fetchGBTeam.rejected, (state, action) => {
        state.gb.loading = false;
        state.gb.error = action.payload as string;
      })
      // Execom team
      .addCase(fetchExecomTeam.pending, (state) => {
        state.execom.loading = true;
        state.execom.error = null;
      })
      .addCase(fetchExecomTeam.fulfilled, (state, action) => {
        state.execom.loading = false;
        state.execom.data = action.payload;
      })
      .addCase(fetchExecomTeam.rejected, (state, action) => {
        state.execom.loading = false;
        state.execom.error = action.payload as string;
      });
  }
});

// Export selectors
export const selectCoreTeam = (state: { team: TeamState }) => state.team.core;
export const selectGBTeam = (state: { team: TeamState }) => state.team.gb;
export const selectExecomTeam = (state: { team: TeamState }) =>
  state.team.execom;

export default teamSlice.reducer;
