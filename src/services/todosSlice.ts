import {
	createEntityAdapter,
	createAsyncThunk,
	createSlice,
} from "@reduxjs/toolkit";
import type Todo from "./types";
import type { RootState } from "../store";

export const fetchTodos = createAsyncThunk<Todo[]>(
	"todos/fetchTodos",
	// biome-ignore lint/suspicious/noExplicitAny: rejectWithValue can be any
	async (_, { rejectWithValue }: any) => {
		const todos = [
			{ id: 1, title: "StackUp and Learn", completed: true },
			{ id: 2, title: "StackUp and Earn", completed: false },
		];

		// fake if-else
		if (todos === undefined) {
			return rejectWithValue(todos);
		}

		// const whut = JSON.stringify(todos);
		// console.log(whut);
		return todos;

		// it would be nice to call from an API we made. for example `const response = await fetch('someapi')`
	},
);

export const todosAdapter = createEntityAdapter({
	selectId: (todo: Todo) => todo.id,
});

const todosSlice = createSlice({
	name: "todos",
	initialState: todosAdapter.getInitialState(
		{
			status: "pending",
		},
		[],
	),
	reducers: {
		addTodo: todosAdapter.addOne,
		updateTodo: todosAdapter.updateOne,
		deleteTodo: todosAdapter.removeOne,
		toggleTodoCompleted(state, action) {
			console.log(action);
			todosAdapter.updateOne(state, {
				id: action.payload.id,
				changes: { completed: true },
			});
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchTodos.pending, (state) => {
			state.status = "pending";
		});
		builder.addCase(fetchTodos.fulfilled, (state, { payload }) => {
			const todoEntries: Record<number, Todo> = {};
			for (const todo of payload) {
				todoEntries[todo.id] = todo;
			}
			todosAdapter.setAll(state, payload);
			console.log(payload);
			state.status = "fulfilled";
		});
		builder.addCase(fetchTodos.rejected, (state) => {
			state.status = "failed";
		});
	},
});

const selectTodosStatus = (state: RootState) => state.todos.status;
export { selectTodosStatus };
export const { addTodo, updateTodo, toggleTodoCompleted, deleteTodo } =
	todosSlice.actions;
export default todosSlice;
