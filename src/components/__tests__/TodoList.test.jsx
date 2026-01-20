import { render, screen } from '@testing-library/react';
import TodoList from '../TodoList';

describe('TodoList', () => {
  const mockTodos = [
    { id: '1', title: 'Buy groceries', completed: false },
    { id: '2', title: 'Walk the dog', completed: true },
  ];

  const mockProps = {
    onToggle: jest.fn(),
    onDelete: jest.fn(),
    onStartEdit: jest.fn(),
    onChangeEditText: jest.fn(),
    onSaveEdit: jest.fn(),
    onCancelEdit: jest.fn(),
    onEditKeyPress: jest.fn(),
    editingId: null,
    editText: '',
    emptyMessage: 'No todos yet!',
  };

  it('renders the empty message when no todos are provided', () => {
    render(<TodoList todos={[]} {...mockProps} />);

    expect(screen.getByText(mockProps.emptyMessage)).toBeInTheDocument();
    expect(screen.getByRole('list')).toHaveClass('todo-list');
    // Assuming the empty state is rendered as a list item within the ul
    expect(screen.getByRole('listitem')).toHaveClass('empty-state');
  });

  it('renders a list of todo items when todos are provided', () => {
    render(<TodoList todos={mockTodos} {...mockProps} />);

    expect(screen.getByRole('list')).toHaveClass('todo-list');

    // Check if each todo's title is rendered
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.getByText('Walk the dog')).toBeInTheDocument();

    // Verify the correct number of list items (TodoItems) are rendered
    // We expect each TodoItem to render a list item.
    const todoListItems = screen.getAllByRole('listitem');
    expect(todoListItems).toHaveLength(mockTodos.length);

    // Ensure the empty message is not present
    expect(screen.queryByText(mockProps.emptyMessage)).not.toBeInTheDocument();
  });

  it('renders a todo item in editing state correctly', () => {
    const todoToEdit = { id: '1', title: 'Buy groceries', completed: false };
    const newEditText = 'Buy milk and bread';
    const todosWithOneEditing = [todoToEdit, mockTodos[1]];

    render(
      <TodoList
        todos={todosWithOneEditing}
        editingId={todoToEdit.id}
        editText={newEditText}
        {...mockProps}
      />
    );

    // Assume TodoItem renders an input field with the editText when in editing mode.
    const editingInput = screen.getByDisplayValue(newEditText);
    expect(editingInput).toBeInTheDocument();
    expect(editingInput).toHaveAttribute('type', 'text'); // Assuming a text input

    // The original title of the editing todo should not be visible if replaced by an input
    expect(screen.queryByText(todoToEdit.title)).not.toBeInTheDocument();

    // The other todo's original title should still be visible
    expect(screen.getByText('Walk the dog')).toBeInTheDocument();
  });
});