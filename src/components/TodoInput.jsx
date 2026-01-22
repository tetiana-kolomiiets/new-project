import { useState } from 'react';

function TodoInput({ onAdd }) {
  const [value, setValue] = useState('');

  const handleAdd = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="input-container">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a new todo..."
        className="todo-input"
      />
      <button onClick={handleAdd} className="add-button">
        Add
      </button>
    </div>
  );
}

export default TodoInput;

