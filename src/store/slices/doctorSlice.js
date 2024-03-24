import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching doctors
export const fetchDoctors = createAsyncThunk(
  "doctors/fetchDoctors",
  async ({ page, searchTerm }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_BASE_URL}/doctors/`,
      {
        params: {
          page,
          search: searchTerm,
        },
      }
    );
    return response.data;
  }
);

const doctorsSlice = createSlice({
  name: "doctors",
  initialState: {
    doctors: [],
    loading: false,
    error: null,
    searchTerm: "",
    page: 1,
    totalPages: 1,
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
        state.totalPages = action.payload.count;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSearchTerm, setPage } = doctorsSlice.actions;
export default doctorsSlice.reducer;
