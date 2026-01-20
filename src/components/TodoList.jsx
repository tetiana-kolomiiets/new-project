import TodoItem from './TodoItem';

function TodoList({
  todos,
  emptyMessage,
  editingId,
  editText,
  onToggle,
  onDelete,
  onStartEdit,
  onChangeEditText,
  onSaveEdit,
  onCancelEdit,
  onEditKeyPress,
}) {
  if (todos.length === 0) {
    return (
      <ul className="todo-list">
        <li className="empty-state">{emptyMessage}</li>
      </ul>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isEditing={editingId === todo.id}
          editText={editText}
          onToggle={onToggle}
          onDelete={onDelete}
          onStartEdit={onStartEdit}
          onChangeEditText={onChangeEditText}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onEditKeyPress={onEditKeyPress}
        />
      ))}
    </ul>
  );
}

export default TodoList;

