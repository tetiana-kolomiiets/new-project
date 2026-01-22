import { render, screen, fireEvent } from '@testing-library/react';
import TodoSort from '../src/components/TodoSort';

describe('TodoSort', () => {
  const mockOnSortChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the sort label and select element', () => {
    render(<TodoSort sortBy="newest" onSortChange={mockOnSortChange} />);

    expect(screen.getByText(/Sort by:/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('displays the correct initial sort value', () => {
    render(<TodoSort sortBy="oldest" onSortChange={mockOnSortChange} />);

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveValue('oldest');
  });

  test('renders all sort options', () => {
    render(<TodoSort sortBy="newest" onSortChange={mockOnSortChange} />);

    expect(screen.getByRole('option', { name: 'Newest First' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Oldest First' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'A-Z' })).toBeInTheDocument();
  });

  test('calls onSortChange with the new value when an option is selected', () => {
    render(<TodoSort sortBy="newest" onSortChange={mockOnSortChange} />);

    const selectElement = screen.getByRole('combobox');

    fireEvent.change(selectElement, { target: { value: 'oldest' } });

    expect(mockOnSortChange).toHaveBeenCalledTimes(1);
    expect(mockOnSortChange).toHaveBeenCalledWith('oldest');

    fireEvent.change(selectElement, { target: { value: 'alphabetical' } });

    expect(mockOnSortChange).toHaveBeenCalledTimes(2);
    expect(mockOnSortChange).toHaveBeenCalledWith('alphabetical');
  });
});