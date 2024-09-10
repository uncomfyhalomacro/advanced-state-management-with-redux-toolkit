import {
	configureStore,
	createListenerMiddleware,
	isFulfilled,
} from "@reduxjs/toolkit";
import todoSlice, {
	deleteTodo,
	fetchTodos,
	setStateToIdle,
	todoCompleteToggled,
	todoDeleted,
	todoEditTitle,
	todosAdapter,
	todoTitleEdited,
	toggleTodoCompleted,
} from "./services/todosSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const listenerMiddleware = createListenerMiddleware();
const store = configureStore({
	reducer: {
		todos: todoSlice.reducer,
	},
	middleware: (getDefaultMiddleWare) =>
		getDefaultMiddleWare().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const todosSelector = todosAdapter.getSelectors<RootState>(
	(state) => state.todos,
);
export const { selectAll: selectAllTodos, selectById: selectTodoById } =
	todosSelector;
export default store;

// Prefetching data is not the listenerMiddleware's job?
// listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
// 	predicate(action, currentState, originalState) {
// 		return originalState.todos.status === "pending" || currentState.todos.status === "pending";
// 	},
// 	effect: async (_action, listenerApi) => {
// 		listenerApi.cancelActiveListeners();
// 		console.log("Old status: ", listenerApi.getOriginalState().todos.status);
// 		if (listenerApi.getState().todos.status === "pending") {
// 			listenerApi.dispatch(fetchTodos());
// 			console.log("Set state to 'idle'");
// 			await listenerApi.delay(500);
// 		} else {
// 			listenerApi.unsubscribe();
// 		}
// 	},
// });

listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
	matcher: isFulfilled(fetchTodos),
	effect: async (_action, listenerApi) => {
		listenerApi.cancelActiveListeners();
		listenerApi.dispatch(setStateToIdle());
		console.log("Set state to 'idle'");
		await listenerApi.delay(500);
		listenerApi.unsubscribe();
	},
});

listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
	actionCreator: deleteTodo,
	effect: async (action, listenerApi) => {
		console.log("Performed ", action.type, " on todo id ", action.payload);
		listenerApi.cancelActiveListeners();
		const oldTodo = selectTodoById(
			listenerApi.getOriginalState(),
			action.payload,
		);
		console.log("Old todo:", oldTodo);
		listenerApi.dispatch(todoDeleted());
		await listenerApi.delay(500);
		const isUndefined =
			selectTodoById(listenerApi.getState(), action.payload) === undefined;
		console.log("Todo was really removed?", isUndefined);
		listenerApi.dispatch(setStateToIdle());
	},
});

listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
	actionCreator: toggleTodoCompleted,
	effect: async (action, listenerApi) => {
		console.log("Performed ", action.type, " on todo id ", action.payload);
		listenerApi.cancelActiveListeners();
		const oldTodo = selectTodoById(
			listenerApi.getOriginalState(),
			action.payload.id,
		);
		console.log("Old todo:", oldTodo);
		listenerApi.dispatch(todoCompleteToggled());
		await listenerApi.delay(500);
		const newTodo = selectTodoById(listenerApi.getState(), action.payload.id);
		console.log("New todo:", newTodo);
		listenerApi.dispatch(setStateToIdle());
	},
});

listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
	actionCreator: todoEditTitle,
	effect: async (action, listenerApi) => {
		console.log("Performed ", action.type, " on todo id ", action.payload);
		const oldTodo = selectTodoById(
			listenerApi.getOriginalState(),
			action.payload.id,
		);
		console.log("Old todo:", oldTodo);
		listenerApi.cancelActiveListeners();
		listenerApi.dispatch(todoTitleEdited());
		await listenerApi.delay(500);
		const newTodo = selectTodoById(listenerApi.getState(), action.payload.id);
		console.log("New todo:", newTodo);
		listenerApi.dispatch(setStateToIdle());
	},
});
