import { createSlice } from "@reduxjs/toolkit";

export const eventListSlice = createSlice({
  name: "eventList",
  initialState: {
    calendarEventList: [],
    allEventList: [],
    dailyEventList: [],
    eventDetail: {},
    discussList: [],
    clickDate: "",
  },
  reducers: {
    setInitialCalendarEventList: (state, action) => {
      state.calendarEventList = action.payload;
    },
    addCalendarEvent: (state, action) => {
      state.calendarEventList = [...state.calendarEventList, action.payload];
    },
    filterCalendarEvent: (state, action) => {
      state.calendarEventList = action.payload;
    },

    setInitialAllEventList: (state, action) => {
      state.allEventList = action.payload;
    },
    addAllEvent: (state, action) => {
      state.allEventList = [...state.allEventList, action.payload];
    },
    storeEventDetail: (state, action) => {
      state.eventDetail = action.payload;
    },
    setInitialDailyEventList: (state, action) => {
      state.dailyEventList = action.payload;
    },
    filterDailyEvent: (state, action) => {
      state.calendarEventList = [...state.calendarEventList, action.payload];
    },
    setInitialDiscussList: (state, action) => {
      state.discussList = action.payload;
    },
    setEmptyDiscussList: (state) => {
      state.discussList = [];
    },
    addDiscussList: (state, action) => {
      state.discussList = [...state.discussList, action.payload];
    },
    reserveClickDate: (state, action) => {
      state.clickDate = action.payload;
    },
  },
});

export const {
  reserveClickDate,
  setInitialDiscussList,
  setEmptyDiscussList,
  addDiscussList,
  addCalendarEvent,
  addAllEvent,
  setInitialCalendarEventList,
  filterCalendarEvent,
  setInitialAllEventList,
  storeEventDetail,
  setInitialDailyEventList,
  filterDailyEvent,
} = eventListSlice.actions;
export default eventListSlice.reducer;
