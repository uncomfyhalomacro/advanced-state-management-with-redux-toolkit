import {
	createSlice,
	createAsyncThunk,
	createEntityAdapter,
	type EntityState,
	type PayloadAction,
} from "@reduxjs/toolkit";

export interface TodosState extends EntityState<Todo, number> {
	status: "idle" | "loading" | "succeeded" | "failed";
	error?: {
		message?: string;
	};
}

export interface Todo {
	id: number; // entity ID (required field)
	title: string;
	done: boolean;
	date_completed: string | undefined;
}

const todosAdapter = createEntityAdapter<Todo>();

const initialState: TodosState = {
	ids: [],
	status: "idle",
	entities: {},
};

const fetchTodos = createAsyncThunk<Todo[]>(
	"todos/fetchTodos",
	// Mock data
	async (): Promise<Todo[]> => {
		return [
			{
				id: 1,
				title: "Learn Redux Toolkit",
				done: false,
				date_completed: undefined,
			},
			{
				id: 2,
				title: "React Basics",
				done: true,
				date_completed: "21/12/2012",
			},
		];

		// Uncomment below if you have an actual API endpoint
		// const response = await fetch("/api/todos")
		// if (!Response.ok) {
		// 	throw new Error("Error fetching todos. Response recieved error");
		// }

		// return response.json()
	},
);

const todoSlice = createSlice({
	name: "todos",
	initialState,
	reducers: {
		addTodo: todosAdapter.addOne,
		updateTodo: todosAdapter.updateOne,
		deleteTodo: todosAdapter.removeOne,
		completeTodo: (state, action) => {
			todosAdapter.updateOne(state, {
				id: action.payload,
				changes: { done: true },
			});
		},
		removeCompletedTodo: todosAdapter.removeOne,
	},
	extraReducers(builder) {
		builder
			.addCase(fetchTodos.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
				state.status = "succeeded";
				todosAdapter.setAll(state, action.payload);
			})
			.addCase(fetchTodos.rejected, (state, action) => {
				state.status = "failed";
				state.error = {
					message: action.error.message,
				};
			});
	},
});

export const { deleteTodo, addTodo, completeTodo, removeCompletedTodo } =
	todoSlice.actions;

export const { selectAll: selectAllTodos, selectById: selectTodoById } =
	todosAdapter.getSelectors();

export default todoSlice.reducer;
