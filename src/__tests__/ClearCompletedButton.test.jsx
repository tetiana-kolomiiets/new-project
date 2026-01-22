import { render, screen, fireEvent } from '@testing-library/react';
import ClearCompletedButton from '../components/ClearCompletedButton';

describe('ClearCompletedButton', () => {
  it('renders the button when completedCount is greater than 0', () => {
    const onClearMock = jest.fn();
    render(<ClearCompletedButton completedCount={5} onClear={onClearMock} />);

    const button = screen.getByRole('button', { name: /Clear Completed \(5\)/i });
    expect(button).toBeInTheDocument();
  });

  it('does not render the button when completedCount is 0', () => {
    const onClearMock = jest.fn();
    render(<ClearCompletedButton completedCount={0} onClear={onClearMock} />);

    const button = screen.queryByRole('button', { name: /Clear Completed/i });
    expect(button).not.toBeInTheDocument();
  });

  it('calls onClear when the button is clicked', () => {
    const onClearMock = jest.fn();
    render(<ClearCompletedButton completedCount={3} onClear={onClearMock} />);

    const button = screen.getByRole('button', { name: /Clear Completed \(3\)/i });
    fireEvent.click(button);

    expect(onClearMock).toHaveBeenCalledTimes(1);
  });

  it('displays the correct completedCount in the button text', () => {
    const onClearMock = jest.fn();
    render(<ClearCompletedButton completedCount={12} onClear={onClearMock} />);

    const button = screen.getByRole('button', { name: 'Clear Completed (12)' });
    expect(button).toBeInTheDocument();
  });
});