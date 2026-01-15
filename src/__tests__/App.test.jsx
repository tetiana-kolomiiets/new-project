import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('App Component', () => {
  test('renders the todo list with an empty state message initially', () => {
    render(<App />)
    const emptyStateMessage = screen.getByText(/No todos yet/i)
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

  test('toggles the completion status of a todo', () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i)
    const addButton = screen.getByText(/Add/i)

    fireEvent.change(inputElement, { target: { value: 'Walk the dog' } })
    fireEvent.click(addButton)

    const todoText = screen.getByText(/Walk the dog/i)
    fireEvent.click(todoText)

    expect(todoText).toHaveClass('todo-text') // Check if todo item is not completed
    expect(todoText.closest('li')).toHaveClass('completed') // Check if todo item is completed

    fireEvent.click(todoText)
    expect(todoText.closest('li')).not.toHaveClass('completed') // Check if todo item is not completed after toggling again
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
    fireEvent.click(addButton)

    const editButton = screen.getByText(/Edit/i)
    fireEvent.click(editButton)

    const editInput = screen.getByDisplayValue(/Initial Value/i)
    await userEvent.clear(editInput)
    await userEvent.type(editInput, 'Edited Value{enter}')

    const updatedTodoItem = screen.getByText(/Edited Value/i)
    expect(updatedTodoItem).toBeInTheDocument()

    fireEvent.click(editButton)

    const editInputAgain = screen.getByDisplayValue(/Edited Value/i)
    await userEvent.type(editInputAgain, '{esc}')

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })
})