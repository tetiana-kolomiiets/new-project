import { useState, useMemo } from 'react';
import TodoInput from './TodoInput';
import FilterTabs from './FilterTabs';
import TodoList from './TodoList';
import TodoProgress from './TodoProgress';
import TodoSummary from './TodoSummary';
import ToggleAll from './ToggleAll';
import useLocalStorage from '../hooks/useLocalStorage';

function App() {
  const [todos, setTodos] = useLocalStorage('todos', []);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  const addTodo = (text) => {
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text, completed: false, createdAt: Date.now() },
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

  const toggleAllTodos = () => {
    setTodos((prev) => {
      if (prev.length === 0) return prev;
      const allCompleted = prev.every((todo) => todo.completed);
      return prev.map((todo) => ({ ...todo, completed: !allCompleted }));
    });
  };

  const filteredTodos = useMemo(() => {
    // Filter
    return todos.filter((todo) => {
      // Filter by status
      if (filter === 'active' && todo.completed) return false;
      if (filter === 'completed' && !todo.completed) return false;
      
      return true;
    });
  }, [todos, filter]);

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
        <TodoInput onAdd={addTodo} />
        <TodoProgress todos={todos} />
        <TodoSummary todos={todos} />
        <div className="controls-row">
          <ToggleAll todos={todos} onToggleAll={toggleAllTodos} />
          <FilterTabs filter={filter} onChange={setFilter} />
        </div>
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

