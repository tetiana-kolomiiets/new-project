function TodoStats({ todos }) {
  const total = todos.length;
  const active = todos.filter((todo) => !todo.completed).length;
  const completed = todos.filter((todo) => todo.completed).length;

  return (
    <div className="stats-container">
      <div className="stat-item">
        <span className="stat-label">Total:</span>
        <span className="stat-value">{total}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Active:</span>
        <span className="stat-value active">{active}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Completed:</span>
        <span className="stat-value completed">{completed}</span>
      </div>
    </div>
  );
}

export default TodoStats;
