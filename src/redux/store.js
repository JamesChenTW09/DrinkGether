// import { createStore } from "redux";

// import countReducer from "./count_reducer.js";

// const store = createStore(countReducer);

import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./count_reducer";

export default configureStore({
  reducer: {
    todo: todoReducer,
  },
});
