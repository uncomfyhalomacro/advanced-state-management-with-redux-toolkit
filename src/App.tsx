import { useDispatch } from "react-redux";
import "./App.css";
import { FetchAllTodos } from "./hooks";
import { addTodo, deleteTodo, updateTodo } from "./services/todosSlice";
import store, { selectTodoById } from "./store";
import type Todo from "./services/types";
import { type FormEvent, useState } from "react";

const TodoForm = () => {
	let { data, isError, isLoading } = FetchAllTodos();
	const dispatch = useDispatch<typeof store.dispatch>();
	const [formData, setFormData] = useState({
		title: "",
	});

	const handleAddTodo = (e: FormEvent) => {
		e.preventDefault();
		if (!formData.title.trim()) {
			alert("Title should not be empty");
			return;
		}
		dispatch(
			addTodo({
				id: Date.now(),
				title: formData.title,
				completed: false,
			}),
		);
		setFormData({
			title: "",
		});

		// How not to violate?
		const {
			data: newData,
			isError: newError,
			isLoading: newLoading,
		} = FetchAllTodos();
		data = newData;
		isError = newError;
		isLoading = newLoading;
	};

	return (
		<>
			<form onSubmit={(e) => handleAddTodo(e)}>
				<label htmlFor="todo-title">
					<input
						type="text"
						id="todo-title"
						placeholder="Add title"
						value={formData.title}
						onChange={(e) => setFormData({ title: e.target.value })}
					/>
				</label>
				<button type="submit">Add Todo</button>
			</form>
			<Todos data={data} isError={isError} isLoading={isLoading} />
		</>
	);
};

const ToggleButton = ({ todo }: { todo: Todo }) => {
	const [isCompleted, setToggleCompleted] = useState(todo.completed);
	const dispatch = useDispatch<typeof store.dispatch>();

	return (
		<>
			<button
				type="button"
				onClick={() => {
					dispatch(
						updateTodo({
							id: todo.id,
							changes: { completed: !isCompleted },
						}),
					);
					const data = selectTodoById(store.getState(), todo.id);
					setToggleCompleted(data.completed);
				}}
			>
				{isCompleted ? "Completed" : "Click to complete"}
			</button>
		</>
	);
};


const Todos = ({
	data,
	isError,
	isLoading,
}: { data: Todo[]; isError: boolean; isLoading: boolean }) => {
	return (
		<div>
			{isLoading ? (
				<>Loading todos...</>
			) : isError ? (
				<>Failed to fetch todos.</>
			) : data ? (
				<>
					<ul>
						{data.map((todo) => (
							<li key={todo.id}>
								<h1>{todo.title}</h1>
								<div className="todo-buttons"><ToggleButton todo={todo} /><button type="button">Delete Todo</button></div>
							</li>
						))}
					</ul>
				</>
			) : null}
		</div>
	);
};

const App = () => {
	return (
		<div>
			<TodoForm />
		</div>
	);
};

export default App;
