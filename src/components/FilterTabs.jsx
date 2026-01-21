function FilterTabs({ filter, onChange }) {
  const options = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="filter-container">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={`filter-button ${filter === option.id ? 'active' : ''}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default FilterTabs;

