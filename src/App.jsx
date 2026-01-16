import { useState } from 'react';
import './index.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  const addTodo = () => {
    if (input.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  const toggleTodo = (id) => {
    if (editingId !== id) {
      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditText('');
    }
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    if (editText.trim() !== '') {
      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text: editText.trim() } : todo)));
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const handleEditKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      saveEdit(id);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });

  return (
    <div className="app">
      <div className="container">
        <h1>Todo List</h1>
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a new todo..."
            className="todo-input"
          />
          <button onClick={addTodo} className="add-button">
            Add
          </button>
        </div>
        <div className="filter-container">
          <button onClick={() => setFilter('all')} className={`filter-button ${filter === 'all' ? 'active' : ''}`}>
            All
          </button>
          <button onClick={() => setFilter('active')} className={`filter-button ${filter === 'active' ? 'active' : ''}`}>
            Active
          </button>
          <button onClick={() => setFilter('completed')} className={`filter-button ${filter === 'completed' ? 'active' : ''}`}>
            Completed
          </button>
        </div>
        <ul className="todo-list">
          {filteredTodos.length === 0 ? (
            <li className="empty-state">
              {todos.length === 0
                ? 'No todos yet. Add one above!'
                : filter === 'active'
                ? 'No active todos!'
                : filter === 'completed'
                ? 'No completed todos!'
                : 'No todos yet. Add one above!'}
            </li>
          ) : (
            filteredTodos.map((todo) => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                {editingId === todo.id ? (
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => handleEditKeyPress(e, todo.id)}
                      onBlur={() => saveEdit(todo.id)}
                      className="edit-input"
                      autoFocus
                    />
                    <div className="edit-buttons">
                      <button onClick={() => saveEdit(todo.id)} className="save-button">
                        Save
                      </button>
                      <button onClick={cancelEdit} className="cancel-button">
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="todo-text" onClick={() => toggleTodo(todo.id)}>
                      {todo.text}
                    </span>
                    <div className="action-buttons">
                      <button onClick={() => startEdit(todo.id, todo.text)} className="edit-button">
                        Edit
                      </button>
                      <button onClick={() => deleteTodo(todo.id)} className="delete-button">
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
