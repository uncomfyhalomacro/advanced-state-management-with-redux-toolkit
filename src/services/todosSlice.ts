import {
	createEntityAdapter,
	createAsyncThunk,
	createSlice,
	type PayloadAction,
} from "@reduxjs/toolkit";
import type Todo from "./types";
import type { AppDispatch, RootState } from "../store";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
	state: RootState;
	dispatch: AppDispatch;
}>();

export const fetchTodos = createAppAsyncThunk<Todo[]>(
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

export type TodosAdapter = typeof todosAdapter;

const todosSlice = createSlice({
	name: "todos",
	initialState: todosAdapter.getInitialState({
		status: "pending",
	}),
	reducers: {
		addTodo: todosAdapter.addOne,
		updateTodo: todosAdapter.updateOne,
		deleteTodo: todosAdapter.removeOne,
		todoEditTitle(state, action: PayloadAction<Todo>) {
			todosAdapter.updateOne(state, {
				id: action.payload.id,
				changes: { title: action.payload.title },
			});
		},
		todoTitleEdited(state) {
			state.status = "modified(editedTitle)";
		},
		todoDeleted(state) {
			state.status = "modified(deletion)";
		},
		todoCompleteToggled(state) {
			state.status = "modified(toggleCompleted)";
		},
		setStateToIdle(state) {
			state.status = "idle";
		},
		setAllTodos: todosAdapter.setAll,
		toggleTodoCompleted(state, action: PayloadAction<Todo>) {
			todosAdapter.updateOne(state, {
				id: action.payload.id,
				changes: { completed: !action.payload.completed },
			});
		},
		todosUpdated(state) {
			state.status = "fulfilled";
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchTodos.pending, (state) => {
			state.status = "pending";
		});
		builder.addCase(fetchTodos.fulfilled, (state, { payload }) => {
			// const todoEntries: Record<number, Todo> = {};
			// for (const todo of payload) {
			// 	todoEntries[todo.id] = todo;
			// }
			todosAdapter.setAll(state, payload);
			state.status = "fulfilled";
		});
		builder.addCase(fetchTodos.rejected, (state) => {
			state.status = "failed";
		});
	},
});

export type AppActions = typeof todosSlice.actions;

export const {
	setAllTodos,
	addTodo,
	updateTodo,
	todosUpdated,
	toggleTodoCompleted,
	todoCompleteToggled,
	todoEditTitle,
	todoTitleEdited,
	deleteTodo,
	todoDeleted,
	setStateToIdle,
} = todosSlice.actions;
export default todosSlice;
