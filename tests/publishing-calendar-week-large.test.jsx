import { fireEvent, render, screen, within } from '@testing-library/react';
import dayjs from 'dayjs';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { WeekBoard } from '../src/pages/PublishingCalendar/PublishingCalendarViews';

const weekPosts = {
  '2026-05-11': [
    {
      id: 'week-fb-1',
      date: '2026-05-11',
      scheduledAt: '2026-05-11T10:00:00+07:00',
      timeLabel: '10:00 am',
      channelName: 'Garena Delta Force',
      platform: 'facebook',
      postType: 'video',
      status: 'scheduled',
      caption: 'Welcome Haisaki to the weekly Delta Force special mission.',
      mediaCount: 1,
      tags: ['Campaign'],
      metricLabel: '3%',
      hasConversation: true,
    },
  ],
  '2026-05-12': [
    {
      id: 'week-fb-2',
      date: '2026-05-12',
      scheduledAt: '2026-05-12T09:00:00+07:00',
      timeLabel: '9:00 am',
      channelName: 'Garena Delta Force',
      platform: 'facebook',
      postType: 'image',
      status: 'scheduled',
      caption: 'Campaign tactical win carousel for the morning publishing slot.',
      mediaCount: 1,
      tags: ['Community'],
      metricLabel: '9%',
      hasConversation: false,
    },
  ],
};

const sameHourPosts = {
  '2026-05-13': [
    {
      id: 'week-fb-noon-1',
      date: '2026-05-13',
      scheduledAt: '2026-05-13T12:00:00+07:00',
      timeLabel: '12:00 pm',
      channelName: 'Garena Delta Force',
      platform: 'facebook',
      postType: 'video',
      status: 'scheduled',
      caption: 'First noon post.',
      mediaCount: 1,
      tags: ['Campaign'],
      metricLabel: '3%',
      hasConversation: true,
    },
    {
      id: 'week-fb-noon-2',
      date: '2026-05-13',
      scheduledAt: '2026-05-13T12:10:00+07:00',
      timeLabel: '12:10 pm',
      channelName: 'Garena Delta Force',
      platform: 'tiktok',
      postType: 'video',
      status: 'scheduled',
      caption: 'Second noon post.',
      mediaCount: 1,
      tags: ['Community'],
      metricLabel: '6%',
      hasConversation: true,
    },
    {
      id: 'week-fb-noon-3',
      date: '2026-05-13',
      scheduledAt: '2026-05-13T12:11:00+07:00',
      timeLabel: '12:11 pm',
      channelName: 'Garena Delta Force',
      platform: 'youtube',
      postType: 'video',
      status: 'scheduled',
      caption: 'Third noon post.',
      mediaCount: 1,
      tags: ['Community'],
      metricLabel: '9%',
      hasConversation: false,
    },
  ],
};

describe('Publishing Calendar large week view', () => {
  it('renders a time-grid week board with scheduled cards in their day lanes', () => {
    const { container } = render(
      <MemoryRouter>
        <WeekBoard
          currentDate={dayjs('2026-05-15')}
          density="expanded"
          postsByDate={weekPosts}
          onCreatePost={vi.fn()}
          onOpenPost={vi.fn()}
        />
      </MemoryRouter>,
    );
    const largeWeekBoard = container.querySelector('.publishing-calendar-week-board.is-large');

    expect(screen.getByText('Monday 11')).toBeInTheDocument();
    expect(screen.getByText('Friday 15')).toBeInTheDocument();
    expect(screen.getByText('12 am')).toBeInTheDocument();
    expect(screen.getByText('9 am')).toBeInTheDocument();
    expect(screen.getByText('10 am')).toBeInTheDocument();
    expect(screen.getByText('11 pm')).toBeInTheDocument();
    expect(screen.getByText('Campaign tactical win carousel for the morning publishing slot.')).toBeInTheDocument();
    expect(screen.getByText('Welcome Haisaki to the weekly Delta Force special mission.')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /More actions for Garena Delta Force/ })).toHaveLength(2);
    expect(largeWeekBoard.scrollTop).toBe(1376);
  }, 10000);

  it('keeps the day header add action wired in large week view', () => {
    const onCreatePost = vi.fn();

    render(
      <MemoryRouter>
        <WeekBoard
          currentDate={dayjs('2026-05-15')}
          density="expanded"
          postsByDate={weekPosts}
          onCreatePost={onCreatePost}
          onOpenPost={vi.fn()}
        />
      </MemoryRouter>,
    );

    const mondayHeader = screen.getByText('Monday 11').closest('.publishing-calendar-week-header');
    fireEvent.click(within(mondayHeader).getByRole('button', { name: 'Add post or note for Monday 11' }));

    expect(onCreatePost).toHaveBeenCalledTimes(1);
    expect(onCreatePost.mock.calls[0][0].format('YYYY-MM-DD')).toBe('2026-05-11');
  }, 10000);

  it('stacks same-hour posts by time order and expands the hour row', () => {
    const { container } = render(
      <MemoryRouter>
        <WeekBoard
          currentDate={dayjs('2026-05-15')}
          density="expanded"
          postsByDate={sameHourPosts}
          onCreatePost={vi.fn()}
          onOpenPost={vi.fn()}
        />
      </MemoryRouter>,
    );

    const largeWeekBoard = container.querySelector('.publishing-calendar-week-board.is-large');
    const largeEvents = [...container.querySelectorAll('.publishing-calendar-week-large-event')];

    expect(screen.getByText('First noon post.')).toBeInTheDocument();
    expect(screen.getByText('Second noon post.')).toBeInTheDocument();
    expect(screen.getByText('Third noon post.')).toBeInTheDocument();
    expect(largeEvents.map((event) => event.style.top)).toEqual(['2076px', '2242px', '2408px']);
    expect(largeWeekBoard.style.gridTemplateRows).toContain('504px');
  }, 10000);
});
