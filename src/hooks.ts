import store, { selectAllTodos, useAppSelector } from "./store";

const useFetchAllTodos = () => {
	const status = useAppSelector((state) => state.todos.status);
	const data = selectAllTodos(store.getState());
	const isLoading = status === "pending";
	const isError = status === "rejected";
	const isSuccess = status === "fulfilled" || status === "idle";
	return { data, isLoading, isError, isSuccess };
};

export { useFetchAllTodos };
