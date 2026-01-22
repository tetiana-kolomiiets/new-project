import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterTabs from '../src/components/FilterTabs';

describe('FilterTabs', () => {
  it('renders all filter options and marks the correct one as active', () => {
    const mockOnChange = jest.fn();
    render(<FilterTabs filter="active" onChange={mockOnChange} />);

    // Check if all buttons are rendered
    const allButton = screen.getByRole('button', { name: /all/i });
    const activeButton = screen.getByRole('button', { name: /active/i });
    const completedButton = screen.getByRole('button', { name: /done/i });

    expect(allButton).toBeInTheDocument();
    expect(activeButton).toBeInTheDocument();
    expect(completedButton).toBeInTheDocument();

    // Check if the 'active' filter button has the 'active' class
    expect(allButton).not.toHaveClass('active');
    expect(activeButton).toHaveClass('active');
    expect(completedButton).not.toHaveClass('active');
  });

  it('calls onChange with the correct filter ID when a button is clicked', () => {
    const mockOnChange = jest.fn();
    render(<FilterTabs filter="all" onChange={mockOnChange} />);

    const completedButton = screen.getByRole('button', { name: /done/i });
    fireEvent.click(completedButton);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('completed');

    const allButton = screen.getByRole('button', { name: /all/i });
    fireEvent.click(allButton);
    expect(mockOnChange).toHaveBeenCalledTimes(2);
    expect(mockOnChange).toHaveBeenCalledWith('all');

    const activeButton = screen.getByRole('button', { name: /active/i });
    fireEvent.click(activeButton);
    expect(mockOnChange).toHaveBeenCalledTimes(3);
    expect(mockOnChange).toHaveBeenCalledWith('active');
  });

  it('initially renders with no active class if filter prop does not match any option', () => {
    const mockOnChange = jest.fn();
    render(<FilterTabs filter="unknown" onChange={mockOnChange} />);

    const allButton = screen.getByRole('button', { name: /all/i });
    const activeButton = screen.getByRole('button', { name: /active/i });
    const completedButton = screen.getByRole('button', { name: /done/i });

    expect(allButton).not.toHaveClass('active');
    expect(activeButton).not.toHaveClass('active');
    expect(completedButton).not.toHaveClass('active');
  });
});