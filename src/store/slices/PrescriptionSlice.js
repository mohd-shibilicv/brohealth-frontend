import { createSlice } from "@reduxjs/toolkit";

const prescriptionSlice = createSlice({
  name: "prescription",
  initialState: {
    prescriptions: [],
    loading: false,
    error: null,
  },
  reducers: {
    createPrescriptionStart(state) {
      state.loading = true;
      state.error = null;
    },
    createPrescriptionSuccess(state, action) {
      state.loading = false;
      state.prescriptions.push(action.payload);
    },
    createPrescriptionFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  createPrescriptionStart,
  createPrescriptionSuccess,
  createPrescriptionFailure,
} = prescriptionSlice.actions;

export default prescriptionSlice.reducer;
