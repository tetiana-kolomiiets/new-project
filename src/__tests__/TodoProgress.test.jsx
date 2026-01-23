import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoProgress from '../components/TodoProgress';

describe('TodoProgress', () => {
  test('renders null when no todos are provided', () => {
    const { container } = render(<TodoProgress todos={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('displays 0% when no todos are completed', () => {
    const todos = [
      { id: 1, text: 'Buy milk', completed: false },
      { id: 2, text: 'Walk dog', completed: false },
    ];
    render(<TodoProgress todos={todos} />);

    const progressText = screen.getByText('0% completed');
    expect(progressText).toBeInTheDocument();

    // Verify the visual progress bar fill width
    const progressFill = progressText.previousElementSibling.querySelector('.progress-fill');
    expect(progressFill).toHaveStyle('width: 0%');
  });

  test('displays correct percentage when some todos are completed', () => {
    const todos = [
      { id: 1, text: 'Buy milk', completed: true },
      { id: 2, text: 'Walk dog', completed: false },
      { id: 3, text: 'Code', completed: true },
      { id: 4, text: 'Read', completed: false },
    ]; // 2 out of 4 = 50%
    render(<TodoProgress todos={todos} />);

    const progressText = screen.getByText('50% completed');
    expect(progressText).toBeInTheDocument();

    const progressFill = progressText.previousElementSibling.querySelector('.progress-fill');
    expect(progressFill).toHaveStyle('width: 50%');
  });

  test('displays 100% when all todos are completed', () => {
    const todos = [
      { id: 1, text: 'Buy milk', completed: true },
      { id: 2, text: 'Walk dog', completed: true },
    ];
    render(<TodoProgress todos={todos} />);

    const progressText = screen.getByText('100% completed');
    expect(progressText).toBeInTheDocument();

    const progressFill = progressText.previousElementSibling.querySelector('.progress-fill');
    expect(progressFill).toHaveStyle('width: 100%');
  });

  test('handles fractional percentages correctly by rounding', () => {
    const todos = [
      { id: 1, text: 'Task 1', completed: true },
      { id: 2, text: 'Task 2', completed: false },
      { id: 3, text: 'Task 3', completed: false },
    ]; // 1 out of 3 = 33.33% which should be rounded to 33%
    render(<TodoProgress todos={todos} />);

    const progressText = screen.getByText('33% completed');
    expect(progressText).toBeInTheDocument();

    const progressFill = progressText.previousElementSibling.querySelector('.progress-fill');
    expect(progressFill).toHaveStyle('width: 33%');
  });
});