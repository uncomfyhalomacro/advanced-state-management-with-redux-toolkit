import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
	fetchTodos,
	selectTodosStatus,
} from "./services/todosSlice";
import store, { selectAllTodos } from "./store";
import type { RootState } from "./store";

const FetchAllTodos = () => {
	const dispatch = useDispatch<typeof store.dispatch>();
	const status = useSelector((state: RootState) => selectTodosStatus(state));
	const data = selectAllTodos(store.getState());

	useEffect(() => {
		if (status === 'pending') {
			dispatch(fetchTodos());
		}
	}, [status, dispatch]);

	const isLoading = status === "pending";
	const isError = status === "rejected";
	const isSuccess = status === "fulfilled";
	return { data, isLoading, isError, isSuccess };
};

export { FetchAllTodos };
