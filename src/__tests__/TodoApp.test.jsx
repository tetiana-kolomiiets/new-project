import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/components/TodoApp';

describe('TodoApp', () => {
  it('renders TodoApp component', () => {
    render(<App />);
    expect(screen.getByText('Todo List')).toBeInTheDocument();
  });

  it('adds a new todo item', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    fireEvent.change(inputElement, { target: { value: 'Buy groceries' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  it('toggles a todo item as completed and back to active', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    fireEvent.change(inputElement, { target: { value: 'Walk the dog' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    const todoItem = screen.getByText('Walk the dog');
    // Assume TodoItem has 'todo-item' class and 'completed' when completed
    expect(todoItem.closest('.todo-item')).not.toHaveClass('completed');

    fireEvent.click(todoItem);
    expect(todoItem.closest('.todo-item')).toHaveClass('completed');

    fireEvent.click(todoItem);
    expect(todoItem.closest('.todo-item')).not.toHaveClass('completed');
  });

  it('deletes a todo item', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    fireEvent.change(inputElement, { target: { value: 'Clean room' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('Clean room')).toBeInTheDocument();

    // Assuming the delete button for a todo item is within its container, e.g., a sibling
    const todoItemContainer = screen.getByText('Clean room').closest('.todo-item');
    const deleteButton = todoItemContainer.querySelector('[aria-label="Delete todo"]');
    fireEvent.click(deleteButton);

    expect(screen.queryByText('Clean room')).not.toBeInTheDocument();
  });

  it('edits a todo item and saves changes', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    fireEvent.change(inputElement, { target: { value: 'Original text' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    const todoItem = screen.getByText('Original text');
    const editButton = todoItem.closest('.todo-item').querySelector('[aria-label="Edit todo"]'); // More specific edit button
    fireEvent.click(editButton);

    const editInputField = screen.getByDisplayValue('Original text');
    fireEvent.change(editInputField, { target: { value: 'Updated text' } });
    fireEvent.keyDown(editInputField, { key: 'Enter', code: 'Enter' });

    expect(screen.queryByText('Original text')).not.toBeInTheDocument();
    expect(screen.getByText('Updated text')).toBeInTheDocument();
  });

  it('edits a todo item and cancels changes', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    fireEvent.change(inputElement, { target: { value: 'Original text to cancel' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    const todoItem = screen.getByText('Original text to cancel');
    const editButton = todoItem.closest('.todo-item').querySelector('[aria-label="Edit todo"]'); // More specific edit button
    fireEvent.click(editButton);

    const editInputField = screen.getByDisplayValue('Original text to cancel');
    fireEvent.change(editInputField, { target: { value: 'New text that should not be saved' } });
    fireEvent.keyDown(editInputField, { key: 'Escape', code: 'Escape' });

    expect(screen.getByText('Original text to cancel')).toBeInTheDocument();
    expect(screen.queryByText('New text that should not be saved')).not.toBeInTheDocument();
  });

  it('filters todos by active', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');

    fireEvent.change(inputElement, { target: { value: 'Active task' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    fireEvent.change(inputElement, { target: { value: 'Completed task' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });
    fireEvent.click(screen.getByText('Completed task'));

    const activeFilterButton = screen.getByRole('button', { name: /active/i });
    fireEvent.click(activeFilterButton);

    expect(screen.getByText('Active task')).toBeInTheDocument();
    expect(screen.queryByText('Completed task')).not.toBeInTheDocument();
  });

  it('filters todos by completed', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');

    fireEvent.change(inputElement, { target: { value: 'Another active task' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    fireEvent.change(inputElement, { target: { value: 'Another completed task' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });
    fireEvent.click(screen.getByText('Another completed task'));

    const completedFilterButton = screen.getByRole('button', { name: /completed/i });
    fireEvent.click(completedFilterButton);

    expect(screen.queryByText('Another active task')).not.toBeInTheDocument();
    expect(screen.getByText('Another completed task')).toBeInTheDocument();
  });

  it('filters todos by all', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');

    fireEvent.change(inputElement, { target: { value: 'Active task for all' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    fireEvent.change(inputElement, { target: { value: 'Completed task for all' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });
    fireEvent.click(screen.getByText('Completed task for all'));

    fireEvent.click(screen.getByRole('button', { name: /completed/i }));
    expect(screen.queryByText('Active task for all')).not.toBeInTheDocument();

    const allFilterButton = screen.getByRole('button', { name: /all/i });
    fireEvent.click(allFilterButton);

    expect(screen.getByText('Active task for all')).toBeInTheDocument();
    expect(screen.getByText('Completed task for all')).toBeInTheDocument();
  });

  it('displays relevant empty messages based on todo state and filter', () => {
    render(<App />);

    expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument();

    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    fireEvent.change(inputElement, { target: { value: 'First todo' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });
    expect(screen.getByText('First todo')).toBeInTheDocument();
    expect(screen.queryByText('No todos yet. Add one above!')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('First todo'));

    fireEvent.click(screen.getByRole('button', { name: /active/i }));
    expect(screen.queryByText('First todo')).not.toBeInTheDocument();
    expect(screen.getByText('No active todos!')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /completed/i }));
    expect(screen.getByText('First todo')).toBeInTheDocument();
    expect(screen.queryByText('No completed todos!')).not.toBeInTheDocument();

    const todoItemContainer = screen.getByText('First todo').closest('.todo-item');
    const deleteButton = todoItemContainer.querySelector('[aria-label="Delete todo"]');
    fireEvent.click(deleteButton);

    fireEvent.click(screen.getByRole('button', { name: /all/i }));
    expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument();
    expect(screen.queryByText('First todo')).not.toBeInTheDocument();
  });

  it('does not toggle completion status when a todo item is being edited', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');

    fireEvent.change(inputElement, { target: { value: 'Editable task' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });
    const todoItem = screen.getByText('Editable task');

    expect(todoItem.closest('.todo-item')).not.toHaveClass('completed');

    const editButton = todoItem.closest('.todo-item').querySelector('[aria-label="Edit todo"]');
    fireEvent.click(editButton);

    const editInputField = screen.getByDisplayValue('Editable task');
    expect(editInputField).toBeInTheDocument();

    fireEvent.click(todoItem);

    expect(todoItem.closest('.todo-item')).not.toHaveClass('completed');

    fireEvent.keyDown(editInputField, { key: 'Escape', code: 'Escape' });
    expect(editInputField).not.toBeInTheDocument();
    expect(screen.getByText('Editable task')).toBeInTheDocument();
  });

  it('sorts todos correctly by different criteria', async () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');

    // Add todos in a specific order to test sorting
    fireEvent.change(inputElement, { target: { value: 'Zeta Task' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    fireEvent.change(inputElement, { target: { value: 'Alpha Task' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    fireEvent.change(inputElement, { target: { value: 'Beta Task' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    // Helper to get text content of todo items in displayed order
    const getDisplayedTodoTexts = () =>
      screen.getAllByRole('listitem').map(item => item.querySelector('.todo-text').textContent);

    // Default sort is 'newest' (Beta Task, Alpha Task, Zeta Task)
    await waitFor(() => {
      expect(getDisplayedTodoTexts()).toEqual(['Beta Task', 'Alpha Task', 'Zeta Task']);
    });

    const sortSelect = screen.getByRole('combobox', { name: /sort by/i });

    // Sort by 'oldest'
    fireEvent.change(sortSelect, { target: { value: 'oldest' } });
    await waitFor(() => {
      expect(getDisplayedTodoTexts()).toEqual(['Zeta Task', 'Alpha Task', 'Beta Task']);
    });

    // Sort by 'alphabetical'
    fireEvent.change(sortSelect, { target: { value: 'alphabetical' } });
    await waitFor(() => {
      expect(getDisplayedTodoTexts()).toEqual(['Alpha Task', 'Beta Task', 'Zeta Task']);
    });

    // Sort by 'priority' (expected to be 'newest' order if all default to medium priority)
    // This tests the fallback sorting when all priorities are equal.
    fireEvent.change(sortSelect, { target: { value: 'priority' } });
    await waitFor(() => {
      expect(getDisplayedTodoTexts()).toEqual(['Beta Task', 'Alpha Task', 'Zeta Task']);
    });

    // Revert to 'newest' to confirm
    fireEvent.change(sortSelect, { target: { value: 'newest' } });
    await waitFor(() => {
      expect(getDisplayedTodoTexts()).toEqual(['Beta Task', 'Alpha Task', 'Zeta Task']);
    });

    // Test sorting when filters are applied (e.g., sort active todos)

    // Mark 'Alpha Task' as completed (from the initial set)
    fireEvent.click(screen.getByText('Alpha Task'));

    // Switch to 'active' filter
    fireEvent.click(screen.getByRole('button', { name: /active/i }));
    await waitFor(() => {
      // Expected active todos: Beta Task, Zeta Task. Sorted by newest (default sort for this view).
      expect(getDisplayedTodoTexts()).toEqual(['Beta Task', 'Zeta Task']);
    });

    // While in 'active' filter, sort by 'alphabetical'
    fireEvent.change(sortSelect, { target: { value: 'alphabetical' } });
    await waitFor(() => {
      // Active todos: Beta Task, Zeta Task. Alphabetical: Beta Task, Zeta Task.
      expect(getDisplayedTodoTexts()).toEqual(['Beta Task', 'Zeta Task']);
    });

    // While in 'active' filter, sort by 'oldest'
    fireEvent.change(sortSelect, { target: { value: 'oldest' } });
    await waitFor(() => {
      // Active todos: Beta Task, Zeta Task. Oldest: Zeta Task, Beta Task (as Zeta was added first).
      expect(getDisplayedTodoTexts()).toEqual(['Zeta Task', 'Beta Task']);
    });

    // Switch to 'completed' filter
    fireEvent.click(screen.getByRole('button', { name: /completed/i }));
    await waitFor(() => {
      // Only 'Alpha Task' is completed. Regardless of sort, only one item.
      expect(getDisplayedTodoTexts()).toEqual(['Alpha Task']);
    });

    // Switch to 'all' filter and apply alphabetical sort
    fireEvent.click(screen.getByRole('button', { name: /all/i }));
    fireEvent.change(sortSelect, { target: { value: 'alphabetical' } });
    await waitFor(() => {
      // All todos: Alpha Task (completed), Beta Task, Zeta Task
      // Alphabetical order: Alpha Task, Beta Task, Zeta Task
      expect(getDisplayedTodoTexts()).toEqual(['Alpha Task', 'Beta Task', 'Zeta Task']);
    });
  });
});