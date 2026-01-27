function ToggleAll({ todos, onToggleAll }) {
  const total = todos.length;
  if (total === 0) return null;

  const allCompleted = todos.every((todo) => todo.completed);
  const label = allCompleted ? 'Unmark all' : 'Mark all done';

  return (
    <button
      type="button"
      className={`toggle-all-button ${allCompleted ? 'all-completed' : ''}`}
      onClick={onToggleAll}
    >
      {allCompleted ? '↩️' : '✅'} {label}
    </button>
  );
}

export default ToggleAll;

