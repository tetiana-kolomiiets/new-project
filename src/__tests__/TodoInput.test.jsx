import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoInput from '../components/TodoInput';

describe('TodoInput', () => {
  const user = userEvent.setup();

  it('renders input, add button, and priority select', () => {
    render(<TodoInput onAdd={() => {}} />);
    expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    
    const prioritySelect = screen.getByRole('combobox');
    expect(prioritySelect).toBeInTheDocument();
    expect(prioritySelect).toHaveValue('medium'); // Default priority
  });

  it('updates input value on change', async () => {
    render(<TodoInput onAdd={() => {}} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    
    await user.type(inputElement, 'New todo item');
    expect(inputElement).toHaveValue('New todo item');
  });

  it('updates priority select value on change', async () => {
    render(<TodoInput onAdd={() => {}} />);
    const prioritySelect = screen.getByRole('combobox');

    expect(prioritySelect).toHaveValue('medium');
    await user.selectOptions(prioritySelect, 'high');
    expect(prioritySelect).toHaveValue('high');

    await user.selectOptions(prioritySelect, 'low');
    expect(prioritySelect).toHaveValue('low');
  });

  it('calls onAdd with trimmed value and default priority, and clears input and resets priority on button click', async () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    const addButton = screen.getByRole('button', { name: /add/i });
    const prioritySelect = screen.getByRole('combobox');

    await user.type(inputElement, '  My New Todo  ');
    await user.click(addButton);

    expect(mockOnAdd).toHaveBeenCalledTimes(1);
    expect(mockOnAdd).toHaveBeenCalledWith('My New Todo', 'medium'); // Passed default priority
    expect(inputElement).toHaveValue('');
    expect(prioritySelect).toHaveValue('medium'); // Priority should reset to medium
  });

  it('calls onAdd with trimmed value and selected priority, and clears input and resets priority on button click', async () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    const addButton = screen.getByRole('button', { name: /add/i });
    const prioritySelect = screen.getByRole('combobox');

    await user.type(inputElement, '  My High Priority Todo  ');
    await user.selectOptions(prioritySelect, 'high');
    expect(prioritySelect).toHaveValue('high'); // Verify priority changed before adding

    await user.click(addButton);

    expect(mockOnAdd).toHaveBeenCalledTimes(1);
    expect(mockOnAdd).toHaveBeenCalledWith('My High Priority Todo', 'high'); // Passed selected priority
    expect(inputElement).toHaveValue('');
    expect(prioritySelect).toHaveValue('medium'); // Priority should reset to medium
  });

  it('does not call onAdd if input is empty on button click', async () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const addButton = screen.getByRole('button', { name: /add/i });
    const prioritySelect = screen.getByRole('combobox');
    const initialPriority = prioritySelect.value;

    await user.click(addButton);

    expect(mockOnAdd).not.toHaveBeenCalled();
    expect(prioritySelect).toHaveValue(initialPriority); // Priority should not reset
  });

  it('does not call onAdd if input is only whitespace on button click', async () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    const addButton = screen.getByRole('button', { name: /add/i });
    const prioritySelect = screen.getByRole('combobox');
    const initialPriority = prioritySelect.value;

    await user.type(inputElement, '   ');
    await user.click(addButton);

    expect(mockOnAdd).not.toHaveBeenCalled();
    expect(inputElement).toHaveValue('   '); // Value remains if not added
    expect(prioritySelect).toHaveValue(initialPriority); // Priority should not reset
  });

  it('calls onAdd with trimmed value and default priority, and clears input and resets priority on Enter key press', async () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    const prioritySelect = screen.getByRole('combobox');

    await user.type(inputElement, '  Another Todo  ');
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    expect(mockOnAdd).toHaveBeenCalledTimes(1);
    expect(mockOnAdd).toHaveBeenCalledWith('Another Todo', 'medium'); // Passed default priority
    expect(inputElement).toHaveValue('');
    expect(prioritySelect).toHaveValue('medium'); // Priority should reset to medium
  });

  it('calls onAdd with trimmed value and selected priority, and clears input and resets priority on Enter key press', async () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    const prioritySelect = screen.getByRole('combobox');

    await user.type(inputElement, '  Enter Key Low Priority  ');
    await user.selectOptions(prioritySelect, 'low');
    expect(prioritySelect).toHaveValue('low'); // Verify priority changed before adding

    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    expect(mockOnAdd).toHaveBeenCalledTimes(1);
    expect(mockOnAdd).toHaveBeenCalledWith('Enter Key Low Priority', 'low'); // Passed selected priority
    expect(inputElement).toHaveValue('');
    expect(prioritySelect).toHaveValue('medium'); // Priority should reset to medium
  });

  it('does not call onAdd if input is empty on Enter key press', async () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    const prioritySelect = screen.getByRole('combobox');
    const initialPriority = prioritySelect.value;

    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    expect(mockOnAdd).not.toHaveBeenCalled();
    expect(prioritySelect).toHaveValue(initialPriority); // Priority should not reset
  });

  it('does not call onAdd if input is only whitespace on Enter key press', async () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    const prioritySelect = screen.getByRole('combobox');
    const initialPriority = prioritySelect.value;

    await user.type(inputElement, '   ');
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    expect(mockOnAdd).not.toHaveBeenCalled();
    expect(inputElement).toHaveValue('   '); // Value remains if not added
    expect(prioritySelect).toHaveValue(initialPriority); // Priority should not reset
  });

  it('does not call onAdd on other key presses', async () => {
    const mockOnAdd = jest.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    const inputElement = screen.getByPlaceholderText('Add a new todo...');
    const prioritySelect = screen.getByRole('combobox');
    const initialPriority = prioritySelect.value;

    await user.type(inputElement, 'Some text'); // Ensure input has value
    fireEvent.keyDown(inputElement, { key: 'Escape', code: 'Escape' });
    fireEvent.keyDown(inputElement, { key: 'Tab', code: 'Tab' });
    fireEvent.keyDown(inputElement, { key: 'a', code: 'KeyA' });

    expect(mockOnAdd).not.toHaveBeenCalled();
    expect(inputElement).toHaveValue('Some text'); // Value should remain unchanged
    expect(prioritySelect).toHaveValue(initialPriority); // Priority should not reset
  });
});