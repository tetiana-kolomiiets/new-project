import { render, screen, fireEvent } from '@testing-library/react';
import TodoApp from '../src/components/TodoApp';

describe('TodoApp', () => {
  it('renders TodoApp component', () => {
    render(<TodoApp />);
    expect(screen.getByText('Todo List')).toBeInTheDocument();
  });

  it('adds a new todo item', () => {
    render(<TodoApp />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    fireEvent.change(inputElement, { target: { value: 'Buy groceries' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  it('toggles a todo item as completed and back to active', () => {
    render(<TodoApp />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    fireEvent.change(inputElement, { target: { value: 'Walk the dog' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    const todoItem = screen.getByText('Walk the dog');
    // Assume TodoItem has 'todo-item' class and 'completed' when completed
    expect(todoItem).not.toHaveClass('completed');

    fireEvent.click(todoItem); // Toggle completion
    expect(todoItem).toHaveClass('completed');

    fireEvent.click(todoItem); // Toggle back to active
    expect(todoItem).not.toHaveClass('completed');
  });

  it('deletes a todo item', () => {
    render(<TodoApp />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    fireEvent.change(inputElement, { target: { value: 'Clean room' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('Clean room')).toBeInTheDocument();

    // Assuming the delete button for a todo item is labeled 'Delete'
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(screen.queryByText('Clean room')).not.toBeInTheDocument();
  });

  it('edits a todo item and saves changes', () => {
    render(<TodoApp />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    fireEvent.change(inputElement, { target: { value: 'Original text' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    // Assuming an edit button for a todo item is labeled 'Edit'
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    // An input field should appear with the original text
    const editInputField = screen.getByDisplayValue('Original text');
    fireEvent.change(editInputField, { target: { value: 'Updated text' } });
    fireEvent.keyDown(editInputField, { key: 'Enter', code: 'Enter' }); // Save with Enter

    expect(screen.queryByText('Original text')).not.toBeInTheDocument();
    expect(screen.getByText('Updated text')).toBeInTheDocument();
  });

  it('edits a todo item and cancels changes', () => {
    render(<TodoApp />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    fireEvent.change(inputElement, { target: { value: 'Original text to cancel' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    const editInputField = screen.getByDisplayValue('Original text to cancel');
    fireEvent.change(editInputField, { target: { value: 'New text that should not be saved' } });
    fireEvent.keyDown(editInputField, { key: 'Escape', code: 'Escape' }); // Cancel with Escape

    expect(screen.getByText('Original text to cancel')).toBeInTheDocument();
    expect(screen.queryByText('New text that should not be saved')).not.toBeInTheDocument();
  });

  it('filters todos by active', () => {
    render(<TodoApp />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');

    // Add an active todo
    fireEvent.change(inputElement, { target: { value: 'Active task' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });
    // Add a completed todo
    fireEvent.change(inputElement, { target: { value: 'Completed task' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });
    fireEvent.click(screen.getByText('Completed task')); // Mark as completed

    // Click 'Active' filter button
    const activeFilterButton = screen.getByRole('button', { name: /active/i });
    fireEvent.click(activeFilterButton);

    expect(screen.getByText('Active task')).toBeInTheDocument();
    expect(screen.queryByText('Completed task')).not.toBeInTheDocument();
  });

  it('filters todos by completed', () => {
    render(<TodoApp />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');

    // Add an active todo
    fireEvent.change(inputElement, { target: { value: 'Another active task' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });
    // Add a completed todo
    fireEvent.change(inputElement, { target: { value: 'Another completed task' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });
    fireEvent.click(screen.getByText('Another completed task')); // Mark as completed

    // Click 'Completed' filter button
    const completedFilterButton = screen.getByRole('button', { name: /completed/i });
    fireEvent.click(completedFilterButton);

    expect(screen.queryByText('Another active task')).not.toBeInTheDocument();
    expect(screen.getByText('Another completed task')).toBeInTheDocument();
  });

  it('filters todos by all', () => {
    render(<TodoApp />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');

    // Add an active todo
    fireEvent.change(inputElement, { target: { value: 'Active task for all' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });
    // Add a completed todo
    fireEvent.change(inputElement, { target: { value: 'Completed task for all' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });
    fireEvent.click(screen.getByText('Completed task for all')); // Mark as completed

    // Filter to completed first
    fireEvent.click(screen.getByRole('button', { name: /completed/i }));
    expect(screen.queryByText('Active task for all')).not.toBeInTheDocument();

    // Click 'All' filter button
    const allFilterButton = screen.getByRole('button', { name: /all/i });
    fireEvent.click(allFilterButton);

    expect(screen.getByText('Active task for all')).toBeInTheDocument();
    expect(screen.getByText('Completed task for all')).toBeInTheDocument();
  });

  it('displays relevant empty messages based on todo state and filter', () => {
    render(<TodoApp />);

    // Initially, no todos exist
    expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument();

    // Add an active todo
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    fireEvent.change(inputElement, { target: { value: 'First todo' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });
    expect(screen.getByText('First todo')).toBeInTheDocument();
    expect(screen.queryByText('No todos yet. Add one above!')).not.toBeInTheDocument();

    // Mark it completed
    fireEvent.click(screen.getByText('First todo'));

    // Filter to active - should show "No active todos!" message
    fireEvent.click(screen.getByRole('button', { name: /active/i }));
    expect(screen.queryByText('First todo')).not.toBeInTheDocument();
    expect(screen.getByText('No active todos!')).toBeInTheDocument();

    // Filter to completed - should show the completed todo and not the empty message for completed
    fireEvent.click(screen.getByRole('button', { name: /completed/i }));
    expect(screen.getByText('First todo')).toBeInTheDocument();
    expect(screen.queryByText('No completed todos!')).not.toBeInTheDocument(); // Message not shown if there are completed todos

    // Delete the todo
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Filter to all - should show "No todos yet. Add one above!" again
    fireEvent.click(screen.getByRole('button', { name: /all/i }));
    expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument();
    expect(screen.queryByText('First todo')).not.toBeInTheDocument();
  });
});