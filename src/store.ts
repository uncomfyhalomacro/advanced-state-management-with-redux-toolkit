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
		listenerApi.dispatch(todoDeleted());
		await listenerApi.delay(500);
		listenerApi.dispatch(setStateToIdle());
	},
});

listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
	actionCreator: toggleTodoCompleted,
	effect: async (action, listenerApi) => {
		console.log("Performed ", action.type, " on todo id ", action.payload);
		listenerApi.cancelActiveListeners();
		listenerApi.dispatch(todoCompleteToggled());
		await listenerApi.delay(500);
		listenerApi.dispatch(setStateToIdle());
	},
});

listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
	actionCreator: todoEditTitle,
	effect: async (action, listenerApi) => {
		console.log("Performed ", action.type, " on todo id ", action.payload);
		listenerApi.cancelActiveListeners();
		listenerApi.dispatch(todoTitleEdited());
		await listenerApi.delay(500);
		listenerApi.dispatch(setStateToIdle());
	},
});
