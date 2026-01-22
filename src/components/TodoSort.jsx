function TodoSort({ sortBy, onSortChange }) {
  const sortOptions = [
    { id: 'newest', label: 'Newest First' },
    { id: 'oldest', label: 'Oldest First' },
    { id: 'priority', label: 'By Priority' },
    { id: 'alphabetical', label: 'A-Z' },
  ];

  return (
    <div className="sort-container">
      <span className="sort-label">Sort by:</span>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="sort-select"
      >
        {sortOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TodoSort;
