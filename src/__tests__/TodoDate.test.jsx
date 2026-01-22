import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoDate from '../src/components/TodoDate';

describe('TodoDate', () => {
  // Set a fixed current date for consistent testing of relative time
  const MOCK_CURRENT_DATE = new Date('2023-11-10T12:00:00'); // November 10, 2023, 12:00 PM (local time)

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

  it('renders "just now" for a date created within the last minute', () => {
    const justNow = new Date('2023-11-10T11:59:45'); // 15 seconds before MOCK_CURRENT_DATE
    render(<TodoDate createdAt={justNow} />);
    expect(screen.getByText('📅 just now')).toBeInTheDocument();
    expect(screen.getByText('📅 just now')).toHaveAttribute('title', justNow.toLocaleString());
  });

  it('renders "Xm ago" for dates created within the last hour', () => {
    const fiveMinutesAgo = new Date('2023-11-10T11:55:00'); // 5 minutes before
    render(<TodoDate createdAt={fiveMinutesAgo} />);
    expect(screen.getByText('📅 5m ago')).toBeInTheDocument();
    expect(screen.getByText('📅 5m ago')).toHaveAttribute('title', fiveMinutesAgo.toLocaleString());

    // Test another case, e.g., 59 minutes ago
    const fiftyNineMinutesAgo = new Date('2023-11-10T11:01:00'); // 59 minutes before
    render(<TodoDate createdAt={fiftyNineMinutesAgo} />);
    expect(screen.getByText('📅 59m ago')).toBeInTheDocument();
    expect(screen.getByText('📅 59m ago')).toHaveAttribute('title', fiftyNineMinutesAgo.toLocaleString());
  });

  it('renders "Xh ago" for dates created within the last 24 hours', () => {
    const twoHoursAgo = new Date('2023-11-10T10:00:00'); // 2 hours before
    render(<TodoDate createdAt={twoHoursAgo} />);
    expect(screen.getByText('📅 2h ago')).toBeInTheDocument();
    expect(screen.getByText('📅 2h ago')).toHaveAttribute('title', twoHoursAgo.toLocaleString());

    // Test another case, e.g., 23 hours ago
    const twentyThreeHoursAgo = new Date('2023-11-09T13:00:00'); // 23 hours before
    render(<TodoDate createdAt={twentyThreeHoursAgo} />);
    expect(screen.getByText('📅 23h ago')).toBeInTheDocument();
    expect(screen.getByText('📅 23h ago')).toHaveAttribute('title', twentyThreeHoursAgo.toLocaleString());
  });

  it('renders "1d ago" for a date created yesterday (diffDays = 1)', () => {
    const oneDayAgo = new Date('2023-11-09T11:00:00'); // 25 hours before (diffDays will be 1)
    render(<TodoDate createdAt={oneDayAgo} />);
    expect(screen.getByText('📅 1d ago')).toBeInTheDocument();
    expect(screen.getByText('📅 1d ago')).toHaveAttribute('title', oneDayAgo.toLocaleString());
  });

  it('renders "Xd ago" for dates 2-6 days ago', () => {
    const twoDaysAgo = new Date('2023-11-08T11:00:00');
    render(<TodoDate createdAt={twoDaysAgo} />);
    expect(screen.getByText('📅 2d ago')).toBeInTheDocument();
    expect(screen.getByText('📅 2d ago')).toHaveAttribute('title', twoDaysAgo.toLocaleString());

    const sixDaysAgo = new Date('2023-11-04T11:00:00');
    render(<TodoDate createdAt={sixDaysAgo} />);
    expect(screen.getByText('📅 6d ago')).toBeInTheDocument();
    expect(screen.getByText('📅 6d ago')).toHaveAttribute('title', sixDaysAgo.toLocaleString());
  });

  it('renders "Xw ago" for dates 1-4 weeks ago (7-29 days ago)', () => {
    const oneWeekAgo = new Date('2023-11-03T11:00:00'); // 7 days before, diffDays = 7
    render(<TodoDate createdAt={oneWeekAgo} />);
    expect(screen.getByText('📅 1w ago')).toBeInTheDocument();
    expect(screen.getByText('📅 1w ago')).toHaveAttribute('title', oneWeekAgo.toLocaleString());

    const fourWeeksAgo = new Date('2023-10-12T11:00:00'); // 29 days before, diffDays = 29
    render(<TodoDate createdAt={fourWeeksAgo} />);
    expect(screen.getByText('📅 4w ago')).toBeInTheDocument();
    expect(screen.getByText('📅 4w ago')).toHaveAttribute('title', fourWeeksAgo.toLocaleString());
  });

  it('renders formatted date (Month Day) for dates 30 days or older', () => {
    const thirtyDaysAgo = new Date('2023-10-11T11:00:00'); // 30 days before, diffDays = 30
    render(<TodoDate createdAt={thirtyDaysAgo} />);
    // Using 'en-US' locale, it should format as 'Oct 11' (no year)
    expect(screen.getByText('📅 Oct 11')).toBeInTheDocument();
    expect(screen.getByText('📅 Oct 11')).toHaveAttribute('title', thirtyDaysAgo.toLocaleString());

    // Test a date from a different year, still no year in displayed text
    const lastYearDate = new Date('2022-11-01T15:00:00');
    render(<TodoDate createdAt={lastYearDate} />);
    expect(screen.getByText('📅 Nov 1')).toBeInTheDocument();
    expect(screen.getByText('📅 Nov 1')).toHaveAttribute('title', lastYearDate.toLocaleString());
  });

  it('sets the full date and time in the title attribute for accessibility', () => {
    const testDate = new Date('2023-10-25T14:30:00'); // This date would display as "Oct 25"
    render(<TodoDate createdAt={testDate} />);
    // Regardless of the displayed text, the title should be the full locale string
    expect(screen.getByText('📅 Oct 25')).toHaveAttribute('title', testDate.toLocaleString());
  });
});