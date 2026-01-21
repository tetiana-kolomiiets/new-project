import { render, screen, fireEvent } from '@testing-library/react';
import TodoFilters from '../src/components/TodoFilters';
import '@testing-library/jest-dom';

describe('TodoFilters', () => {
  it('renders all filter buttons and applies active class based on the current filter', () => {
    const mockOnChange = jest.fn();

    // Test with 'all' filter initially active
    const { rerender } = render(<TodoFilters filter="all" onChange={mockOnChange} />);

    const allButton = screen.getByRole('button', { name: /all/i });
    const activeButton = screen.getByRole('button', { name: /active/i });
    const completedButton = screen.getByRole('button', { name: /completed/i });

    expect(allButton).toBeInTheDocument();
    expect(activeButton).toBeInTheDocument();
    expect(completedButton).toBeInTheDocument();

    expect(allButton).toHaveClass('active');
    expect(activeButton).not.toHaveClass('active');
    expect(completedButton).not.toHaveClass('active');

    // Rerender with 'active' filter
    rerender(<TodoFilters filter="active" onChange={mockOnChange} />);
    expect(allButton).not.toHaveClass('active');
    expect(activeButton).toHaveClass('active');
    expect(completedButton).not.toHaveClass('active');

    // Rerender with 'completed' filter
    rerender(<TodoFilters filter="completed" onChange={mockOnChange} />);
    expect(allButton).not.toHaveClass('active');
    expect(activeButton).not.toHaveClass('active');
    expect(completedButton).toHaveClass('active');
  });

  it('calls onChange with the correct filter value when a button is clicked', () => {
    const mockOnChange = jest.fn();
    render(<TodoFilters filter="all" onChange={mockOnChange} />);

    const allButton = screen.getByRole('button', { name: /all/i });
    const activeButton = screen.getByRole('button', { name: /active/i });
    const completedButton = screen.getByRole('button', { name: /completed/i });

    fireEvent.click(activeButton);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('active');

    fireEvent.click(completedButton);
    expect(mockOnChange).toHaveBeenCalledTimes(2);
    expect(mockOnChange).toHaveBeenCalledWith('completed');

    fireEvent.click(allButton);
    expect(mockOnChange).toHaveBeenCalledTimes(3);
    expect(mockOnChange).toHaveBeenCalledWith('all');

    // Ensure no additional calls after the last click
    expect(mockOnChange).toHaveBeenCalledTimes(3);
  });
});