import { createSlice } from "@reduxjs/toolkit";

export const eventInputSlice = createSlice({
  name: "eventInput",
  initialState: {
    eventInput: {
      eventPlace: "",
      eventDate: "",
      eventTime: "",
      eventMaxPal: "",
      eventDescription: "",
    },
  },
  reducers: {
    storeEventInput: (state, action) => {
      state.eventInput = { ...state.eventInput, ...action.payload };
    },
  },
});

export const { storeEventInput } = eventInputSlice.actions;
export default eventInputSlice.reducer;
