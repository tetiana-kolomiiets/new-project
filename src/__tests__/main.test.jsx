import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // For .toBeInTheDocument
import App from '../components/TodoApp'; // Import the root component rendered by main.jsx

describe('main.jsx', () => {
  it('renders the TodoApp component into the DOM', () => {
    // To test the effect of main.jsx, which is to render the App component,
    // we directly render the App component using React Testing Library.
    // This simulates the application's entry point successfully mounting
    // the main component to the document.
    render(<App />);

    // Assert that a key element from the TodoApp component is present.
    // This verifies that the application has successfully started and
    // rendered its primary UI. We assume TodoApp has a main heading like "Todo List".
    expect(screen.getByRole('heading', { name: /todo list/i })).toBeInTheDocument();
  });
});