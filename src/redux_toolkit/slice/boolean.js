import { createSlice } from "@reduxjs/toolkit";

export const booleanSlice = createSlice({
  name: "boolean",
  initialState: {
    allEventsBox: false,
    eventDetailBox: false,
    startEventBox: 0,
    discussAreaBox: false,
  },
  reducers: {
    showAllEventsBox: (state) => {
      state.allEventsBox = true;
    },
    notShowAllEventsBox: (state) => {
      state.allEventsBox = false;
    },
    showEventDetailBox: (state) => {
      state.eventDetailBox = true;
    },
    notShowEventDetailBox: (state) => {
      state.eventDetailBox = false;
    },
    showStartEventBox: (state) => {
      state.startEventBox = 1;
    },
    notShowStartEventBox: (state) => {
      state.startEventBox = 0;
    },
    showDiscussAreaBox: (state) => {
      state.discussAreaBox = true;
    },
    notShowDiscussAreaBox: (state) => {
      state.discussAreaBox = false;
    },
  },
});

export const {
  notShowDiscussAreaBox,
  showDiscussAreaBox,
  showAllEventsBox,
  notShowAllEventsBox,
  showEventDetailBox,
  notShowEventDetailBox,
  showStartEventBox,
  notShowStartEventBox,
} = booleanSlice.actions;
export default booleanSlice.reducer;
