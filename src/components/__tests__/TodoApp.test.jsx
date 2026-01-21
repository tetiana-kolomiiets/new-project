import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../TodoApp'; // The component to test

describe('TodoApp', () => {
  // Test 1: Renders the main components
  test('renders the TodoApp component with heading, input, and filters', () => {
    render(<App />);
    expect(screen.getByText('Todo List')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a new todo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Todo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /All/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Active/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Completed/i })).toBeInTheDocument();
  });

  // Test 2: Adds a new todo
  test('allows users to add a new todo', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Add a new todo');
    const addButton = screen.getByRole('button', { name: /Add Todo/i });

    fireEvent.change(inputElement, { target: { value: 'Learn Jest' } });
    fireEvent.click(addButton);

    expect(screen.getByText('Learn Jest')).toBeInTheDocument();
    expect(inputElement).toHaveValue(''); // Input should be cleared
  });

  // Test 3: Toggles a todo completion status
  test('toggles a todo completion status', async () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Add a new todo');
    const addButton = screen.getByRole('button', { name: /Add Todo/i });

    fireEvent.change(inputElement, { target: { value: 'Task to toggle' } });
    fireEvent.click(addButton);

    const todoText = screen.getByText('Task to toggle');
    const todoItem = todoText.closest('li');
    const checkbox = within(todoItem).getByRole('checkbox'); // Find checkbox within the list item

    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    // Verify filtering based on completion status
    fireEvent.click(screen.getByRole('button', { name: /Completed/i }));
    expect(screen.getByText('Task to toggle')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Active/i }));
    expect(screen.queryByText('Task to toggle')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /All/i }));
    expect(screen.getByText('Task to toggle')).toBeInTheDocument();

    fireEvent.click(checkbox); // Toggle back
    expect(checkbox).not.toBeChecked();

    fireEvent.click(screen.getByRole('button', { name: /Active/i }));
    expect(screen.getByText('Task to toggle')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Completed/i }));
    expect(screen.queryByText('Task to toggle')).not.toBeInTheDocument();
  });

  // Test 4: Deletes a todo from the list
  test('deletes a todo from the list', async () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Add a new todo');
    const addButton = screen.getByRole('button', { name: /Add Todo/i });

    fireEvent.change(inputElement, { target: { value: 'Task to delete' } });
    fireEvent.click(addButton);

    expect(screen.getByText('Task to delete')).toBeInTheDocument();

    const todoItem = screen.getByText('Task to delete').closest('li');
    const deleteButton = within(todoItem).getByRole('button', { name: /Delete/i });

    fireEvent.click(deleteButton);

    expect(screen.queryByText('Task to delete')).not.toBeInTheDocument();
    expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument(); // Check empty message
  });

  // Test 5: Edits a todo item
  test('edits a todo item', async () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Add a new todo');
    const addButton = screen.getByRole('button', { name: /Add Todo/i });

    fireEvent.change(inputElement, { target: { value: 'Original Text' } });
    fireEvent.click(addButton);

    const todoText = screen.getByText('Original Text');
    expect(todoText).toBeInTheDocument();

    const todoItem = todoText.closest('li');
    const editButton = within(todoItem).getByRole('button', { name: /Edit/i });

    fireEvent.click(editButton);

    const editInput = within(todoItem).getByDisplayValue('Original Text');
    expect(editInput).toBeInTheDocument();

    fireEvent.change(editInput, { target: { value: 'Updated Text' } });
    fireEvent.click(within(todoItem).getByRole('button', { name: /Save/i }));

    expect(screen.queryByText('Original Text')).not.toBeInTheDocument();
    expect(screen.getByText('Updated Text')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('Updated Text')).not.toBeInTheDocument(); // Edit input should be gone
  });

  // Test 6: Cancels todo editing
  test('cancels todo editing', async () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Add a new todo');
    const addButton = screen.getByRole('button', { name: /Add Todo/i });

    fireEvent.change(inputElement, { target: { value: 'Task to cancel edit' } });
    fireEvent.click(addButton);

    const todoText = screen.getByText('Task to cancel edit');
    const todoItem = todoText.closest('li');
    const editButton = within(todoItem).getByRole('button', { name: /Edit/i });

    fireEvent.click(editButton);

    const editInput = within(todoItem).getByDisplayValue('Task to cancel edit');
    fireEvent.change(editInput, { target: { value: 'Attempted change' } });

    fireEvent.click(within(todoItem).getByRole('button', { name: /Cancel/i }));

    expect(screen.getByText('Task to cancel edit')).toBeInTheDocument();
    expect(screen.queryByText('Attempted change')).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue('Attempted change')).not.toBeInTheDocument();
  });

  // Test 7: Filters todos correctly
  test('filters todos correctly', async () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Add a new todo');
    const addButton = screen.getByRole('button', { name: /Add Todo/i });

    // Add todos
    fireEvent.change(inputElement, { target: { value: 'Buy groceries' } });
    fireEvent.click(addButton);
    fireEvent.change(inputElement, { target: { value: 'Walk the dog' } });
    fireEvent.click(addButton);
    fireEvent.change(inputElement, { target: { value: 'Pay bills' } });
    fireEvent.click(addButton);

    // Complete 'Buy groceries'
    const groceriesTodo = screen.getByText('Buy groceries');
    const groceriesCheckbox = within(groceriesTodo.closest('li')).getByRole('checkbox');
    fireEvent.click(groceriesCheckbox);

    // Check All filter (default)
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.getByText('Walk the dog')).toBeInTheDocument();
    expect(screen.getByText('Pay bills')).toBeInTheDocument();

    // Click Active filter
    fireEvent.click(screen.getByRole('button', { name: /Active/i }));
    expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument();
    expect(screen.getByText('Walk the dog')).toBeInTheDocument();
    expect(screen.getByText('Pay bills')).toBeInTheDocument();

    // Click Completed filter
    fireEvent.click(screen.getByRole('button', { name: /Completed/i }));
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.queryByText('Walk the dog')).not.toBeInTheDocument();
    expect(screen.queryByText('Pay bills')).not.toBeInTheDocument();

    // Click All filter again
    fireEvent.click(screen.getByRole('button', { name: /All/i }));
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.getByText('Walk the dog')).toBeInTheDocument();
    expect(screen.getByText('Pay bills')).toBeInTheDocument();
  });

  // Test 8: Displays empty message when no todos are present
  test('displays empty message when no todos are present', () => {
    render(<App />);
    expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument();
  });

  // Test 9: Displays appropriate empty messages for active/completed filters
  test('displays appropriate empty messages for active/completed filters', async () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Add a new todo');
    const addButton = screen.getByRole('button', { name: /Add Todo/i });

    fireEvent.change(inputElement, { target: { value: 'Only completed' } });
    fireEvent.click(addButton);

    // Complete the todo
    const todoText = screen.getByText('Only completed');
    const itemCheckbox = within(todoText.closest('li')).getByRole('checkbox');
    fireEvent.click(itemCheckbox);

    // Check Active filter: should show 'No active todos!'
    fireEvent.click(screen.getByRole('button', { name: /Active/i }));
    expect(screen.getByText('No active todos!')).toBeInTheDocument();
    expect(screen.queryByText('Only completed')).not.toBeInTheDocument();

    // Check Completed filter: should show the completed todo
    fireEvent.click(screen.getByRole('button', { name: /Completed/i }));
    expect(screen.queryByText('No completed todos!')).not.toBeInTheDocument(); // Should not show empty message
    expect(screen.getByText('Only completed')).toBeInTheDocument();

    // Delete the completed todo
    const deleteButton = within(screen.getByText('Only completed').closest('li')).getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton);

    // Now in Completed filter, no todos, so 'No completed todos!' should appear
    expect(screen.getByText('No completed todos!')).toBeInTheDocument();

    // Go back to All filter, should show default empty message
    fireEvent.click(screen.getByRole('button', { name: /All/i }));
    expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument();
  });

  // Test 10: Saves edit on Enter key press
  test('saves edit on Enter key press', async () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Add a new todo');
    const addButton = screen.getByRole('button', { name: /Add Todo/i });

    fireEvent.change(inputElement, { target: { value: 'Edit with Enter' } });
    fireEvent.click(addButton);

    const todoText = screen.getByText('Edit with Enter');
    const todoItem = todoText.closest('li');
    const editButton = within(todoItem).getByRole('button', { name: /Edit/i });

    fireEvent.click(editButton);

    const editInput = within(todoItem).getByDisplayValue('Edit with Enter');
    fireEvent.change(editInput, { target: { value: 'Edited by Enter' } });
    fireEvent.keyDown(editInput, { key: 'Enter', code: 'Enter' });

    expect(screen.queryByText('Edit with Enter')).not.toBeInTheDocument();
    expect(screen.getByText('Edited by Enter')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('Edited by Enter')).not.toBeInTheDocument();
  });

  // Test 11: Cancels edit on Escape key press
  test('cancels edit on Escape key press', async () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText('Add a new todo');
    const addButton = screen.getByRole('button', { name: /Add Todo/i });

    fireEvent.change(inputElement, { target: { value: 'Cancel with Escape' } });
    fireEvent.click(addButton);

    const todoText = screen.getByText('Cancel with Escape');
    const todoItem = todoText.closest('li');
    const editButton = within(todoItem).getByRole('button', { name: /Edit/i });

    fireEvent.click(editButton);

    const editInput = within(todoItem).getByDisplayValue('Cancel with Escape');
    fireEvent.change(editInput, { target: { value: 'Attempted change by Escape' } });
    fireEvent.keyDown(editInput, { key: 'Escape', code: 'Escape' });

    expect(screen.getByText('Cancel with Escape')).toBeInTheDocument();
    expect(screen.queryByText('Attempted change by Escape')).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue('Attempted change by Escape')).not.toBeInTheDocument();
  });
});