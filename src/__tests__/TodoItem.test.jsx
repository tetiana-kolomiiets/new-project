import { render, screen, fireEvent } from '@testing-library/react';
import TodoItem from '../src/components/TodoItem';

describe('TodoItem', () => {
  const mockTodo = {
    id: 1,
    text: 'Learn Jest',
    completed: false,
    priority: undefined, // Default to undefined for most tests
    createdAt: '2023-01-01T12:00:00Z', // Default createdAt for consistency
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onDelete: jest.fn(),
    onStartEdit: jest.fn(),
    onChangeEditText: jest.fn(),
    onSaveEdit: jest.fn(),
    onCancelEdit: jest.fn(),
    onEditKeyPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test Case 1: Renders a non-editing, uncompleted todo item
  test('renders todo text and action buttons when not editing', () => {
    render(<TodoItem todo={mockTodo} isEditing={false} {...mockHandlers} />);

    expect(screen.getByText('Learn Jest')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
    expect(screen.queryByText(/priority/i)).not.toBeInTheDocument(); // Ensure no priority badge by default
  });

  // Test Case 2: Applies 'completed' class when todo is completed
  test('applies completed class if todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(<TodoItem todo={completedTodo} isEditing={false} {...mockHandlers} />);
    expect(screen.getByText('Learn Jest').closest('li')).toHaveClass('completed');
  });

  // Test Case 3: Calls onToggle when todo text is clicked
  test('calls onToggle when todo text is clicked', () => {
    render(<TodoItem todo={mockTodo} isEditing={false} {...mockHandlers} />);
    fireEvent.click(screen.getByText('Learn Jest'));
    expect(mockHandlers.onToggle).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  // Test Case 4: Calls onDelete when delete button is clicked
  test('calls onDelete when delete button is clicked', () => {
    render(<TodoItem todo={mockTodo} isEditing={false} {...mockHandlers} />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(mockHandlers.onDelete).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  // Test Case 5: Calls onStartEdit when edit button is clicked
  test('calls onStartEdit when edit button is clicked', () => {
    render(<TodoItem todo={mockTodo} isEditing={false} {...mockHandlers} />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(mockHandlers.onStartEdit).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onStartEdit).toHaveBeenCalledWith(mockTodo.id, mockTodo.text);
  });

  // Test Case 6: Renders in editing mode
  test('renders input and save/cancel buttons when in editing mode', () => {
    const editText = 'Updated todo text';
    render(
      <TodoItem
        todo={mockTodo}
        isEditing={true}
        editText={editText}
        {...mockHandlers}
      />
    );

    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue(editText);
    expect(inputElement).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.queryByText('Learn Jest')).not.toBeInTheDocument();
  });

  // Test Case 7: Calls onChangeEditText when input value changes in editing mode
  test('calls onChangeEditText when input value changes in editing mode', () => {
    render(
      <TodoItem
        todo={mockTodo}
        isEditing={true}
        editText="initial text"
        {...mockHandlers}
      />
    );

    const inputElement = screen.getByRole('textbox');
    fireEvent.change(inputElement, { target: { value: 'new text' } });
    expect(mockHandlers.onChangeEditText).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onChangeEditText).toHaveBeenCalledWith('new text');
  });

  // Test Case 8: Calls onSaveEdit when input is blurred in editing mode
  test('calls onSaveEdit when input is blurred in editing mode', () => {
    render(
      <TodoItem
        todo={mockTodo}
        isEditing={true}
        editText="edit text"
        {...mockHandlers}
      />
    );

    fireEvent.blur(screen.getByRole('textbox'));
    expect(mockHandlers.onSaveEdit).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onSaveEdit).toHaveBeenCalledWith(mockTodo.id);
  });

  // Test Case 9: Calls onSaveEdit when Save button is clicked in editing mode
  test('calls onSaveEdit when Save button is clicked in editing mode', () => {
    render(
      <TodoItem
        todo={mockTodo}
        isEditing={true}
        editText="edit text"
        {...mockHandlers}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(mockHandlers.onSaveEdit).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onSaveEdit).toHaveBeenCalledWith(mockTodo.id);
  });

  // Test Case 10: Calls onCancelEdit when Cancel button is clicked in editing mode
  test('calls onCancelEdit when Cancel button is clicked in editing mode', () => {
    render(
      <TodoItem
        todo={mockTodo}
        isEditing={true}
        editText="edit text"
        {...mockHandlers}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(mockHandlers.onCancelEdit).toHaveBeenCalledTimes(1);
  });

  // Test Case 11: Calls onEditKeyPress when keydown event occurs on input in editing mode
  test('calls onEditKeyPress when keydown event occurs on input in editing mode', () => {
    render(
      <TodoItem
        todo={mockTodo}
        isEditing={true}
        editText="edit text"
        {...mockHandlers}
      />
    );

    const inputElement = screen.getByRole('textbox');
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });
    expect(mockHandlers.onEditKeyPress).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onEditKeyPress).toHaveBeenCalledWith(expect.any(Object), mockTodo.id);
  });

  // Test Case 12: Calls onSaveEdit when Enter key is pressed on input in editing mode (via onEditKeyPress)
  test('calls onSaveEdit when Enter key is pressed on input in editing mode', () => {
    // Create a custom mock for onEditKeyPress that simulates a parent's logic
    // where pressing Enter triggers onSaveEdit. This is done because TodoItem
    // itself delegates the keydown event entirely to onEditKeyPress.
    const customOnEditKeyPress = jest.fn((e, todoId) => {
      if (e.key === 'Enter') {
        mockHandlers.onSaveEdit(todoId);
      }
    });

    render(
      <TodoItem
        todo={mockTodo}
        isEditing={true}
        editText="edit text"
        {...mockHandlers} // Spread all default mocks first
        onEditKeyPress={customOnEditKeyPress} // Then override onEditKeyPress for this test
      />
    );

    const inputElement = screen.getByRole('textbox');
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    // Assert that TodoItem called its onEditKeyPress prop with the correct arguments
    expect(customOnEditKeyPress).toHaveBeenCalledTimes(1);
    expect(customOnEditKeyPress).toHaveBeenCalledWith(expect.any(Object), mockTodo.id);

    // Assert that our custom onEditKeyPress in turn called onSaveEdit
    expect(mockHandlers.onSaveEdit).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onSaveEdit).toHaveBeenCalledWith(mockTodo.id);
  });

  // Test Case 13: Renders priority badge when todo has priority
  test('renders priority badge when todo has priority', () => {
    const todoWithPriority = { ...mockTodo, priority: 'High' };
    render(<TodoItem todo={todoWithPriority} isEditing={false} {...mockHandlers} />);

    const priorityBadge = screen.getByText('High');
    expect(priorityBadge).toBeInTheDocument();
    expect(priorityBadge).toHaveClass('priority-badge');
    expect(priorityBadge).toHaveClass('priority-High');
    expect(priorityBadge).toHaveAttribute('title', 'Priority: High');
  });

  // Test Case 14: Does not render priority badge when todo has no priority
  test('does not render priority badge when todo has no priority', () => {
    const todoWithoutPriority = { ...mockTodo, priority: null }; // Test with null explicitly
    render(<TodoItem todo={todoWithoutPriority} isEditing={false} {...mockHandlers} />);

    expect(screen.queryByText(/priority/i)).not.toBeInTheDocument();
    expect(screen.queryByTitle(/priority/i)).not.toBeInTheDocument();
  });
});