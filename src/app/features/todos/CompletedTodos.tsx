import { useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { removeCompletedTodo, selectAllTodos } from "./todoSlices";
import { useSelector } from "react-redux";

const selectCompletedTodos = createSelector([selectAllTodos], (todos) =>
	todos.filter((todo) => todo.done),
);

const CompletedTodosList = () => {
	const dispatch = useDispatch();
	const completedTodos = useSelector(selectCompletedTodos);

	const handleRemove = (id: number) => {
		dispatch(removeCompletedTodo(id));
	};

	return (
		<div>
			<ul>
				{completedTodos.map((todo) => (
					<li key={todo.id}>
						{todo.title}
						<button
							type="button"
							className="delete"
							onClick={() => handleRemove(todo.id)}
						>
							Remove
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default CompletedTodosList;