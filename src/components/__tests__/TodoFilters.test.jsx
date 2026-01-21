import { render, screen, fireEvent } from '@testing-library/react';
import TodoFilters from '../TodoFilters';

describe('TodoFilters', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all three filter buttons', () => {
    render(<TodoFilters filter="all" onChange={mockOnChange} />);

    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /active/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /completed/i })).toBeInTheDocument();
  });

  it('applies the "active" class to the correct button based on the filter prop', () => {
    const { rerender } = render(<TodoFilters filter="all" onChange={mockOnChange} />);

    // Initial render with 'all'
    expect(screen.getByRole('button', { name: /all/i })).toHaveClass('active');
    expect(screen.getByRole('button', { name: /active/i })).not.toHaveClass('active');
    expect(screen.getByRole('button', { name: /completed/i })).not.toHaveClass('active');

    // Rerender with 'active'
    rerender(<TodoFilters filter="active" onChange={mockOnChange} />);
    expect(screen.getByRole('button', { name: /all/i })).not.toHaveClass('active');
    expect(screen.getByRole('button', { name: /active/i })).toHaveClass('active');
    expect(screen.getByRole('button', { name: /completed/i })).not.toHaveClass('active');

    // Rerender with 'completed'
    rerender(<TodoFilters filter="completed" onChange={mockOnChange} />);
    expect(screen.getByRole('button', { name: /all/i })).not.toHaveClass('active');
    expect(screen.getByRole('button', { name: /active/i })).not.toHaveClass('active');
    expect(screen.getByRole('button', { name: /completed/i })).toHaveClass('active');
  });

  it('calls onChange with the correct filter value when a button is clicked', () => {
    render(<TodoFilters filter="all" onChange={mockOnChange} />);

    const allButton = screen.getByRole('button', { name: /all/i });
    const activeButton = screen.getByRole('button', { name: /active/i });
    const completedButton = screen.getByRole('button', { name: /completed/i });

    fireEvent.click(allButton);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('all');

    fireEvent.click(activeButton);
    expect(mockOnChange).toHaveBeenCalledTimes(2);
    expect(mockOnChange).toHaveBeenCalledWith('active');

    fireEvent.click(completedButton);
    expect(mockOnChange).toHaveBeenCalledTimes(3);
    expect(mockOnChange).toHaveBeenCalledWith('completed');
  });
});