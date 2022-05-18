import { configureStore } from "@reduxjs/toolkit";
import booleanReducer from "./slice/boolean";
import eventInputReducer from "./slice/startEvent";
import eventListReducer from "./slice/eventList";

export default configureStore({
  reducer: {
    boolean: booleanReducer,
    eventInput: eventInputReducer,
    eventList: eventListReducer,
  },
});
