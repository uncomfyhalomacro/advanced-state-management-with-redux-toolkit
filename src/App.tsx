import { useState } from "react";
import "./App.css";
import useGetSingleCycle from "./hooks";
const Eol = ({ cycle, product }: { cycle: string; product: string }) => {
	const { data, isError, isLoading } = useGetSingleCycle(
		cycle.trim().toLowerCase(),
		product.trim().toLocaleLowerCase(),
	);
	return (
		<>
			<div>
				{isError ? (
					<>Product not found from last query...</>
				) : isLoading ? (
					<>Loading data...</>
				) : data ? (
					<>
						<h1>Product: {product}</h1>
						<h2>Version Cycle: {data?.cycle ? data.cycle : cycle}</h2>
						<h3>Release date: {data?.releaseDate}</h3>
						<h4>Latest Version: {data?.latest}</h4>
						<h5>LTS Support: {data?.lts?.toString()}</h5>
					</>
				) : null}
			</div>
		</>
	);
};
const App = () => {
	const [formData, setFormData] = useState({
		cycle: "",
		product: "",
	});

	const [data, setData] = useState({
		cycle: "3.9",
		product: "python",
	});

	return (
		<div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					setData(formData);
				}}
			>
				<label htmlFor="product">
					<input
						type="text"
						id="product"
						value={formData.product}
						placeholder="Product"
						onChange={(e) =>
							setFormData({ cycle: formData.cycle, product: e.target.value })
						}
					/>
				</label>
				<label htmlFor="cycle">
					<input
						type="text"
						id="cycle"
						value={formData.cycle}
						placeholder="Cycle"
						onChange={(e) =>
							setFormData({ product: formData.product, cycle: e.target.value })
						}
					/>
				</label>
				<button type="submit">Search Cycle</button>{" "}
			</form>
			<Eol cycle={data.cycle} product={data.product} />
		</div>
	);
};

export default App;
