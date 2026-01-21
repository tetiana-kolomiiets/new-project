import { render, screen, fireEvent } from '@testing-library/react';
import TodoInput from '../TodoInput';

describe('TodoInput', () => {
  it('should render an input and an add button', () => {
    render(<TodoInput onAdd={() => {}} />);

    expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('should update the input value when typed into', () => {
    render(<TodoInput onAdd={() => {}} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');

    fireEvent.change(inputElement, { target: { value: 'New Todo' } });
    expect(inputElement).toHaveValue('New Todo');
  });

  it('should call onAdd with the trimmed input value and clear the input when add button is clicked', () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    const addButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(inputElement, { target: { value: '  Task 1  ' } });
    fireEvent.click(addButton);

    expect(mockOnAdd).toHaveBeenCalledTimes(1);
    expect(mockOnAdd).toHaveBeenCalledWith('Task 1');
    expect(inputElement).toHaveValue('');
  });

  it('should call onAdd with the trimmed input value and clear the input when Enter key is pressed', () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');

    fireEvent.change(inputElement, { target: { value: '  Task 2  ' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    expect(mockOnAdd).toHaveBeenCalledTimes(1);
    expect(mockOnAdd).toHaveBeenCalledWith('Task 2');
    expect(inputElement).toHaveValue('');
  });

  it('should not call onAdd and not clear the input if input is empty or only whitespace when add button is clicked', () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    const addButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(inputElement, { target: { value: '   ' } });
    fireEvent.click(addButton);

    expect(mockOnAdd).not.toHaveBeenCalled();
    expect(inputElement).toHaveValue('   '); // Input value should remain unchanged

    fireEvent.change(inputElement, { target: { value: '' } });
    fireEvent.click(addButton);

    expect(mockOnAdd).not.toHaveBeenCalled();
    expect(inputElement).toHaveValue(''); // Input value should remain unchanged
  });

  it('should not call onAdd and not clear the input if input is empty or only whitespace when Enter key is pressed', () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');

    fireEvent.change(inputElement, { target: { value: '   ' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    expect(mockOnAdd).not.toHaveBeenCalled();
    expect(inputElement).toHaveValue('   '); // Input value should remain unchanged

    fireEvent.change(inputElement, { target: { value: '' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    expect(mockOnAdd).not.toHaveBeenCalled();
    expect(inputElement).toHaveValue(''); // Input value should remain unchanged
  });
});