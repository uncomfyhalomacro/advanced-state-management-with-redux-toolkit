import { useEffect } from "react";

import { fetchTodos } from "./services/todosSlice";
import store, { selectAllTodos, useAppDispatch, useAppSelector } from "./store";

const useFetchAllTodos = () => {
	const dispatch = useAppDispatch();
	const status = useAppSelector((state) => state.todos.status);
	const data = selectAllTodos(store.getState());

	useEffect(() => {
		if (status === "pending") {
			dispatch(fetchTodos());
		}
	}, [status, dispatch]);

	const isLoading = status === "pending";
	const isError = status === "rejected";
	const isSuccess = status === "fulfilled";
	return { data, isLoading, isError, isSuccess };
};

export { useFetchAllTodos };
