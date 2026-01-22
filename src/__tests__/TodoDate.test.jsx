import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoDate from '../src/components/TodoDate';

describe('TodoDate', () => {
  // Set a fixed current date for consistent testing of relative time (Today, Yesterday, X days ago)
  const MOCK_CURRENT_DATE = new Date('2023-11-10T12:00:00.000Z'); // November 10, 2023, 12:00 PM UTC

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(MOCK_CURRENT_DATE);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders null when createdAt is not provided', () => {
    const { container } = render(<TodoDate createdAt={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders "Today" for a date created today', () => {
    // A date on the same day as MOCK_CURRENT_DATE
    const today = new Date('2023-11-10T08:00:00.000Z');
    render(<TodoDate createdAt={today} />);
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Today')).toHaveAttribute('title', today.toLocaleString());
  });

  it('renders "Yesterday" for a date created yesterday', () => {
    // A date one day before MOCK_CURRENT_DATE
    const yesterday = new Date('2023-11-09T18:00:00.000Z');
    render(<TodoDate createdAt={yesterday} />);
    expect(screen.getByText('Yesterday')).toBeInTheDocument();
    expect(screen.getByText('Yesterday')).toHaveAttribute('title', yesterday.toLocaleString());
  });

  it('renders "X days ago" for dates within the last week (2-6 days ago)', () => {
    // A date three days before MOCK_CURRENT_DATE
    const threeDaysAgo = new Date('2023-11-07T10:00:00.000Z');
    render(<TodoDate createdAt={threeDaysAgo} />);
    expect(screen.getByText('3 days ago')).toBeInTheDocument();
    expect(screen.getByText('3 days ago')).toHaveAttribute('title', threeDaysAgo.toLocaleString());

    // Test another case, e.g., 5 days ago
    const fiveDaysAgo = new Date('2023-11-05T09:00:00.000Z');
    render(<TodoDate createdAt={fiveDaysAgo} />);
    expect(screen.getByText('5 days ago')).toBeInTheDocument();
    expect(screen.getByText('5 days ago')).toHaveAttribute('title', fiveDaysAgo.toLocaleString());
  });

  it('renders formatted date (Month Day) for dates more than a week ago in the same year', () => {
    // A date on October 31, 2023 (more than 7 days before Nov 10, 2023)
    const tenDaysAgo = new Date('2023-10-31T09:00:00.000Z');
    render(<TodoDate createdAt={tenDaysAgo} />);
    // Using 'en-US' locale, it should format as 'Oct 31'
    expect(screen.getByText('Oct 31')).toBeInTheDocument();
    expect(screen.getByText('Oct 31')).toHaveAttribute('title', tenDaysAgo.toLocaleString());

    // A date earlier in the same year, e.g., Jan 15, 2023
    const earlyThisYear = new Date('2023-01-15T12:00:00.000Z');
    render(<TodoDate createdAt={earlyThisYear} />);
    expect(screen.getByText('Jan 15')).toBeInTheDocument();
    expect(screen.getByText('Jan 15')).toHaveAttribute('title', earlyThisYear.toLocaleString());
  });

  it('renders formatted date (Month Day, Year) for dates more than a week ago in a different year', () => {
    // A date on November 1, 2022 (different year from MOCK_CURRENT_DATE)
    const lastYearDate = new Date('2022-11-01T15:00:00.000Z');
    render(<TodoDate createdAt={lastYearDate} />);
    // Using 'en-US' locale, it should format as 'Nov 1, 2022'
    expect(screen.getByText('Nov 1, 2022')).toBeInTheDocument();
    expect(screen.getByText('Nov 1, 2022')).toHaveAttribute('title', lastYearDate.toLocaleString());
  });

  it('sets the full date and time in the title attribute for accessibility', () => {
    const testDate = new Date('2023-10-25T14:30:00.000Z');
    render(<TodoDate createdAt={testDate} />);
    // Regardless of the displayed text, the title should be the full locale string
    expect(screen.getByText('Oct 25')).toHaveAttribute('title', testDate.toLocaleString());
  });
});