import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoList from '../TodoList';
import TodoItem from '../TodoItem';

// Mock the TodoItem component to control its behavior and inspect its props
jest.mock('../TodoItem', () => {
  return jest.fn((props) => <li data-testid="mock-todo-item" data-todo-id={props.todo.id}>{props.todo.text} (Editing: {props.isEditing ? 'true' : 'false'})</li>);
});

describe('TodoList', () => {
  const defaultProps = {
    emptyMessage: 'No todos yet!',
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
    // Clear mock calls before each test
    TodoItem.mockClear();
    Object.values(defaultProps).forEach(prop => {
      if (typeof prop === 'function') prop.mockClear();
    });
  });

  test('displays empty message when todos list is empty', () => {
    render(<TodoList todos={[]} {...defaultProps} />);
    expect(screen.getByText(defaultProps.emptyMessage)).toBeInTheDocument();
    expect(screen.queryByTestId('mock-todo-item')).not.toBeInTheDocument();
  });

  test('renders a TodoItem for each todo in the list', () => {
    const todos = [
      { id: '1', text: 'Learn Jest', completed: false },
      { id: '2', text: 'Learn RTL', completed: true },
    ];
    render(<TodoList todos={todos} {...defaultProps} />);

    expect(TodoItem).toHaveBeenCalledTimes(todos.length);
    expect(screen.getAllByTestId('mock-todo-item')).toHaveLength(todos.length);

    // Verify the first TodoItem received correct props
    expect(TodoItem).toHaveBeenCalledWith(
      expect.objectContaining({
        todo: todos[0],
        isEditing: false,
        onToggle: defaultProps.onToggle,
        onDelete: defaultProps.onDelete,
      }),
      {}
    );

    // Verify the second TodoItem received correct props
    expect(TodoItem).toHaveBeenCalledWith(
      expect.objectContaining({
        todo: todos[1],
        isEditing: false,
        onToggle: defaultProps.onToggle,
        onDelete: defaultProps.onDelete,
      }),
      {}
    );
  });

  test('passes isEditing=true to the TodoItem being edited', () => {
    const todos = [
      { id: '1', text: 'Learn Jest', completed: false },
      { id: '2', text: 'Learn RTL', completed: true },
    ];
    const editingId = '1';
    render(<TodoList todos={todos} {...defaultProps} editingId={editingId} />);

    expect(TodoItem).toHaveBeenCalledTimes(todos.length);

    // Check the TodoItem with id '1' is in editing mode
    expect(TodoItem).toHaveBeenCalledWith(
      expect.objectContaining({
        todo: todos[0],
        isEditing: true,
        editText: defaultProps.editText,
      }),
      {}
    );

    // Check the TodoItem with id '2' is NOT in editing mode
    expect(TodoItem).toHaveBeenCalledWith(
      expect.objectContaining({
        todo: todos[1],
        isEditing: false,
        editText: defaultProps.editText,
      }),
      {}
    );
  });

  test('passes all necessary callback functions to TodoItem', () => {
    const todos = [{ id: '1', text: 'Test Todo', completed: false }];
    render(<TodoList todos={todos} {...defaultProps} />);

    expect(TodoItem).toHaveBeenCalledWith(
      expect.objectContaining({
        onToggle: defaultProps.onToggle,
        onDelete: defaultProps.onDelete,
        onStartEdit: defaultProps.onStartEdit,
        onChangeEditText: defaultProps.onChangeEditText,
        onSaveEdit: defaultProps.onSaveEdit,
        onCancelEdit: defaultProps.onCancelEdit,
        onEditKeyPress: defaultProps.onEditKeyPress,
      }),
      {}
    );
  });
});