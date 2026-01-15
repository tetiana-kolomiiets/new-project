import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App'

describe('App component', () => {
  it('should add a new todo', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText('Add a new todo...')
    const addButton = screen.getByText('Add')

    await userEvent.type(inputElement, 'Test todo')
    await userEvent.click(addButton)

    expect(screen.getByText('Test todo')).toBeInTheDocument()
  })

  it('should toggle a todo', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText('Add a new todo...')
    const addButton = screen.getByText('Add')

    await userEvent.type(inputElement, 'Test todo')
    await userEvent.click(addButton)

    const todoTextElement = screen.getByText('Test todo')
    await userEvent.click(todoTextElement)

    expect(todoTextElement).toHaveClass('completed')

    await userEvent.click(todoTextElement)

    expect(todoTextElement).not.toHaveClass('completed')
  })

  it('should delete a todo', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText('Add a new todo...')
    const addButton = screen.getByText('Add')

    await userEvent.type(inputElement, 'Test todo')
    await userEvent.click(addButton)

    const deleteButton = screen.getByText('Delete')
    await userEvent.click(deleteButton)

    expect(screen.queryByText('Test todo')).not.toBeInTheDocument()
  })

  it('should edit a todo', async () => {
    render(<App />)
    const inputElement = screen.getByPlaceholderText('Add a new todo...')
    const addButton = screen.getByText('Add')

    await userEvent.type(inputElement, 'Test todo')
    await userEvent.click(addButton)

    const editButton = screen.getByText('Edit')
    await userEvent.click(editButton)

    const editInputElement = screen.getByDisplayValue('Test todo')
    fireEvent.change(editInputElement, { target: { value: 'Updated todo' } })
    // Using fireEvent for onChange as userEvent simulates real user typing.
    // We need to simulate the change directly for this test.

    const saveButton = screen.getByText('Save')
    await userEvent.click(saveButton)

    expect(screen.getByText('Updated todo')).toBeInTheDocument()
    expect(screen.queryByText('Test todo')).not.toBeInTheDocument()
  })

  it('should display the empty state message when there are no todos', () => {
    render(<App />)
    expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument()
  })
})