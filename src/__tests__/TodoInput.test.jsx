import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoInput from '../components/TodoInput';

describe('TodoInput', () => {
  const user = userEvent.setup();

  it('renders input and add button', () => {
    render(<TodoInput onAdd={() => {}} />);
    expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('updates input value on change', async () => {
    render(<TodoInput onAdd={() => {}} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    
    await user.type(inputElement, 'New todo item');
    expect(inputElement).toHaveValue('New todo item');
  });

  it('calls onAdd with trimmed value, and clears input on button click', async () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    const addButton = screen.getByRole('button', { name: /add/i });

    await user.type(inputElement, '  My New Todo  ');
    await user.click(addButton);

    expect(mockOnAdd).toHaveBeenCalledTimes(1);
    expect(mockOnAdd).toHaveBeenCalledWith('My New Todo');
    expect(inputElement).toHaveValue('');
  });

  it('does not call onAdd if input is empty on button click', async () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const addButton = screen.getByRole('button', { name: /add/i });

    await user.click(addButton);

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('does not call onAdd if input is only whitespace on button click', async () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    const addButton = screen.getByRole('button', { name: /add/i });

    await user.type(inputElement, '   ');
    await user.click(addButton);

    expect(mockOnAdd).not.toHaveBeenCalled();
    expect(inputElement).toHaveValue('   '); // Value remains if not added
  });

  it('calls onAdd with trimmed value, and clears input on Enter key press', async () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');

    await user.type(inputElement, '  Another Todo  ');
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    expect(mockOnAdd).toHaveBeenCalledTimes(1);
    expect(mockOnAdd).toHaveBeenCalledWith('Another Todo');
    expect(inputElement).toHaveValue('');
  });

  it('does not call onAdd if input is empty on Enter key press', async () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');

    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('does not call onAdd if input is only whitespace on Enter key press', async () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');

    await user.type(inputElement, '   ');
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    expect(mockOnAdd).not.toHaveBeenCalled();
    expect(inputElement).toHaveValue('   '); // Value remains if not added
  });

  it('does not call onAdd on other key presses', async () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');

    await user.type(inputElement, 'Some text'); // Ensure input has value
    fireEvent.keyDown(inputElement, { key: 'Escape', code: 'Escape' });
    fireEvent.keyDown(inputElement, { key: 'Tab', code: 'Tab' });
    fireEvent.keyDown(inputElement, { key: 'a', code: 'KeyA' });

    expect(mockOnAdd).not.toHaveBeenCalled();
    expect(inputElement).toHaveValue('Some text'); // Value should remain unchanged
  });
});