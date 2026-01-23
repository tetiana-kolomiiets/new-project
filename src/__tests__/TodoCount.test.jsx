import { render, screen } from '@testing-library/react';
import TodoCount from '../components/TodoCount';

describe('TodoCount', () => {
  it('renders nothing when count is 0', () => {
    const { container } = render(<TodoCount count={0} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the correct count and singular "todo" when count is 1', () => {
    render(<TodoCount count={1} />);
    expect(screen.getByText('1 todo')).toBeInTheDocument();
  });

  it('renders the correct count and plural "todos" when count is greater than 1', () => {
    render(<TodoCount count={5} />);
    expect(screen.getByText('5 todos')).toBeInTheDocument();
  });

  it('has the class "todo-count" when rendered', () => {
    render(<TodoCount count={3} />);
    expect(screen.getByText('3 todos')).toHaveClass('todo-count');
  });
});