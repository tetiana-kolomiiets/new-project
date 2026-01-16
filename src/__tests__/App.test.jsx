import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('App Component', () => {
  test('renders the todo list with an empty state message initially', () => {
    render(<App />)
    // Updated assertion for the new initial empty state message
    const emptyStateMessage = screen.getByText(/No todos yet\. Add one above!/i)
    expect(emptyStateMessage).toBeInTheDocument()
  })

  test('adds a new todo to the list', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    await userEvent.type(inputElement, 'Buy groceries')
    fireEvent.click(addButton)

    const todoItem = screen.getByText(/Buy groceries/i)
    expect(todoItem).toBeInTheDocument()
  })

  test('toggles the completion status of a todo', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    await userEvent.type(inputElement, 'Walk the dog')
    fireEvent.click(addButton)

    const todoText = screen.getByText(/Walk the dog/i)
    const todoItemLi = todoText.closest('li') // Get the parent li for class check

    expect(todoItemLi).not.toHaveClass('completed') // Initially not completed

    fireEvent.click(todoText) // Toggle to completed
    expect(todoItemLi).toHaveClass('completed')

    fireEvent.click(todoText) // Toggle back to not completed
    expect(todoItemLi).not.toHaveClass('completed')
  })

  test('deletes a todo from the list', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    await userEvent.type(inputElement, 'Pay bills')
    fireEvent.click(addButton)

    const deleteButton = screen.getByText(/Delete/i)
    fireEvent.click(deleteButton)

    const todoItem = screen.queryByText(/Pay bills/i)
    expect(todoItem).not.toBeInTheDocument()
  })

  test('edits a todo in the list', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    await userEvent.type(inputElement, 'Read a book')
    fireEvent.click(addButton)

    const editButton = screen.getByText(/Edit/i)
    fireEvent.click(editButton)

    const editInput = screen.getByDisplayValue(/Read a book/i)

    await userEvent.clear(editInput)
    await userEvent.type(editInput, 'Learn React')

    const saveButton = screen.getByText(/Save/i)
    fireEvent.click(saveButton)

    const updatedTodoItem = screen.getByText(/Learn React/i)
    expect(updatedTodoItem).toBeInTheDocument()
  })

  test('cancels editing a todo', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    await userEvent.type(inputElement, 'Original todo')
    fireEvent.click(addButton)

    const editButton = screen.getByText(/Edit/i)
    fireEvent.click(editButton)

    const cancelButton = screen.getByText(/Cancel/i)
    fireEvent.click(cancelButton)

    const originalTodo = screen.getByText(/Original todo/i)
    expect(originalTodo).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument() // Ensure edit input is gone
  })

  test('adds a new todo on pressing enter', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)

    await userEvent.type(inputElement, 'Todo from enter{enter}')

    const todoItem = screen.getByText(/Todo from enter/i)
    expect(todoItem).toBeInTheDocument()
  })

  test('saves edit on pressing enter, cancels on escape', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    await userEvent.type(inputElement, 'Initial Value')
    fireEvent.click(addButton)

    const editButton = screen.getByText(/Edit/i)
    fireEvent.click(editButton)

    const editInput = screen.getByDisplayValue(/Initial Value/i)
    await userEvent.clear(editInput)
    await userEvent.type(editInput, 'Edited Value{enter}')

    const updatedTodoItem = screen.getByText(/Edited Value/i)
    expect(updatedTodoItem).toBeInTheDocument()
    expect(screen.queryByDisplayValue(/Edited Value/i)).not.toBeInTheDocument() // Ensure edit input is gone

    // Re-enter edit mode for escape test
    fireEvent.click(screen.getByText(/Edit/i))
    const editInputAgain = screen.getByDisplayValue(/Edited Value/i)
    await userEvent.type(editInputAgain, '{esc}')

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument() // Ensure edit input is gone
    expect(screen.getByText(/Edited Value/i)).toBeInTheDocument() // Original text should still be there
  })

  test('renders filter buttons', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /All/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Active/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Completed/i })).toBeInTheDocument()
  })

  test('filters active todos', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    // Add an active todo
    await userEvent.type(inputElement, 'Active Todo')
    fireEvent.click(addButton)

    // Add a completed todo
    await userEvent.type(inputElement, 'Completed Todo')
    fireEvent.click(addButton)
    fireEvent.click(screen.getByText('Completed Todo')) // Mark as completed

    // Click 'Active' filter
    fireEvent.click(screen.getByRole('button', { name: /Active/i }))

    expect(screen.getByText('Active Todo')).toBeInTheDocument()
    expect(screen.queryByText('Completed Todo')).not.toBeInTheDocument()
    expect(screen.queryByText(/No active todos!/i)).not.toBeInTheDocument() // Should not show empty active message if active todos exist
  })

  test('filters completed todos', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    // Add an active todo
    await userEvent.type(inputElement, 'Active Todo')
    fireEvent.click(addButton)

    // Add a completed todo
    await userEvent.type(inputElement, 'Completed Todo')
    fireEvent.click(addButton)
    fireEvent.click(screen.getByText('Completed Todo')) // Mark as completed

    // Click 'Completed' filter
    fireEvent.click(screen.getByRole('button', { name: /Completed/i }))

    expect(screen.queryByText('Active Todo')).not.toBeInTheDocument()
    expect(screen.getByText('Completed Todo')).toBeInTheDocument()
    expect(screen.queryByText(/No completed todos!/i)).not.toBeInTheDocument() // Should not show empty completed message if completed todos exist
  })

  test('shows all todos when "All" filter is selected after filtering', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    await userEvent.type(inputElement, 'Active Todo')
    fireEvent.click(addButton)

    await userEvent.type(inputElement, 'Completed Todo')
    fireEvent.click(addButton)
    fireEvent.click(screen.getByText('Completed Todo')) // Mark as completed

    // Filter to active first
    fireEvent.click(screen.getByRole('button', { name: /Active/i }))
    expect(screen.getByText('Active Todo')).toBeInTheDocument()
    expect(screen.queryByText('Completed Todo')).not.toBeInTheDocument()

    // Then click 'All'
    fireEvent.click(screen.getByRole('button', { name: /All/i }))
    expect(screen.getByText('Active Todo')).toBeInTheDocument()
    expect(screen.getByText('Completed Todo')).toBeInTheDocument()
  })

  test('displays correct empty state message for "active" filter when no active todos', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    // Add a todo and complete it
    await userEvent.type(inputElement, 'Completed One')
    fireEvent.click(addButton)
    fireEvent.click(screen.getByText('Completed One'))

    // Click 'Active' filter
    fireEvent.click(screen.getByRole('button', { name: /Active/i }))

    expect(screen.queryByText('Completed One')).not.toBeInTheDocument()
    expect(screen.getByText(/No active todos!/i)).toBeInTheDocument()
  })

  test('displays correct empty state message for "completed" filter when no completed todos', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    // Add an active todo
    await userEvent.type(inputElement, 'Active One')
    fireEvent.click(addButton)

    // Click 'Completed' filter
    fireEvent.click(screen.getByRole('button', { name: /Completed/i }))

    expect(screen.queryByText('Active One')).not.toBeInTheDocument()
    expect(screen.getByText(/No completed todos!/i)).toBeInTheDocument()
  })

  test('saves edit on blur', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    await userEvent.type(inputElement, 'Original Todo Text')
    fireEvent.click(addButton)

    const editButton = screen.getByText(/Edit/i)
    fireEvent.click(editButton)

    const editInput = screen.getByDisplayValue(/Original Todo Text/i)
    await userEvent.clear(editInput)
    await userEvent.type(editInput, 'New Todo Text')

    // Simulate blur by moving focus away from the input
    fireEvent.blur(editInput);

    // Wait for state updates and re-render
    await waitFor(() => {
      expect(screen.queryByDisplayValue(/New Todo Text/i)).not.toBeInTheDocument(); // Edit input should be gone
      expect(screen.getByText(/New Todo Text/i)).toBeInTheDocument(); // New text should be displayed
    });
  })

  test('delete a todo while editing cancels the edit and deletes the todo', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    await userEvent.type(inputElement, 'Todo to be deleted')
    fireEvent.click(addButton)

    // Enter edit mode
    fireEvent.click(screen.getByText(/Edit/i))

    // Check that edit input is visible
    expect(screen.getByDisplayValue(/Todo to be deleted/i)).toBeInTheDocument()

    const deleteButton = screen.getByText(/Delete/i)
    fireEvent.click(deleteButton)

    // Assert that the todo is no longer in the document
    expect(screen.queryByText(/Todo to be deleted/i)).not.toBeInTheDocument()
    // Assert that the edit input is no longer in the document
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument() // Check for any textbox role as name might be gone
  })
})