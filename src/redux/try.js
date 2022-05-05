import React from "react";
import { useSelector } from "react-redux";
import { selectTodo, addTodo } from "./count_reducer";
import { useDispatch } from "react-redux";

const TodoList = () => {
  const dispatch = useDispatch();

  const handleAddTodo = () => {
    dispatch(addTodo({ id: 4, name: "fourth todo in list" }));
  };
  const states = useSelector(selectTodo); // <-- 拿取資料
  return (
    <div>
      <ul>
        {states.todolist.map((i) => (
          <li key={i.id}>{i.name}</li>
        ))}
      </ul>
      <button onClick={handleAddTodo}>add todo</button>
    </div>
  );
};

export default TodoList;
