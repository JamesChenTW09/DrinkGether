// const initState = 0;

// export default function countReducer(preState = initState, action) {
//   const { type, data } = action;
//   console.log(123);
//   switch (type) {
//     case "hideLogInBox":
//       console.log(preState);
//       console.log(data);
//       return preState + data;
//     case "showLogInBox":
//       return preState - data;
//     default:
//       return preState;
//   }
// }
import { createSlice } from "@reduxjs/toolkit";

export const todo = createSlice({
  name: "todo",
  initialState: {
    todolist: [
      { id: 1, name: "first todo on redux" },
      { id: 2, name: "second todo in list" },
      { id: 3, name: "third todo in list" },
    ],
  },
  reducers: {
    addTodo: (state, action) => {
      state.todolist.push(action.payload);
    },
  },
});
export const selectTodo = (state) => state.todo;
export const { addTodo } = todo.actions;
export default todo.reducer;
