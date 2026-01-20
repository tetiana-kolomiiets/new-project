import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoInput from '../TodoInput';

describe('TodoInput', () => {
  test('renders with an input field and an add button', () => {
    render(<TodoInput onAdd={() => {}} />);
    expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add/i })).toBeInTheDocument();
  });

  test('updates input value on change', async () => {
    render(<TodoInput onAdd={() => {}} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    const testValue = 'Learn React';

    await userEvent.type(inputElement, testValue);
    expect(inputElement).toHaveValue(testValue);
  });

  test('calls onAdd with trimmed value and clears input when Add button is clicked', async () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    const addButton = screen.getByRole('button', { name: /Add/i });
    const testValue = '  Buy groceries  ';

    await userEvent.type(inputElement, testValue);
    expect(inputElement).toHaveValue(testValue); // Input should show the untrimmed value
    await userEvent.click(addButton);

    expect(mockOnAdd).toHaveBeenCalledTimes(1);
    expect(mockOnAdd).toHaveBeenCalledWith('Buy groceries');
    expect(inputElement).toHaveValue(''); // Input should be cleared
  });

  test('does not call onAdd and clears input when Add button is clicked with empty input', async () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    const addButton = screen.getByRole('button', { name: /Add/i });

    await userEvent.click(addButton); // Clicking with empty input

    expect(mockOnAdd).not.toHaveBeenCalled();
    expect(inputElement).toHaveValue('');
  });

  test('does not call onAdd and clears input when Add button is clicked with whitespace only input', async () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    const addButton = screen.getByRole('button', { name: /Add/i });
    const testValue = '   ';

    await userEvent.type(inputElement, testValue);
    expect(inputElement).toHaveValue(testValue);
    await userEvent.click(addButton);

    expect(mockOnAdd).not.toHaveBeenCalled();
    expect(inputElement).toHaveValue('');
  });

  test('calls onAdd with trimmed value and clears input when Enter key is pressed', async () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    const testValue = '  Walk the dog  ';

    await userEvent.type(inputElement, `${testValue}{enter}`);

    expect(mockOnAdd).toHaveBeenCalledTimes(1);
    expect(mockOnAdd).toHaveBeenCalledWith('Walk the dog');
    expect(inputElement).toHaveValue('');
  });

  test('does not call onAdd and clears input when Enter key is pressed with empty input', async () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');

    await userEvent.type(inputElement, '{enter}');

    expect(mockOnAdd).not.toHaveBeenCalled();
    expect(inputElement).toHaveValue('');
  });

  test('does not call onAdd and clears input when Enter key is pressed with whitespace only input', async () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    const testValue = '  \t  ';

    await userEvent.type(inputElement, `${testValue}{enter}`);

    expect(mockOnAdd).not.toHaveBeenCalled();
    expect(inputElement).toHaveValue('');
  });
});