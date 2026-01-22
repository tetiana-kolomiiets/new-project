import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoList from '../src/components/TodoList';

describe('TodoList', () => {
  const defaultProps = {
    emptyMessage: 'No tasks yet!',
    editingId: null,
    editText: '',
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

  it('renders an empty message when no todos are provided', () => {
    render(<TodoList {...defaultProps} todos={[]} />);

    expect(screen.getByText('No tasks yet!')).toBeInTheDocument();
    // Verify that only the empty state list item is present
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.queryByText('Walk dog')).not.toBeInTheDocument();
  });

  it('renders a list of TodoItems when todos are provided', () => {
    const todos = [
      { id: '1', text: 'Walk dog', completed: false },
      { id: '2', text: 'Buy groceries', completed: true },
    ];

    render(<TodoList {...defaultProps} todos={todos} />);

    expect(screen.getByText('Walk dog')).toBeInTheDocument();
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    // Verify that two todo list items are present
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.queryByText('No tasks yet!')).not.toBeInTheDocument();
  });

  it('calls onToggle with the correct ID when a todo item toggle button is clicked', () => {
    const todos = [
      { id: '1', text: 'Walk dog', completed: false },
    ];
    const mockOnToggle = jest.fn();

    render(<TodoList {...defaultProps} todos={todos} onToggle={mockOnToggle} />);

    const toggleButton = screen.getByRole('button', { name: /toggle/i });
    fireEvent.click(toggleButton);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnToggle).toHaveBeenCalledWith('1');
  });

  it('calls onDelete with the correct ID when a todo item delete button is clicked', () => {
    const todos = [
      { id: '1', text: 'Walk dog', completed: false },
    ];
    const mockOnDelete = jest.fn();

    render(<TodoList {...defaultProps} todos={todos} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('calls onStartEdit with the correct ID and text when an edit button is clicked', () => {
    const todos = [
      { id: '1', text: 'Walk dog', completed: false },
    ];
    const mockOnStartEdit = jest.fn();

    render(<TodoList {...defaultProps} todos={todos} onStartEdit={mockOnStartEdit} />);

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    expect(mockOnStartEdit).toHaveBeenCalledTimes(1);
    expect(mockOnStartEdit).toHaveBeenCalledWith('1', 'Walk dog');
  });

  it('calls onChangeEditText when the edit input value changes during editing', () => {
    const todos = [
      { id: '1', text: 'Walk dog', completed: false },
    ];
    const mockOnChangeEditText = jest.fn();

    render(
      <TodoList
        {...defaultProps}
        todos={todos}
        editingId="1" // Simulate editing state
        editText="Walk dog"
        onChangeEditText={mockOnChangeEditText}
      />
    );

    const editInput = screen.getByDisplayValue('Walk dog');
    fireEvent.change(editInput, { target: { value: 'Walk the doggo' } });

    expect(mockOnChangeEditText).toHaveBeenCalledTimes(1);
    // The onChangeEditText prop expects an event object
    expect(mockOnChangeEditText).toHaveBeenCalledWith(expect.any(Object));
  });

  it('calls onSaveEdit with the correct ID and text when the save button is clicked', () => {
    const todos = [
      { id: '1', text: 'Walk dog', completed: false },
    ];
    const mockOnSaveEdit = jest.fn();
    const currentEditText = 'Walk the doggo';

    render(
      <TodoList
        {...defaultProps}
        todos={todos}
        editingId="1" // Simulate editing state
        editText={currentEditText}
        onSaveEdit={mockOnSaveEdit}
      />
    );

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    expect(mockOnSaveEdit).toHaveBeenCalledTimes(1);
    expect(mockOnSaveEdit).toHaveBeenCalledWith('1', currentEditText);
  });

  it('calls onCancelEdit when the cancel button is clicked during editing', () => {
    const todos = [
      { id: '1', text: 'Walk dog', completed: false },
    ];
    const mockOnCancelEdit = jest.fn();

    render(
      <TodoList
        {...defaultProps}
        todos={todos}
        editingId="1" // Simulate editing state
        editText="Walk dog"
        onCancelEdit={mockOnCancelEdit}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancelEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onEditKeyPress when a key is pressed in the edit input during editing', () => {
    const todos = [
      { id: '1', text: 'Walk dog', completed: false },
    ];
    const mockOnEditKeyPress = jest.fn();
    const currentEditText = 'Walk dog';

    render(
      <TodoList
        {...defaultProps}
        todos={todos}
        editingId="1" // Simulate editing state
        editText={currentEditText}
        onEditKeyPress={mockOnEditKeyPress}
      />
    );

    const editInput = screen.getByDisplayValue(currentEditText);
    fireEvent.keyPress(editInput, { key: 'Enter', code: 'Enter' });

    expect(mockOnEditKeyPress).toHaveBeenCalledTimes(1);
    // The onEditKeyPress prop expects an event object, id, and text
    expect(mockOnEditKeyPress).toHaveBeenCalledWith(expect.any(Object), '1', currentEditText);
  });

  it('renders the ul element with the "todo-list" class name when todos are present', () => {
    const todos = [
      { id: '1', text: 'Walk dog', completed: false },
    ];
    render(<TodoList {...defaultProps} todos={todos} />);

    const todoListElement = screen.getByRole('list');
    expect(todoListElement).toHaveClass('todo-list');
  });

  it('renders the ul element with the "todo-list" class name when no todos are present', () => {
    render(<TodoList {...defaultProps} todos={[]} />);

    const todoListElement = screen.getByRole('list');
    expect(todoListElement).toHaveClass('todo-list');
  });
});