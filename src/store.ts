import { configureStore } from "@reduxjs/toolkit";
import todoSlice, { todosAdapter } from "./services/todosSlice";

const store = configureStore({
	reducer: {
		todos: todoSlice.reducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export const todosSelector = todosAdapter.getSelectors<RootState>((state) => state.todos);
export const { selectAll: selectAllTodos, selectById: selectTodoById } = todosSelector;
export default store;
