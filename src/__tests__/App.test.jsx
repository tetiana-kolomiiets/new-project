import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../components/TodoApp'

describe('App Component', () => {
  test('renders the todo list with an empty state message initially', () => {
    render(<App />)
    const emptyStateMessage = screen.getByText(/No todos yet\. Add one above!/i)
    expect(emptyStateMessage).toBeInTheDocument()
  })

  test('adds a new todo to the list', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    await userEvent.type(inputElement, 'Buy groceries')
    await userEvent.click(addButton)

    const todoItem = screen.getByText(/Buy groceries/i)
    expect(todoItem).toBeInTheDocument()
  })

  test('toggles the completion status of a todo', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    await userEvent.type(inputElement, 'Walk the dog')
    await userEvent.click(addButton)

    const todoText = screen.getByText(/Walk the dog/i)
    const todoItem = todoText.closest('li') // Get the parent li

    expect(todoItem).not.toHaveClass('completed') // Initially not completed

    await userEvent.click(todoText) // Toggle to completed
    expect(todoItem).toHaveClass('completed') // Now completed

    await userEvent.click(todoText) // Toggle back to active
    expect(todoItem).not.toHaveClass('completed') // Not completed again
  })

  test('deletes a todo from the list', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    await userEvent.type(inputElement, 'Pay bills')
    await userEvent.click(addButton)

    const deleteButton = screen.getByText(/Pay bills/i).closest('li').querySelector('.delete-button')
    await userEvent.click(deleteButton)

    const todoItem = screen.queryByText(/Pay bills/i)
    expect(todoItem).not.toBeInTheDocument()
  })

  test('edits a todo in the list', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    await userEvent.type(inputElement, 'Read a book')
    await userEvent.click(addButton)

    const editButton = screen.getByText(/Read a book/i).closest('li').querySelector('.edit-button')
    await userEvent.click(editButton)

    const editInput = screen.getByDisplayValue(/Read a book/i)

    await userEvent.clear(editInput)
    await userEvent.type(editInput, 'Learn React')

    const saveButton = screen.getByText(/Save/i)
    await userEvent.click(saveButton)

    const updatedTodoItem = screen.getByText(/Learn React/i)
    expect(updatedTodoItem).toBeInTheDocument()
  })

  test('cancels editing a todo', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    await userEvent.type(inputElement, 'Original todo')
    await userEvent.click(addButton)

    const editButton = screen.getByText(/Original todo/i).closest('li').querySelector('.edit-button')
    await userEvent.click(editButton)

    const cancelButton = screen.getByText(/Cancel/i)
    await userEvent.click(cancelButton)

    const originalTodo = screen.getByText(/Original todo/i)
    expect(originalTodo).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
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
    await userEvent.click(addButton)

    let editButton = screen.getByText(/Initial Value/i).closest('li').querySelector('.edit-button')
    await userEvent.click(editButton)

    let editInput = screen.getByDisplayValue(/Initial Value/i)
    await userEvent.clear(editInput)
    await userEvent.type(editInput, 'Edited Value{enter}')

    const updatedTodoItem = screen.getByText(/Edited Value/i)
    expect(updatedTodoItem).toBeInTheDocument()

    editButton = screen.getByText(/Edited Value/i).closest('li').querySelector('.edit-button')
    await userEvent.click(editButton)

    editInput = screen.getByDisplayValue(/Edited Value/i)
    await userEvent.type(editInput, '{esc}')

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByText(/Edited Value/i)).toBeInTheDocument()
  })

  test('renders filter buttons and "All" is active by default', () => {
    render(<App />)
    const allButton = screen.getByRole('button', { name: /All/i })
    const activeButton = screen.getByRole('button', { name: /Active/i })
    const completedButton = screen.getByRole('button', { name: /Completed/i })

    expect(allButton).toBeInTheDocument()
    expect(activeButton).toBeInTheDocument()
    expect(completedButton).toBeInTheDocument()

    expect(allButton).toHaveClass('active')
    expect(activeButton).not.toHaveClass('active')
    expect(completedButton).not.toHaveClass('active')
  })

  test('filters todos by "Active" status', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    await userEvent.type(inputElement, 'Todo 1')
    await userEvent.click(addButton)
    await userEvent.type(inputElement, 'Todo 2')
    await userEvent.click(addButton)
    await userEvent.type(inputElement, 'Todo 3')
    await userEvent.click(addButton)

    const todo2Text = screen.getByText(/Todo 2/i)
    await userEvent.click(todo2Text) // Mark Todo 2 as completed

    const activeButton = screen.getByRole('button', { name: /Active/i })
    await userEvent.click(activeButton)

    expect(screen.getByText(/Todo 1/i)).toBeInTheDocument()
    expect(screen.queryByText(/Todo 2/i)).not.toBeInTheDocument()
    expect(screen.getByText(/Todo 3/i)).toBeInTheDocument()

    expect(activeButton).toHaveClass('active')
    expect(screen.getByRole('button', { name: /All/i })).not.toHaveClass('active')
  })

  test('filters todos by "Completed" status', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    await userEvent.type(inputElement, 'Complete me 1')
    await userEvent.click(addButton)
    await userEvent.type(inputElement, 'Complete me 2')
    await userEvent.click(addButton)
    await userEvent.type(inputElement, 'Not complete')
    await userEvent.click(addButton)

    await userEvent.click(screen.getByText(/Complete me 1/i))
    await userEvent.click(screen.getByText(/Complete me 2/i))

    const completedButton = screen.getByRole('button', { name: /Completed/i })
    await userEvent.click(completedButton)

    expect(screen.getByText(/Complete me 1/i)).toBeInTheDocument()
    expect(screen.getByText(/Complete me 2/i)).toBeInTheDocument()
    expect(screen.queryByText(/Not complete/i)).not.toBeInTheDocument()

    expect(completedButton).toHaveClass('active')
    expect(screen.getByRole('button', { name: /All/i })).not.toHaveClass('active')
  })

  test('shows correct empty state messages for filters', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    await userEvent.type(inputElement, 'Only completed todo')
    await userEvent.click(addButton)
    await userEvent.click(screen.getByText(/Only completed todo/i))

    expect(screen.getByText(/Only completed todo/i)).toBeInTheDocument()
    expect(screen.queryByText(/No todos yet\. Add one above!/i)).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /Active/i }))
    expect(screen.queryByText(/Only completed todo/i)).not.toBeInTheDocument()
    expect(screen.getByText(/No active todos!/i)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /Completed/i }))
    expect(screen.getByText(/Only completed todo/i)).toBeInTheDocument()
    expect(screen.queryByText(/No completed todos!/i)).not.toBeInTheDocument()

    await userEvent.click(screen.getByText(/Only completed todo/i).closest('li').querySelector('.delete-button'))
    expect(screen.queryByText(/Only completed todo/i)).not.toBeInTheDocument()
    expect(screen.getByText(/No completed todos!/i)).toBeInTheDocument()
  })

  test('adding a todo updates the list in the current filter', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    await userEvent.click(screen.getByRole('button', { name: /Active/i }))
    expect(screen.getByText(/No active todos!/i)).toBeInTheDocument()

    await userEvent.type(inputElement, 'Newly added active todo')
    await userEvent.click(addButton)

    expect(screen.getByText(/Newly added active todo/i)).toBeInTheDocument()
    expect(screen.queryByText(/No active todos!/i)).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /Completed/i }))
    expect(screen.queryByText(/Newly added active todo/i)).not.toBeInTheDocument()
    expect(screen.getByText(/No completed todos!/i)).toBeInTheDocument()
  })

  test('toggling a todo updates the list in the current filter', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    await userEvent.type(inputElement, 'Toggle me')
    await userEvent.click(addButton)

    await userEvent.click(screen.getByRole('button', { name: /Active/i }))
    expect(screen.getByText(/Toggle me/i)).toBeInTheDocument()

    await userEvent.click(screen.getByText(/Toggle me/i))

    expect(screen.queryByText(/Toggle me/i)).not.toBeInTheDocument()
    expect(screen.getByText(/No active todos!/i)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /Completed/i }))
    expect(screen.getByText(/Toggle me/i)).toBeInTheDocument()

    await userEvent.click(screen.getByText(/Toggle me/i))

    expect(screen.queryByText(/Toggle me/i)).not.toBeInTheDocument()
    expect(screen.getByText(/No completed todos!/i)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /All/i }))
    expect(screen.getByText(/Toggle me/i)).toBeInTheDocument()
    const todoItem = screen.getByText(/Toggle me/i).closest('li')
    expect(todoItem).not.toHaveClass('completed')
  })

  test('deleting a todo while filter is active', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    await userEvent.type(inputElement, 'Active Todo')
    await userEvent.click(addButton)
    await userEvent.type(inputElement, 'Completed Todo')
    await userEvent.click(addButton)
    await userEvent.click(screen.getByText(/Completed Todo/i))

    await userEvent.click(screen.getByRole('button', { name: /Active/i }))
    expect(screen.getByText(/Active Todo/i)).toBeInTheDocument()
    expect(screen.queryByText(/Completed Todo/i)).not.toBeInTheDocument()

    await userEvent.click(screen.getByText(/Active Todo/i).closest('li').querySelector('.delete-button'))
    expect(screen.queryByText(/Active Todo/i)).not.toBeInTheDocument()
    expect(screen.getByText(/No active todos!/i)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /Completed/i }))
    expect(screen.getByText(/Completed Todo/i)).toBeInTheDocument()

    await userEvent.click(screen.getByText(/Completed Todo/i).closest('li').querySelector('.delete-button'))
    expect(screen.queryByText(/Completed Todo/i)).not.toBeInTheDocument()
    expect(screen.getByText(/No completed todos!/i)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /All/i }))
    expect(screen.getByText(/No todos yet\. Add one above!/i)).toBeInTheDocument()
  })
})