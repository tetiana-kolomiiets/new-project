import { useState } from 'react';
import TodoInput from './TodoInput';
import FilterTabs from './FilterTabs';
import TodoList from './TodoList';
import TodoStats from './TodoStats';
import TodoSearch from './TodoSearch';
import ClearCompletedButton from './ClearCompletedButton';

function App() {
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [searchTerm, setSearchTerm] = useState('');

  const addTodo = (text, priority = 'medium') => {
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text, completed: false, priority },
    ]);
  };

  const toggleTodo = (id) => {
    if (editingId !== id) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      );
    }
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
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
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, text: editText.trim() } : todo,
        ),
      );
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleEditKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      saveEdit(id);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    // Filter by status
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      return todo.text.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  });

  const completedCount = todos.filter((todo) => todo.completed).length;

  const emptyMessage =
    todos.length === 0
      ? 'No todos yet. Add one above!'
      : filter === 'active'
        ? 'No active todos!'
        : filter === 'completed'
          ? 'No completed todos!'
          : 'No todos yet. Add one above!';

  return (
    <div className="app">
      <div className="container">
        <h1>Todo List</h1>
        <TodoStats todos={todos} />
        <TodoInput onAdd={addTodo} />
        <TodoSearch onSearch={setSearchTerm} />
        <FilterTabs filter={filter} onChange={setFilter} />
        {completedCount > 0 && (
          <ClearCompletedButton
            completedCount={completedCount}
            onClear={clearCompleted}
          />
        )}
        <TodoList
          todos={filteredTodos}
          emptyMessage={emptyMessage}
          editingId={editingId}
          editText={editText}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onStartEdit={startEdit}
          onChangeEditText={setEditText}
          onSaveEdit={saveEdit}
          onCancelEdit={cancelEdit}
          onEditKeyPress={handleEditKeyPress}
        />
      </div>
    </div>
  );
}

export default App;

