function TodoFilters({ filter, onChange }) {
  return (
    <div className="filter-container">
      <button
        onClick={() => onChange('all')}
        className={`filter-button ${filter === 'all' ? 'active' : ''}`}
      >
        All
      </button>
      <button
        onClick={() => onChange('active')}
        className={`filter-button ${filter === 'active' ? 'active' : ''}`}
      >
        Active
      </button>
      <button
        onClick={() => onChange('completed')}
        className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
      >
        Completed
      </button>
    </div>
  );
}

export default TodoFilters;

