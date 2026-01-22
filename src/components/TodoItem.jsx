import TodoDate from './TodoDate';

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
            <button onClick={() => onSaveEdit(todo.id)} className="save-button">
              Save
            </button>
            <button onClick={onCancelEdit} className="cancel-button">
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="todo-content">
            <div className="todo-main">
              <span className="todo-text" onClick={() => onToggle(todo.id)}>
                {todo.text}
              </span>
              {todo.priority && (
                <span
                  className={`priority-badge priority-${todo.priority}`}
                  title={`Priority: ${todo.priority}`}
                >
                  {todo.priority}
                </span>
              )}
            </div>
            <TodoDate createdAt={todo.createdAt} />
          </div>
          <div className="action-buttons">
            <button
              onClick={() => onStartEdit(todo.id, todo.text)}
              className="edit-button"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="delete-button"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default TodoItem;

