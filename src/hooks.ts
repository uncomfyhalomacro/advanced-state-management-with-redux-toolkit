import { fetchTodos } from "./services/todosSlice";
import store, { selectAllTodos, useAppDispatch, useAppSelector } from "./store";

const useFetchAllTodos = () => {
	const dispatch = useAppDispatch();
	const status = useAppSelector((state) => state.todos.status);
	const data = selectAllTodos(store.getState());
	if (status === undefined) {
		dispatch(fetchTodos());
	}
	const isLoading = status === "pending";
	const isError = status === "failed";
	const isSuccess = status === "fulfilled";
	const isIdle = status === "idle";
	return { data, isLoading, isError, isSuccess, isIdle };
};

export { useFetchAllTodos };
