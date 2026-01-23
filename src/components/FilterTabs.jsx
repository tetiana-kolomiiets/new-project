function FilterTabs({ filter, onChange }) {
  const options = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'active', label: 'Active', icon: '⚡' },
    { id: 'completed', label: 'Done', icon: '✅' },
  ];

  return (
    <div className="filter-container">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={`filter-button ${filter === option.id ? 'active' : ''}`}
          title={option.label}
        >
          <span className="filter-icon">{option.icon}</span>
          <span className="filter-label">{option.label}</span>
        </button>
      ))}
    </div>
  );
}

export default FilterTabs;

