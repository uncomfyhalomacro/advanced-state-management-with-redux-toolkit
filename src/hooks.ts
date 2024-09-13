import { useDispatch, useSelector } from "react-redux";
import {
	fetchSingleCycle,
	selectDataByName,
	selectStatusByName,
	type SingleCycleAttributes,
} from "./services/endOfLife";
import type store from "./store";
import type { RootState } from "./store";

const useGetSingleCycle = ({ cycle, product }: SingleCycleAttributes) => {
	const dispatch = useDispatch<typeof store.dispatch>();
	const status = useSelector((state: RootState) =>
		selectStatusByName(state, product),
	);
	const data = useSelector((state: RootState) =>
		selectDataByName(state, product),
	);

	if (status === undefined) {
		dispatch(fetchSingleCycle({ cycle, product }));
	}

	const isUninitialised = status === undefined;
	const isLoading = status === "pending" || status === undefined;
	const isError = status === "rejected";
	const isSuccess = status === "fulfilled";
	return { data, isUninitialised, isLoading, isError, isSuccess };
};

export default useGetSingleCycle;
