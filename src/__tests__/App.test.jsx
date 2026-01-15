import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('App Component', () => {
  test('renders the title', () => {
    render(<App />)
    const titleElement = screen.getByText(/Todo List/i)
    expect(titleElement).toBeInTheDocument()
  })

  test('renders the input field', () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo.../i)
    expect(inputElement).toBeInTheDocument()
  })

  test('renders the add button', () => {
    render(<App />)
    const addButtonElement = screen.getByText(/Add/i)
    expect(addButtonElement).toBeInTheDocument()
  })

  test('adds a todo to the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo.../i)
    const addButtonElement = screen.getByText(/Add/i)

    await user.type(inputElement, 'Test todo')
    await user.click(addButtonElement)

    const todoElement = screen.getByText(/Test todo/i)
    expect(todoElement).toBeInTheDocument()
  })

  test('can complete a todo', async () => {
    const user = userEvent.setup()
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo.../i)
    const addButtonElement = screen.getByText(/Add/i)

    await user.type(inputElement, 'Test todo')
    await user.click(addButtonElement)

    const todoElement = screen.getByText(/Test todo/i)
    expect(todoElement).toBeInTheDocument()

    await user.click(todoElement)
    expect(todoElement).toHaveClass('todo-text')
  })

  test('can delete a todo', async () => {
    const user = userEvent.setup()
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo.../i)
    const addButtonElement = screen.getByText(/Add/i)

    await user.type(inputElement, 'Test todo')
    await user.click(addButtonElement)

    const todoElement = screen.getByText(/Test todo/i)
    expect(todoElement).toBeInTheDocument()

    const deleteButton = screen.getByText(/Delete/i)
    await user.click(deleteButton)

    expect(screen.queryByText(/Test todo/i)).toBeNull()
  })

  test('can edit a todo', async () => {
    const user = userEvent.setup()
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo.../i)
    const addButtonElement = screen.getByText(/Add/i)

    await user.type(inputElement, 'Test todo')
    await user.click(addButtonElement)

    const todoElement = screen.getByText(/Test todo/i)
    expect(todoElement).toBeInTheDocument()

    const editButton = screen.getByText(/Edit/i)
    await user.click(editButton)

    const editInputElement = screen.getByDisplayValue(/Test todo/i)
    expect(editInputElement).toBeInTheDocument()

    await user.type(editInputElement, ' edited')

    const saveButton = screen.getByText(/Save/i)
    await user.click(saveButton)

    const editedTodoElement = screen.getByText(/Test todo edited/i)
    expect(editedTodoElement).toBeInTheDocument()
  })

  test('displays empty state message when there are no todos', () => {
    render(<App />)
    const emptyStateElement = screen.getByText(/No todos yet/i)
    expect(emptyStateElement).toBeInTheDocument()
  })
})