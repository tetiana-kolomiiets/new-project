import { useState } from 'react';

function TodoSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search todos..."
        className="search-input"
      />
      {searchTerm && (
        <button onClick={handleClear} className="clear-search-button" title="Clear search">
          ×
        </button>
      )}
    </div>
  );
}

export default TodoSearch;
