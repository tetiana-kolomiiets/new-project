import { render, screen, fireEvent } from '@testing-library/react';
import TodoFilters from '../TodoFilters';

describe('TodoFilters', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    // Clear mock calls before each test to ensure isolation
    mockOnChange.mockClear();
  });

  test('renders all three filter buttons', () => {
    render(<TodoFilters filter="all" onChange={mockOnChange} />);

    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /active/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /completed/i })).toBeInTheDocument();
  });

  test('applies the active class to the "All" button when filter is "all"', () => {
    render(<TodoFilters filter="all" onChange={mockOnChange} />);

    expect(screen.getByRole('button', { name: /all/i })).toHaveClass('active');
    expect(screen.getByRole('button', { name: /active/i })).not.toHaveClass('active');
    expect(screen.getByRole('button', { name: /completed/i })).not.toHaveClass('active');
  });

  test('applies the active class to the "Active" button when filter is "active"', () => {
    render(<TodoFilters filter="active" onChange={mockOnChange} />);

    expect(screen.getByRole('button', { name: /all/i })).not.toHaveClass('active');
    expect(screen.getByRole('button', { name: /active/i })).toHaveClass('active');
    expect(screen.getByRole('button', { name: /completed/i })).not.toHaveClass('active');
  });

  test('applies the active class to the "Completed" button when filter is "completed"', () => {
    render(<TodoFilters filter="completed" onChange={mockOnChange} />);

    expect(screen.getByRole('button', { name: /all/i })).not.toHaveClass('active');
    expect(screen.getByRole('button', { name: /active/i })).not.toHaveClass('active');
    expect(screen.getByRole('button', { name: /completed/i })).toHaveClass('active');
  });

  test('calls onChange with "all" when the "All" button is clicked', () => {
    render(<TodoFilters filter="active" onChange={mockOnChange} />); // Start with a different filter
    fireEvent.click(screen.getByRole('button', { name: /all/i }));

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('all');
  });

  test('calls onChange with "active" when the "Active" button is clicked', () => {
    render(<TodoFilters filter="all" onChange={mockOnChange} />); // Start with a different filter
    fireEvent.click(screen.getByRole('button', { name: /active/i }));

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('active');
  });

  test('calls onChange with "completed" when the "Completed" button is clicked', () => {
    render(<TodoFilters filter="all" onChange={mockOnChange} />); // Start with a different filter
    fireEvent.click(screen.getByRole('button', { name: /completed/i }));

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('completed');
  });
});