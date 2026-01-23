function TodoProgress({ todos }) {
  if (todos.length === 0) return null;

  const completed = todos.filter((todo) => todo.completed).length;
  const percentage = Math.round((completed / todos.length) * 100);

  return (
    <div className="todo-progress">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="progress-text">{percentage}% completed</span>
    </div>
  );
}

export default TodoProgress;
