import "./App.css";
import { useFetchAllTodos } from "./hooks";
import {
	addTodo,
	deleteTodo,
	todoEditTitle,
	toggleTodoCompleted,
} from "./services/todosSlice";
import type Todo from "./services/types";
import { type FormEvent, useState } from "react";
import { useAppDispatch } from "./store";

const Todos = () => {
	const { data, isError, isLoading } = useFetchAllTodos();
	const dispatch = useAppDispatch();
	const [editTitle, setEditTitle] = useState({
		id: 0,
		title: "",
	});
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
	};

	const handleEditTitleTodo = (todo: Todo) => {
		const newTitleTodo: Todo = {
			// This ensures that when we click a button, it only selects the input element that matches the attribute id which is a
			// stringified todo.id value.
			title: (document.getElementById(todo.id.toString()) as HTMLInputElement)
				.value,
			id: todo.id,
			completed: todo.completed,
		};
		if (!newTitleTodo.title.trim()) {
			alert(
				`Empty string not allowed. Attempted to edit todo id and title: ${todo.id} | ${todo.title}`,
			);
			return;
		}
		dispatch(todoEditTitle(newTitleTodo));
		setEditTitle({
			id: 0,
			title: "",
		});
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
									<label htmlFor="edit-title">
										<input
											// this ensures  each input element is unique!
											key={todo.id}
											id={todo.id.toString()}
											type="text"
											placeholder={todo.title}
											// This ensures that the id matches with the element on mouse hover
											onFocus={(e) =>
												setEditTitle({
													id: todo.id,
													title: e.currentTarget.value,
												})
											}
											onMouseDown={(e) =>
												setEditTitle({
													id: todo.id,
													title: e.currentTarget.value,
												})
											}
											// Resets value if user focuses on another
											value={editTitle.id === todo.id ? editTitle.title : ""}
											onChange={(e) =>
												setEditTitle({
													id: todo.id,
													title: e.target.value,
												})
											}
										/>
									</label>
									<div className="todo-buttons">
										<ToggleButton todo={todo} />
										<DeleteButton todo={todo} />

										<button
											key={todo.id}
											type="button"
											onClick={() => handleEditTitleTodo(todo)}
										>
											Edit todo title
										</button>
									</div>
								</li>
							))}
						</ul>
					</>
				) : null}
			</div>
		</>
	);
};

const DeleteButton = ({ todo }: { todo: Todo }) => {
	const dispatch = useAppDispatch();

	return (
		<>
			<button type="button" onClick={() => dispatch(deleteTodo(todo.id))}>
				Delete Todo
			</button>
		</>
	);
};

const ToggleButton = ({ todo }: { todo: Todo }) => {
	const dispatch = useAppDispatch();

	return (
		<>
			<button
				type="button"
				onClick={() => {
					dispatch(toggleTodoCompleted(todo));
				}}
			>
				{todo.completed ? "Completed" : "Click to complete"}
			</button>
		</>
	);
};

const App = () => {
	return (
		<div>
			<Todos />
		</div>
	);
};

export default App;
