export type SingleCycle = {
	id: number;
	cycle?: number | string;
	releaseDate?: string;
	eol?: string | boolean;
	latest?: string;
	link?: string | null;
	lts?: boolean | string;
	support?: string | boolean;
	discontinued?: string | boolean;
};
