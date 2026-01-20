import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../TodoApp';

describe('TodoApp', () => {
  const setup = () => {
    const user = userEvent.setup();
    render(<App />);
    const todoInput = screen.getByPlaceholderText(/Add a new todo/i);
    const addTodoButton = screen.getByRole('button', { name: /Add Todo/i });
    return { user, todoInput, addTodoButton };
  };

  it('should allow users to add new todos', async () => {
    const { user, todoInput, addTodoButton } = setup();

    await user.type(todoInput, 'Learn React Testing Library');
    await user.click(addTodoButton);

    expect(screen.getByText('Learn React Testing Library')).toBeInTheDocument();
    expect(todoInput).toHaveValue(''); // Input should clear after adding
  });

  it('should allow users to toggle a todo as completed and incomplete', async () => {
    const { user, todoInput, addTodoButton } = setup();

    await user.type(todoInput, 'Learn Testing');
    await user.click(addTodoButton);

    const todoItem = screen.getByText('Learn Testing');
    expect(todoItem).toBeInTheDocument();

    // Toggle to completed
    await user.click(todoItem); // Click the todo text to toggle

    // Check filter: Completed
    await user.click(screen.getByRole('button', { name: /Completed/i }));
    expect(todoItem).toBeInTheDocument(); // Should be visible in completed filter

    // Check filter: Active
    await user.click(screen.getByRole('button', { name: /Active/i }));
    expect(todoItem).not.toBeInTheDocument(); // Should not be visible in active filter

    // Check filter: All
    await user.click(screen.getByRole('button', { name: /All/i }));
    expect(todoItem).toBeInTheDocument(); // Should be visible in all filter

    // Toggle back to incomplete
    await user.click(todoItem); // Click the todo text again

    // Check filter: Active
    await user.click(screen.getByRole('button', { name: /Active/i }));
    expect(todoItem).toBeInTheDocument(); // Should be visible in active filter

    // Check filter: Completed
    await user.click(screen.getByRole('button', { name: /Completed/i }));
    expect(todoItem).not.toBeInTheDocument(); // Should not be visible in completed filter
  });

  it('should allow users to delete a todo', async () => {
    const { user, todoInput, addTodoButton } = setup();

    await user.type(todoInput, 'Task to be deleted');
    await user.click(addTodoButton);

    const todoItem = screen.getByText('Task to be deleted');
    expect(todoItem).toBeInTheDocument();

    // Find the delete button associated with this todo item
    const listItem = todoItem.closest('li') || todoItem.parentElement; // Find parent element that contains the delete button
    const deleteButton = within(listItem).getByRole('button', { name: /Delete/i }); // Assuming button text is 'Delete'

    await user.click(deleteButton);

    expect(todoItem).not.toBeInTheDocument();
  });

  it('should filter todos based on their completion status', async () => {
    const { user, todoInput, addTodoButton } = setup();

    // Add two todos
    await user.type(todoInput, 'Active Task');
    await user.click(addTodoButton);
    await user.type(todoInput, 'Completed Task');
    await user.click(addTodoButton);

    const activeTask = screen.getByText('Active Task');
    const completedTask = screen.getByText('Completed Task');

    // Mark 'Completed Task' as completed
    await user.click(completedTask);

    // Filter by Active
    await user.click(screen.getByRole('button', { name: /Active/i }));
    expect(activeTask).toBeInTheDocument();
    expect(completedTask).not.toBeInTheDocument(); // Completed task should not be visible

    // Filter by Completed
    await user.click(screen.getByRole('button', { name: /Completed/i }));
    expect(completedTask).toBeInTheDocument();
    expect(activeTask).not.toBeInTheDocument(); // Active task should not be visible

    // Filter by All
    await user.click(screen.getByRole('button', { name: /All/i }));
    expect(activeTask).toBeInTheDocument();
    expect(completedTask).toBeInTheDocument();
  });

  it('should allow users to edit a todo item', async () => {
    const { user, todoInput, addTodoButton } = setup();

    await user.type(todoInput, 'Original Todo Text');
    await user.click(addTodoButton);

    const originalTodoItem = screen.getByText('Original Todo Text');
    expect(originalTodoItem).toBeInTheDocument();

    // Find the edit button for this specific todo item
    const listItem = originalTodoItem.closest('li') || originalTodoItem.parentElement;
    const editButton = within(listItem).getByRole('button', { name: /Edit/i }); // Assuming button text is 'Edit'

    await user.click(editButton);

    // An input field should appear, and the original text element might disappear or change role
    const editInputField = screen.getByDisplayValue('Original Todo Text'); // Look for an input with the current value
    await user.clear(editInputField);
    await user.type(editInputField, 'Updated Todo Text');

    const saveButton = within(listItem).getByRole('button', { name: /Save/i }); // Assuming button text is 'Save'
    await user.click(saveButton);

    expect(screen.getByText('Updated Todo Text')).toBeInTheDocument();
    expect(originalTodoItem).not.toBeInTheDocument(); // Original text should be gone
  });

  it('should allow users to cancel editing a todo item', async () => {
    const { user, todoInput, addTodoButton } = setup();

    await user.type(todoInput, 'Cancel Edit Test');
    await user.click(addTodoButton);

    const todoItem = screen.getByText('Cancel Edit Test');
    const listItem = todoItem.closest('li') || todoItem.parentElement;
    const editButton = within(listItem).getByRole('button', { name: /Edit/i });

    await user.click(editButton);

    const editInputField = screen.getByDisplayValue('Cancel Edit Test');
    await user.clear(editInputField);
    await user.type(editInputField, 'This text should not be saved');

    const cancelButton = within(listItem).getByRole('button', { name: /Cancel/i }); // Assuming button text is 'Cancel'
    await user.click(cancelButton);

    expect(screen.getByText('Cancel Edit Test')).toBeInTheDocument();
    expect(screen.queryByText('This text should not be saved')).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue('This text should not be saved')).not.toBeInTheDocument();
  });

  it('should save edit on Enter key press', async () => {
    const { user, todoInput, addTodoButton } = setup();

    await user.type(todoInput, 'Edit with Enter');
    await user.click(addTodoButton);

    const todoItem = screen.getByText('Edit with Enter');
    const listItem = todoItem.closest('li') || todoItem.parentElement;
    const editButton = within(listItem).getByRole('button', { name: /Edit/i });

    await user.click(editButton);

    const editInputField = screen.getByDisplayValue('Edit with Enter');
    await user.clear(editInputField);
    await user.type(editInputField, 'Saved with Enter{enter}');

    expect(screen.getByText('Saved with Enter')).toBeInTheDocument();
    expect(screen.queryByText('Edit with Enter')).not.toBeInTheDocument();
  });

  it('should cancel edit on Escape key press', async () => {
    const { user, todoInput, addTodoButton } = setup();

    await user.type(todoInput, 'Edit with Escape');
    await user.click(addTodoButton);

    const todoItem = screen.getByText('Edit with Escape');
    const listItem = todoItem.closest('li') || todoItem.parentElement;
    const editButton = within(listItem).getByRole('button', { name: /Edit/i });

    await user.click(editButton);

    const editInputField = screen.getByDisplayValue('Edit with Escape');
    await user.clear(editInputField);
    await user.type(editInputField, 'Not saved with Escape{escape}');

    expect(screen.getByText('Edit with Escape')).toBeInTheDocument();
    expect(screen.queryByText('Not saved with Escape')).not.toBeInTheDocument();
  });

  it('should allow editing one todo at a time, overwriting previous edit intention', async () => {
    const { user, todoInput, addTodoButton } = setup();

    await user.type(todoInput, 'Todo A');
    await user.click(addTodoButton);
    await user.type(todoInput, 'Todo B');
    await user.click(addTodoButton);

    const todoA = screen.getByText('Todo A');
    const todoB = screen.getByText('Todo B');

    const listItemA = todoA.closest('li') || todoA.parentElement;
    const editButtonA = within(listItemA).getByRole('button', { name: /Edit/i });

    const listItemB = todoB.closest('li') || todoB.parentElement;
    const editButtonB = within(listItemB).getByRole('button', { name: /Edit/i });

    // Start editing Todo A
    await user.click(editButtonA);
    expect(screen.getByDisplayValue('Todo A')).toBeInTheDocument();

    // Start editing Todo B (this should implicitly cancel edit for Todo A)
    await user.click(editButtonB);

    // Now Todo B should be in edit mode
    expect(screen.getByDisplayValue('Todo B')).toBeInTheDocument();
    // Todo A should no longer be in edit mode, it should be back to display text
    expect(screen.queryByDisplayValue('Todo A')).not.toBeInTheDocument();
    expect(screen.getByText('Todo A')).toBeInTheDocument(); // Ensure Todo A text is visible (not in edit input)

    // Clean up: save Todo B edit
    const editInputFieldB = screen.getByDisplayValue('Todo B');
    await user.type(editInputFieldB, ' B edited{enter}');
    expect(screen.getByText('Todo B edited')).toBeInTheDocument();
  });

  it('should not allow toggling a todo while it is being edited', async () => {
    const { user, todoInput, addTodoButton } = setup();

    await user.type(todoInput, 'Editable Todo');
    await user.click(addTodoButton);

    const todoItem = screen.getByText('Editable Todo');
    const listItem = todoItem.closest('li') || todoItem.parentElement;
    const editButton = within(listItem).getByRole('button', { name: /Edit/i });

    // Start editing
    await user.click(editButton);
    const editInputField = screen.getByDisplayValue('Editable Todo');
    expect(editInputField).toBeInTheDocument();

    // Try to toggle while editing by clicking the todo text
    await user.click(todoItem); // This click should not toggle the completion status

    // Assert it's still active (not completed) by checking the 'Completed' filter
    await user.click(screen.getByRole('button', { name: /Completed/i }));
    expect(screen.queryByText('Editable Todo')).not.toBeInTheDocument(); // Should not be in completed filter

    await user.click(screen.getByRole('button', { name: /Active/i }));
    expect(editInputField).toBeInTheDocument(); // Should still be in edit mode and active

    // Cancel edit to allow toggling normally later
    const cancelButton = within(listItem).getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);

    // Now it should be toggleable: toggle to completed
    await user.click(todoItem); 
    await user.click(screen.getByRole('button', { name: /Completed/i }));
    expect(screen.getByText('Editable Todo')).toBeInTheDocument(); // Now it should be in completed filter
  });

  it('should display correct empty messages based on filter and todo status', async () => {
    const { user, todoInput, addTodoButton } = setup();

    // Initial state: No todos
    expect(screen.getByText(/No todos yet\. Add one above!/i)).toBeInTheDocument();

    // Add a todo, it's active by default
    await user.type(todoInput, 'Single Active Todo');
    await user.click(addTodoButton);
    expect(screen.queryByText(/No todos yet\. Add one above!/i)).not.toBeInTheDocument(); // Message should disappear

    const activeTodo = screen.getByText('Single Active Todo');

    // Filter to 'All' - should not show empty message as there's a todo
    await user.click(screen.getByRole('button', { name: /All/i }));
    expect(screen.queryByText(/No todos yet\. Add one above!/i)).not.toBeInTheDocument();
    expect(activeTodo).toBeInTheDocument();

    // Filter to 'Active' - should not show empty message as there's an active todo
    await user.click(screen.getByRole('button', { name: /Active/i }));
    expect(screen.queryByText(/No active todos!/i)).not.toBeInTheDocument();
    expect(activeTodo).toBeInTheDocument();

    // Filter to 'Completed' - should show 'No completed todos!' as there are none
    await user.click(screen.getByRole('button', { name: /Completed/i }));
    expect(screen.getByText('No completed todos!')).toBeInTheDocument();
    expect(activeTodo).not.toBeInTheDocument();

    // Toggle the todo to be completed
    await user.click(screen.getByRole('button', { name: /All/i })); // Go back to 'All' to click the todo
    await user.click(activeTodo); // Now it's completed

    // Filter to 'Active' - should show 'No active todos!' as there are none
    await user.click(screen.getByRole('button', { name: /Active/i }));
    expect(screen.getByText('No active todos!')).toBeInTheDocument();
    expect(activeTodo).not.toBeInTheDocument();

    // Filter to 'Completed' - should not show empty message as there's a completed todo
    await user.click(screen.getByRole('button', { name: /Completed/i }));
    expect(screen.queryByText(/No completed todos!/i)).not.toBeInTheDocument();
    expect(activeTodo).toBeInTheDocument();

    // Delete the last todo
    await user.click(screen.getByRole('button', { name: /All/i })); // Go back to 'All' to delete
    const listItem = activeTodo.closest('li') || activeTodo.parentElement;
    const deleteButton = within(listItem).getByRole('button', { name: /Delete/i });
    await user.click(deleteButton);

    // After deleting, back to initial state - should show general empty message
    expect(screen.getByText(/No todos yet\. Add one above!/i)).toBeInTheDocument();
    expect(screen.queryByText('Single Active Todo')).not.toBeInTheDocument();
  });
});