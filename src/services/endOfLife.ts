import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { SingleCycle } from "./types";
import type { RootState } from "../store";

export interface SingleCycleAttributes {
	cycle: string;
	product: string;
}

const fetchSingleCycle = createAsyncThunk<SingleCycle, SingleCycleAttributes>(
	"eol/fetchSingleCycle",
	// biome-ignore lint/suspicious/noExplicitAny: data can be anything
	async (query, { rejectWithValue }: any) => {
		const { cycle, product } = query;
		const response = await fetch(
			`https://endoflife.date/api/${product}/${cycle}.json`,
		);
		const data = await response.json();
		if (response.status < 200 || response.status >= 300) {
			return rejectWithValue(data);
		}
		return data;
	},
);

type RequestState = "pending" | "fulfilled" | "rejected";

const endOfLifeSlice = createSlice({
	name: "endoflife",
	initialState: {
		dataByName: {} as Record<string, SingleCycle | undefined>,
		statusByName: {} as Record<string, RequestState | undefined>,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchSingleCycle.pending, (state, action) => {
			state.statusByName[action.meta.arg.product] = "pending";
		});
		builder.addCase(fetchSingleCycle.fulfilled, (state, action) => {
			state.statusByName[action.meta.arg.product] = "fulfilled";
			state.dataByName[action.meta.arg.product] = action.payload;
		});
		builder.addCase(fetchSingleCycle.rejected, (state, action) => {
			state.statusByName[action.meta.arg.product] = "rejected";
		});
	},
});

export const selectStatusByName = (state: RootState, name: string) =>
	state.eol.statusByName[name];

export const selectDataByName = (state: RootState, name: string) =>
	state.eol?.dataByName[name];

export default endOfLifeSlice;
export { fetchSingleCycle };
