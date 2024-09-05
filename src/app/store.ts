import {
	type ActionReducerMapBuilder,
	configureStore,
	createAction,
	createReducer,
	type Dispatch,
	type PayloadAction,
} from "@reduxjs/toolkit";

// export interface CounterState{
// 	value: number;
// }

type CounterState = {
	value: number;
};

export const increment = createAction<number, "increment">("increment");

const initialState: CounterState = {
	value: 0,
};

export const counterReducer = createReducer(
	initialState,
	(builder: ActionReducerMapBuilder<CounterState>) => {
		builder.addCase(increment, (state, action: PayloadAction<number>) => {
			state.value += action.payload;
		});
	},
);

export const store = configureStore({
	reducer: counterReducer,
	preloadedState: initialState,
});

export type RootState = CounterState;
export type AppDispatch = Dispatch<PayloadAction<number>>;

export default store;
