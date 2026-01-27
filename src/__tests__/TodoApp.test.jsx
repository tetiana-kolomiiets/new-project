import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../components/TodoApp';
import '@testing-library/jest-dom';

describe('TodoApp', () => {
  // Clear localStorage before each test to ensure a clean state
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders TodoApp component', () => {
    render(<App />);
    expect(screen.getByText('Todo List')).toBeInTheDocument();
  });

  it('displays the correct number of todos', () => {
    render(<App />);

    // Initial state: 0 todos
    expect(screen.getByText('0 items left')).toBeInTheDocument();

    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    fireEvent.change(inputElement, { target: { value: 'First todo' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    // After adding one todo
    expect(screen.getByText('1 item left')).toBeInTheDocument();

    fireEvent.change(inputElement, { target: { value: 'Second todo' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    // After adding two todos
    expect(screen.getByText('2 items left')).toBeInTheDocument();

    // Delete one todo
    const firstTodoContainer = screen.getByText('First todo').closest('.todo-item');
    const deleteButton = firstTodoContainer.querySelector('[aria-label="Delete todo"]');
    fireEvent.click(deleteButton);

    // After deleting one todo
    expect(screen.getByText('1 item left')).toBeInTheDocument();
  });

  it('adds a new todo item', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    fireEvent.change(inputElement, { target: { value: 'Buy groceries' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  it('does not add an empty todo item', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    
    // Attempt to add an empty string
    fireEvent.change(inputElement, { target: { value: '' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument(); // No list items should be present
    expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument(); // Empty message should still be there

    // Attempt to add only whitespace
    fireEvent.change(inputElement, { target: { value: '   ' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument();
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

  it('does not save an empty or whitespace-only edit to a todo item', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    fireEvent.change(inputElement, { target: { value: 'Task to edit' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    const todoItem = screen.getByText('Task to edit');
    const editButton = todoItem.closest('.todo-item').querySelector('[aria-label="Edit todo"]');
    fireEvent.click(editButton);

    const editInputField = screen.getByDisplayValue('Task to edit');

    // Attempt to save an empty string
    fireEvent.change(editInputField, { target: { value: '' } });
    fireEvent.keyDown(editInputField, { key: 'Enter', code: 'Enter' });
    expect(screen.getByText('Task to edit')).toBeInTheDocument(); // Original text should still be there
    expect(screen.queryByDisplayValue('')).not.toBeInTheDocument(); // The edit input should be gone

    // Re-enter edit mode for whitespace test
    fireEvent.click(editButton); // The edit button should be visible again after the previous save attempt
    const secondEditInputField = screen.getByDisplayValue('Task to edit');
    fireEvent.change(secondEditInputField, { target: { value: '   ' } }); // Attempt to save only whitespace
    fireEvent.keyDown(secondEditInputField, { key: 'Enter', code: 'Enter' });
    expect(screen.getByText('Task to edit')).toBeInTheDocument(); // Original text should still be there
    expect(screen.queryByDisplayValue('   ')).not.toBeInTheDocument();
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
});