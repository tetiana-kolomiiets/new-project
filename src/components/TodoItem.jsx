function TodoItem({
  todo,
  isEditing,
  editText,
  onToggle,
  onDelete,
  onStartEdit,
  onChangeEditText,
  onSaveEdit,
  onCancelEdit,
  onEditKeyPress,
}) {
  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editText}
            onChange={(e) => onChangeEditText(e.target.value)}
            onKeyDown={(e) => onEditKeyPress(e, todo.id)}
            onBlur={() => onSaveEdit(todo.id)}
            className="edit-input"
            autoFocus
          />
          <div className="edit-buttons">
            <button onClick={() => onSaveEdit(todo.id)} className="save-button" title="Save changes">
              ✓
            </button>
            <button onClick={onCancelEdit} className="cancel-button" title="Cancel editing">
              ✕
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="todo-content">
            <span className="todo-text" onClick={() => onToggle(todo.id)}>
              {todo.text}
            </span>
          </div>
          <div className="action-buttons">
            <button
              onClick={() => onStartEdit(todo.id, todo.text)}
              className="edit-button"
              title="Edit todo"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="delete-button"
              title="Delete todo"
            >
              🗑️
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default TodoItem;

