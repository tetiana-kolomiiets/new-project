import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('App Component', () => {
  test('renders the todo list with an empty state message and "All" filter active initially', () => {
    render(<App />)
    const emptyStateMessage = screen.getByText(/No todos yet. Add one above!/i)
    expect(emptyStateMessage).toBeInTheDocument()

    const allFilterButton = screen.getByRole('button', { name: /All/i })
    expect(allFilterButton).toHaveClass('active')
  })

  test('adds a new todo to the list', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByRole('button', { name: /Add/i })

    await userEvent.type(inputElement, 'Buy groceries')
    await userEvent.click(addButton)

    const todoItem = screen.getByText(/Buy groceries/i)
    expect(todoItem).toBeInTheDocument()
    expect(screen.queryByText(/No todos yet/i)).not.toBeInTheDocument()
  })

  test('toggles the completion status of a todo', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByRole('button', { name: /Add/i })

    await userEvent.type(inputElement, 'Walk the dog')
    await userEvent.click(addButton)

    const todoText = screen.getByText(/Walk the dog/i)
    expect(todoText.closest('li')).not.toHaveClass('completed') // Check if todo item is not completed initially

    await userEvent.click(todoText) // Mark as completed
    expect(todoText.closest('li')).toHaveClass('completed') // Check if todo item is completed

    await userEvent.click(todoText) // Mark as active again
    expect(todoText.closest('li')).not.toHaveClass('completed') // Check if todo item is not completed after toggling again
  })

  test('deletes a todo from the list', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByRole('button', { name: /Add/i })

    await userEvent.type(inputElement, 'Pay bills')
    await userEvent.click(addButton)

    const deleteButton = screen.getByRole('button', { name: /Delete/i })
    await userEvent.click(deleteButton)

    const todoItem = screen.queryByText(/Pay bills/i)
    expect(todoItem).not.toBeInTheDocument()
  })

  test('edits a todo in the list', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByRole('button', { name: /Add/i })

    await userEvent.type(inputElement, 'Read a book')
    await userEvent.click(addButton)

    const editButton = screen.getByRole('button', { name: /Edit/i })
    await userEvent.click(editButton)

    const editInput = screen.getByDisplayValue(/Read a book/i)

    await userEvent.clear(editInput)
    await userEvent.type(editInput, 'Learn React')

    const saveButton = screen.getByRole('button', { name: /Save/i })
    await userEvent.click(saveButton)

    const updatedTodoItem = screen.getByText(/Learn React/i)
    expect(updatedTodoItem).toBeInTheDocument()
    expect(screen.queryByDisplayValue(/Read a book/i)).not.toBeInTheDocument()
  })

  test('cancels editing a todo', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByRole('button', { name: /Add/i })

    await userEvent.type(inputElement, 'Original todo')
    await userEvent.click(addButton)

    const editButton = screen.getByRole('button', { name: /Edit/i })
    await userEvent.click(editButton)

    const cancelButton = screen.getByRole('button', { name: /Cancel/i })
    await userEvent.click(cancelButton)

    const originalTodo = screen.getByText(/Original todo/i)
    expect(originalTodo).toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: /edit-input/i })).not.toBeInTheDocument() // Check that edit input is gone
  })

  test('adds a new todo on pressing enter', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)

    await userEvent.type(inputElement, 'Todo from enter{enter}')

    const todoItem = screen.getByText(/Todo from enter/i)
    expect(todoItem).toBeInTheDocument()
    expect(inputElement).toHaveValue('') // Input should be cleared
  })

  test('saves edit on pressing enter, cancels on escape', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByRole('button', { name: /Add/i })

    await userEvent.type(inputElement, 'Initial Value')
    await userEvent.click(addButton)

    const editButton = screen.getByRole('button', { name: /Edit/i })
    await userEvent.click(editButton)

    const editInput = screen.getByDisplayValue(/Initial Value/i)
    await userEvent.clear(editInput)
    await userEvent.type(editInput, 'Edited Value{enter}')

    const updatedTodoItem = screen.getByText(/Edited Value/i)
    expect(updatedTodoItem).toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: /edit-input/i })).not.toBeInTheDocument()

    // Test cancel edit with escape
    await userEvent.click(screen.getByRole('button', { name: /Edit/i }))

    const editInputAgain = screen.getByDisplayValue(/Edited Value/i)
    await userEvent.type(editInputAgain, '{escape}')

    expect(screen.queryByRole('textbox', { name: /edit-input/i })).not.toBeInTheDocument()
    expect(screen.getByText(/Edited Value/i)).toBeInTheDocument()
  })

  test('filters and displays only active todos', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByRole('button', { name: /Add/i })

    await userEvent.type(inputElement, 'Active Todo 1{enter}')
    await userEvent.type(inputElement, 'Completed Todo 1{enter}')
    await userEvent.type(inputElement, 'Active Todo 2{enter}')

    // Mark 'Completed Todo 1' as completed
    await userEvent.click(screen.getByText(/Completed Todo 1/i))

    const activeFilterButton = screen.getByRole('button', { name: /Active/i })
    await userEvent.click(activeFilterButton)

    expect(screen.getByText(/Active Todo 1/i)).toBeInTheDocument()
    expect(screen.getByText(/Active Todo 2/i)).toBeInTheDocument()
    expect(screen.queryByText(/Completed Todo 1/i)).not.toBeInTheDocument()
    expect(activeFilterButton).toHaveClass('active')
  })

  test('filters and displays only completed todos', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByRole('button', { name: /Add/i })

    await userEvent.type(inputElement, 'Active Todo{enter}')
    await userEvent.type(inputElement, 'Completed Todo 1{enter}')
    await userEvent.type(inputElement, 'Completed Todo 2{enter}')

    // Mark 'Completed Todo 1' and 'Completed Todo 2' as completed
    await userEvent.click(screen.getByText(/Completed Todo 1/i))
    await userEvent.click(screen.getByText(/Completed Todo 2/i))

    const completedFilterButton = screen.getByRole('button', { name: /Completed/i })
    await userEvent.click(completedFilterButton)

    expect(screen.getByText(/Completed Todo 1/i)).toBeInTheDocument()
    expect(screen.getByText(/Completed Todo 2/i)).toBeInTheDocument()
    expect(screen.queryByText(/Active Todo/i)).not.toBeInTheDocument()
    expect(completedFilterButton).toHaveClass('active')
  })

  test('switches between filters and displays correct todos', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)

    await userEvent.type(inputElement, 'Todo A{enter}') // Active
    await userEvent.type(inputElement, 'Todo B{enter}') // Active
    await userEvent.type(inputElement, 'Todo C{enter}') // Active

    // Mark Todo B as completed
    await userEvent.click(screen.getByText(/Todo B/i))

    // Check Active filter
    await userEvent.click(screen.getByRole('button', { name: /Active/i }))
    expect(screen.getByText(/Todo A/i)).toBeInTheDocument()
    expect(screen.queryByText(/Todo B/i)).not.toBeInTheDocument()
    expect(screen.getByText(/Todo C/i)).toBeInTheDocument()

    // Check Completed filter
    await userEvent.click(screen.getByRole('button', { name: /Completed/i }))
    expect(screen.queryByText(/Todo A/i)).not.toBeInTheDocument()
    expect(screen.getByText(/Todo B/i)).toBeInTheDocument()
    expect(screen.queryByText(/Todo C/i)).not.toBeInTheDocument()

    // Check All filter
    await userEvent.click(screen.getByRole('button', { name: /All/i }))
    expect(screen.getByText(/Todo A/i)).toBeInTheDocument()
    expect(screen.getByText(/Todo B/i)).toBeInTheDocument()
    expect(screen.getByText(/Todo C/i)).toBeInTheDocument()
  })

  test('displays correct empty state messages for different filters', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    await userEvent.type(inputElement, 'Only one todo{enter}')
    await userEvent.click(screen.getByText(/Only one todo/i)) // Mark it completed

    // All filter: Should show the todo
    expect(screen.getByText(/Only one todo/i)).toBeInTheDocument()
    expect(screen.queryByText(/No todos yet/i)).not.toBeInTheDocument()

    // Active filter: Should show empty message
    await userEvent.click(screen.getByRole('button', { name: /Active/i }))
    expect(screen.queryByText(/Only one todo/i)).not.toBeInTheDocument()
    expect(screen.getByText(/No active todos!/i)).toBeInTheDocument()

    // Completed filter: Should show the todo
    await userEvent.click(screen.getByRole('button', { name: /Completed/i }))
    expect(screen.getByText(/Only one todo/i)).toBeInTheDocument()
    expect(screen.queryByText(/No completed todos!/i)).not.toBeInTheDocument()

    // Delete the todo and recheck active/completed empty states
    await userEvent.click(screen.getByRole('button', { name: /Delete/i }))

    // All filter (after deletion): Should show initial empty message
    await userEvent.click(screen.getByRole('button', { name: /All/i }))
    expect(screen.getByText(/No todos yet. Add one above!/i)).toBeInTheDocument()

    // Active filter (after deletion): Should show no active todos message
    await userEvent.click(screen.getByRole('button', { name: /Active/i }))
    expect(screen.getByText(/No active todos!/i)).toBeInTheDocument()

    // Completed filter (after deletion): Should show no completed todos message
    await userEvent.click(screen.getByRole('button', { name: /Completed/i }))
    expect(screen.getByText(/No completed todos!/i)).toBeInTheDocument()
  })
})