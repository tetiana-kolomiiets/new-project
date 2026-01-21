import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoItem from '../TodoItem';

describe('TodoItem', () => {
  const mockTodo = { id: 1, text: 'Test Todo', completed: false };
  const mockEditText = 'Edited Todo Text';

  let mockOnToggle,
    mockOnDelete,
    mockOnStartEdit,
    mockOnChangeEditText,
    mockOnSaveEdit,
    mockOnCancelEdit,
    mockOnEditKeyPress;

  beforeEach(() => {
    mockOnToggle = jest.fn();
    mockOnDelete = jest.fn();
    mockOnStartEdit = jest.fn();
    mockOnChangeEditText = jest.fn();
    mockOnSaveEdit = jest.fn();
    mockOnCancelEdit = jest.fn();
    mockOnEditKeyPress = jest.fn();
  });

  const renderComponent = (props = {}) => {
    return render(
      <TodoItem
        todo={mockTodo}
        isEditing={false}
        editText=""
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onStartEdit={mockOnStartEdit}
        onChangeEditText={mockOnChangeEditText}
        onSaveEdit={mockOnSaveEdit}
        onCancelEdit={mockOnCancelEdit}
        onEditKeyPress={mockOnEditKeyPress}
        {...props}
      />
    );
  };

  // --- Display Mode Tests ---

  test('renders todo text and action buttons when not editing', () => {
    renderComponent();
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  test('applies "completed" class when todo is completed', () => {
    renderComponent({ todo: { ...mockTodo, completed: true } });
    const listItem = screen.getByRole('listitem');
    expect(listItem).toHaveClass('todo-item');
    expect(listItem).toHaveClass('completed');
  });

  test('calls onToggle when todo text is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Test Todo'));
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  test('calls onStartEdit when edit button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(mockOnStartEdit).toHaveBeenCalledTimes(1);
    expect(mockOnStartEdit).toHaveBeenCalledWith(mockTodo.id, mockTodo.text);
  });

  test('calls onDelete when delete button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  // --- Editing Mode Tests ---

  test('renders input field and edit action buttons when editing', () => {
    renderComponent({ isEditing: true, editText: mockEditText });
    const inputElement = screen.getByDisplayValue(mockEditText);
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveFocus(); // autoFocus prop
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.queryByText('Test Todo')).not.toBeInTheDocument(); // Original text should not be visible
  });

  test('calls onChangeEditText when input value changes', () => {
    renderComponent({ isEditing: true, editText: mockEditText });
    const inputElement = screen.getByDisplayValue(mockEditText);
    fireEvent.change(inputElement, { target: { value: 'New text' } });
    expect(mockOnChangeEditText).toHaveBeenCalledTimes(1);
    expect(mockOnChangeEditText).toHaveBeenCalledWith('New text');
  });

  test('calls onSaveEdit when save button is clicked', () => {
    renderComponent({ isEditing: true, editText: mockEditText });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(mockOnSaveEdit).toHaveBeenCalledTimes(1);
    expect(mockOnSaveEdit).toHaveBeenCalledWith(mockTodo.id);
  });

  test('calls onCancelEdit when cancel button is clicked', () => {
    renderComponent({ isEditing: true, editText: mockEditText });
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnCancelEdit).toHaveBeenCalledTimes(1);
  });

  test('calls onSaveEdit on blur of input field', () => {
    renderComponent({ isEditing: true, editText: mockEditText });
    const inputElement = screen.getByDisplayValue(mockEditText);
    fireEvent.blur(inputElement);
    expect(mockOnSaveEdit).toHaveBeenCalledTimes(1);
    expect(mockOnSaveEdit).toHaveBeenCalledWith(mockTodo.id);
  });

  test('calls onEditKeyPress on key down in input field (e.g., Enter key)', () => {
    renderComponent({ isEditing: true, editText: mockEditText });
    const inputElement = screen.getByDisplayValue(mockEditText);
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });
    expect(mockOnEditKeyPress).toHaveBeenCalledTimes(1);
    expect(mockOnEditKeyPress).toHaveBeenCalledWith(expect.any(Object), mockTodo.id);
  });

  test('calls onEditKeyPress on key down in input field (e.g., Escape key)', () => {
    renderComponent({ isEditing: true, editText: mockEditText });
    const inputElement = screen.getByDisplayValue(mockEditText);
    fireEvent.keyDown(inputElement, { key: 'Escape', code: 'Escape' });
    expect(mockOnEditKeyPress).toHaveBeenCalledTimes(1);
    expect(mockOnEditKeyPress).toHaveBeenCalledWith(expect.any(Object), mockTodo.id);
  });
});