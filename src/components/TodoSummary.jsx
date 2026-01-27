function TodoSummary({ todos }) {
  const total = todos.length;
  if (total === 0) return null;

  const remaining = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="todo-summary">
      <span className="todo-summary-main">
        {remaining} {remaining === 1 ? 'task' : 'tasks'} left
      </span>
      <span className="todo-summary-sub">
        out of {total} {total === 1 ? 'total' : 'total'}
      </span>
    </div>
  );
}

export default TodoSummary;

