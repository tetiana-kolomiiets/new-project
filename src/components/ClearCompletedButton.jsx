function ClearCompletedButton({ completedCount, onClear }) {
  if (completedCount === 0) {
    return null;
  }

  return (
    <button onClick={onClear} className="clear-completed-button">
      Clear Completed ({completedCount})
    </button>
  );
}

export default ClearCompletedButton;
