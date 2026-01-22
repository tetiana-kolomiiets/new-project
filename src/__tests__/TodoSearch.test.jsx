import { render, screen, fireEvent } from '@testing-library/react';
import TodoSearch from '../src/components/TodoSearch';

describe('TodoSearch', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with an empty search term and correct placeholder', () => {
    render(<TodoSearch onSearch={mockOnSearch} />);
    const searchInput = screen.getByPlaceholderText('Search todos...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveValue('');
    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
  });

  test('calls onSearch with the updated value when typing', () => {
    render(<TodoSearch onSearch={mockOnSearch} />);
    const searchInput = screen.getByPlaceholderText('Search todos...');

    fireEvent.change(searchInput, { target: { value: 'test search' } });

    expect(searchInput).toHaveValue('test search');
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('test search');
  });

  test('shows clear button when there is a search term', () => {
    render(<TodoSearch onSearch={mockOnSearch} />);
    const searchInput = screen.getByPlaceholderText('Search todos...');

    fireEvent.change(searchInput, { target: { value: 'some value' } });

    const clearButton = screen.getByRole('button', { name: /clear search/i });
    expect(clearButton).toBeInTheDocument();
    expect(clearButton).toHaveTextContent('×');
  });

  test('hides clear button when search term is empty', () => {
    render(<TodoSearch onSearch={mockOnSearch} />);
    const searchInput = screen.getByPlaceholderText('Search todos...');

    // Simulate typing and then clearing
    fireEvent.change(searchInput, { target: { value: 'some value' } });
    expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
  });

  test('clears search term and calls onSearch with empty string when clear button is clicked', () => {
    render(<TodoSearch onSearch={mockOnSearch} />);
    const searchInput = screen.getByPlaceholderText('Search todos...');

    // Simulate typing
    fireEvent.change(searchInput, { target: { value: 'initial search' } });
    expect(searchInput).toHaveValue('initial search');
    expect(mockOnSearch).toHaveBeenCalledWith('initial search');
    mockOnSearch.mockClear(); // Clear calls after initial typing

    const clearButton = screen.getByRole('button', { name: /clear search/i });
    fireEvent.click(clearButton);

    expect(searchInput).toHaveValue('');
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('');
    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
  });
});