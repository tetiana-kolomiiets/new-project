import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoStats from '../components/TodoStats';

describe('TodoStats', () => {
  it('displays 0 for total, active, and completed when no todos are provided', () => {
    render(<TodoStats todos={[]} />);

    const totalStat = screen.getByText('Total:').closest('.stat-item');
    expect(totalStat).toHaveTextContent('Total:0');

    const activeStat = screen.getByText('Active:').closest('.stat-item');
    expect(activeStat).toHaveTextContent('Active:0');

    const completedStat = screen.getByText('Completed:').closest('.stat-item');
    expect(completedStat).toHaveTextContent('Completed:0');
  });

  it('displays correct counts for a mixed list of todos', () => {
    const todos = [
      { id: 1, text: 'Learn React', completed: true },
      { id: 2, text: 'Build a Todo App', completed: false },
      { id: 3, text: 'Deploy to Netlify', completed: false },
    ];

    render(<TodoStats todos={todos} />);

    const totalStat = screen.getByText('Total:').closest('.stat-item');
    expect(totalStat).toHaveTextContent('Total:3');

    const activeStat = screen.getByText('Active:').closest('.stat-item');
    expect(activeStat).toHaveTextContent('Active:2');

    const completedStat = screen.getByText('Completed:').closest('.stat-item');
    expect(completedStat).toHaveTextContent('Completed:1');
  });

  it('displays correct counts when all todos are active', () => {
    const todos = [
      { id: 1, text: 'Learn React', completed: false },
      { id: 2, text: 'Build a Todo App', completed: false },
    ];

    render(<TodoStats todos={todos} />);

    const totalStat = screen.getByText('Total:').closest('.stat-item');
    expect(totalStat).toHaveTextContent('Total:2');

    const activeStat = screen.getByText('Active:').closest('.stat-item');
    expect(activeStat).toHaveTextContent('Active:2');

    const completedStat = screen.getByText('Completed:').closest('.stat-item');
    expect(completedStat).toHaveTextContent('Completed:0');
  });

  it('displays correct counts when all todos are completed', () => {
    const todos = [
      { id: 1, text: 'Learn React', completed: true },
      { id: 2, text: 'Build a Todo App', completed: true },
    ];

    render(<TodoStats todos={todos} />);

    const totalStat = screen.getByText('Total:').closest('.stat-item');
    expect(totalStat).toHaveTextContent('Total:2');

    const activeStat = screen.getByText('Active:').closest('.stat-item');
    expect(activeStat).toHaveTextContent('Active:0');

    const completedStat = screen.getByText('Completed:').closest('.stat-item');
    expect(completedStat).toHaveTextContent('Completed:2');
  });
});