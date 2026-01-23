function TodoCount({ count }) {
  if (count === 0) return null;

  return (
    <div className="todo-count">
      {count} {count === 1 ? 'todo' : 'todos'}
    </div>
  );
}

export default TodoCount;
