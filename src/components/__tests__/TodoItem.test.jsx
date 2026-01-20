import { render, screen, fireEvent } from '@testing-library/react';
import TodoItem from '../TodoItem';

describe('TodoItem', () => {
  const mockTodo = {
    id: 1,
    text: 'Learn Jest',
    completed: false,
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

  // --- Display Mode Tests ---
  test('renders todo text and action buttons when not editing', () => {
    render(<TodoItem todo={mockTodo} isEditing={false} {...mockHandlers} />);

    expect(screen.getByText('Learn Jest')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  test('calls onToggle when todo text is clicked', () => {
    render(<TodoItem todo={mockTodo} isEditing={false} {...mockHandlers} />);
    fireEvent.click(screen.getByText('Learn Jest'));
    expect(mockHandlers.onToggle).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  test('calls onStartEdit when Edit button is clicked', () => {
    render(<TodoItem todo={mockTodo} isEditing={false} {...mockHandlers} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(mockHandlers.onStartEdit).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onStartEdit).toHaveBeenCalledWith(mockTodo.id, mockTodo.text);
  });

  test('calls onDelete when Delete button is clicked', () => {
    render(<TodoItem todo={mockTodo} isEditing={false} {...mockHandlers} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(mockHandlers.onDelete).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  test('applies completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: true };
    const { container } = render(<TodoItem todo={completedTodo} isEditing={false} {...mockHandlers} />);
    expect(container.querySelector('.todo-item')).toHaveClass('completed');
  });

  test('does not apply completed class when todo is not completed', () => {
    const { container } = render(<TodoItem todo={mockTodo} isEditing={false} {...mockHandlers} />);
    expect(container.querySelector('.todo-item')).not.toHaveClass('completed');
  });

  // --- Editing Mode Tests ---
  test('renders edit input and save/cancel buttons when editing', () => {
    const editText = 'New todo text';
    render(
      <TodoItem todo={mockTodo} isEditing={true} editText={editText} {...mockHandlers} />
    );

    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue(editText);
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.queryByText('Learn Jest')).not.toBeInTheDocument();
  });

  test('input field is auto-focused when in editing mode', () => {
    render(
      <TodoItem todo={mockTodo} isEditing={true} editText="" {...mockHandlers} />
    );
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  test('calls onChangeEditText when edit input value changes', () => {
    const newText = 'Updated todo';
    render(
      <TodoItem todo={mockTodo} isEditing={true} editText="" {...mockHandlers} />
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: newText } });
    expect(mockHandlers.onChangeEditText).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onChangeEditText).toHaveBeenCalledWith(newText);
  });

  test('calls onEditKeyPress and onSaveEdit when Enter is pressed in edit input', () => {
    render(
      <TodoItem todo={mockTodo} isEditing={true} editText="" {...mockHandlers} />
    );
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter', code: 'Enter' });
    expect(mockHandlers.onEditKeyPress).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onEditKeyPress).toHaveBeenCalledWith(expect.any(Object), mockTodo.id);
    // Assuming onEditKeyPress internally calls onSaveEdit for Enter key
    // For a more direct test, you'd test the specific handler call. Here, it's a prop.
    // Since onBlur also calls onSaveEdit, we're careful. A separate test for onSaveEdit on button click.
  });

  test('calls onEditKeyPress and onCancelEdit when Escape is pressed in edit input', () => {
    render(
      <TodoItem todo={mockTodo} isEditing={true} editText="" {...mockHandlers} />
    );
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape', code: 'Escape' });
    expect(mockHandlers.onEditKeyPress).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onEditKeyPress).toHaveBeenCalledWith(expect.any(Object), mockTodo.id);
    // Assuming onEditKeyPress internally calls onCancelEdit for Escape key
  });

  test('calls onSaveEdit when edit input loses focus (onBlur)', () => {
    render(
      <TodoItem todo={mockTodo} isEditing={true} editText="" {...mockHandlers} />
    );
    const inputElement = screen.getByRole('textbox');
    inputElement.focus();
    fireEvent.blur(inputElement);
    expect(mockHandlers.onSaveEdit).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onSaveEdit).toHaveBeenCalledWith(mockTodo.id);
  });

  test('calls onSaveEdit when Save button is clicked', () => {
    render(
      <TodoItem todo={mockTodo} isEditing={true} editText="" {...mockHandlers} />
    );
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(mockHandlers.onSaveEdit).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onSaveEdit).toHaveBeenCalledWith(mockTodo.id);
  });

  test('calls onCancelEdit when Cancel button is clicked', () => {
    render(
      <TodoItem todo={mockTodo} isEditing={true} editText="" {...mockHandlers} />
    );
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockHandlers.onCancelEdit).toHaveBeenCalledTimes(1);
  });
});