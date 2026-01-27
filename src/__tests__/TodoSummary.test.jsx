import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodoSummary from "../components/TodoSummary";

describe("TodoSummary", () => {
  it("renders nothing when there are no todos", () => {
    const { container } = render(<TodoSummary todos={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("displays '1 task left out of 1 total' when one todo is pending", () => {
    const todos = [{ id: 1, text: "Buy milk", completed: false }];
    render(<TodoSummary todos={todos} />);
    expect(screen.getByText("1 task left")).toBeInTheDocument();
    expect(screen.getByText("out of 1 total")).toBeInTheDocument();
  });

  it("displays '0 tasks left out of 1 total' when one todo is completed", () => {
    const todos = [{ id: 1, text: "Buy milk", completed: true }];
    render(<TodoSummary todos={todos} />);
    expect(screen.getByText("0 tasks left")).toBeInTheDocument();
    expect(screen.getByText("out of 1 total")).toBeInTheDocument();
  });

  it("displays correct summary for multiple todos with some completed", () => {
    const todos = [
      { id: 1, text: "Task 1", completed: false },
      { id: 2, text: "Task 2", completed: true },
      { id: 3, text: "Task 3", completed: false },
    ];
    render(<TodoSummary todos={todos} />);
    expect(screen.getByText("2 tasks left")).toBeInTheDocument();
    expect(screen.getByText("out of 3 total")).toBeInTheDocument();
  });

  it("displays correct summary for multiple todos with all completed", () => {
    const todos = [
      { id: 1, text: "Task 1", completed: true },
      { id: 2, text: "Task 2", completed: true },
    ];
    render(<TodoSummary todos={todos} />);
    expect(screen.getByText("0 tasks left")).toBeInTheDocument();
    expect(screen.getByText("out of 2 total")).toBeInTheDocument();
  });

  it("displays correct summary for multiple todos with all pending", () => {
    const todos = [
      { id: 1, text: "Task 1", completed: false },
      { id: 2, text: "Task 2", completed: false },
    ];
    render(<TodoSummary todos={todos} />);
    expect(screen.getByText("2 tasks left")).toBeInTheDocument();
    expect(screen.getByText("out of 2 total")).toBeInTheDocument();
  });

  it("applies correct class names to summary spans", () => {
    const todos = [{ id: 1, text: "Task 1", completed: false }];
    render(<TodoSummary todos={todos} />);

    const mainSpan = screen.getByText(/tasks? left/i);
    const subSpan = screen.getByText(/out of \d+ total/i);

    expect(mainSpan).toHaveClass("todo-summary-main");
    expect(subSpan).toHaveClass("todo-summary-sub");

    // Also check the main container div
    expect(mainSpan.closest('div')).toHaveClass('todo-summary');
  });
});