import { fireEvent, render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import {
  CalendarGrid,
  CalendarPostSidePanel,
} from '../src/pages/PublishingCalendar/PublishingCalendarViews';

const monthPosts = {
  '2026-05-08': [
    {
      id: 'fb-1',
      date: '2026-05-08',
      scheduledAt: '2026-05-08T09:00:00+07:00',
      timeLabel: '9:00 am',
      channelName: 'Garena Delta Force',
      platform: 'facebook',
      postType: 'image',
      status: 'scheduled',
      caption: 'First Facebook post',
      mediaCount: 1,
      tags: ['Campaign'],
      metricLabel: '3%',
      hasConversation: true,
    },
    {
      id: 'fb-2',
      date: '2026-05-08',
      scheduledAt: '2026-05-08T12:00:00+07:00',
      timeLabel: '12:00 pm',
      channelName: 'Garena Delta Force',
      platform: 'facebook',
      postType: 'image',
      status: 'scheduled',
      caption: 'Second Facebook post',
      mediaCount: 1,
      tags: ['Campaign'],
      metricLabel: '5%',
      hasConversation: false,
    },
    {
      id: 'tt-1',
      date: '2026-05-08',
      scheduledAt: '2026-05-08T16:00:00+07:00',
      timeLabel: '4:00 pm',
      channelName: 'Garena Delta Force TikTok',
      platform: 'tiktok',
      postType: 'video',
      status: 'scheduled',
      caption: 'TikTok post',
      mediaCount: 1,
      tags: ['Video'],
      metricLabel: '8%',
      hasConversation: false,
    },
  ],
};

const futureSidePanelPosts = monthPosts['2026-05-08']
  .filter((post) => post.platform === 'facebook')
  .map((post, index) => ({
    ...post,
    date: '2026-05-22',
    scheduledAt: `2026-05-22T${index === 0 ? '09' : '12'}:00:00+07:00`,
  }));

describe('Publishing Calendar compact month view', () => {
  it('limits large month days to five posts and opens the day side panel from view more', () => {
    const onOpenDayPosts = vi.fn();
    const busyDayPosts = Array.from({ length: 7 }, (_, index) => ({
      id: `busy-${index + 1}`,
      date: '2026-05-08',
      scheduledAt: `2026-05-08T${String(9 + index).padStart(2, '0')}:00:00+07:00`,
      timeLabel: `${9 + index}:00 am`,
      channelName: 'Garena Delta Force',
      platform: 'facebook',
      postType: 'image',
      status: 'scheduled',
      caption: `Large month post ${index + 1}`,
      mediaCount: 1,
      tags: ['Campaign'],
      metricLabel: `${index + 1}%`,
      hasConversation: false,
    }));

    render(
      <MemoryRouter>
        <CalendarGrid
          currentMonth={dayjs('2026-05-01')}
          density="expanded"
          expandedDays={[]}
          postsByDate={{ '2026-05-08': busyDayPosts }}
          onOpenCompactGroup={vi.fn()}
          onOpenDayPosts={onOpenDayPosts}
          onOpenPost={vi.fn()}
          onToggleDay={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Large month post 1')).toBeInTheDocument();
    expect(screen.getByText('Large month post 5')).toBeInTheDocument();
    expect(screen.queryByText('Large month post 6')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'View 2 more' }));

    expect(onOpenDayPosts).toHaveBeenCalledWith({ dateKey: '2026-05-08' });
  }, 10000);

  it('scales compact platform cards by post count and opens the selected group', () => {
    const onOpenCompactGroup = vi.fn();

    render(
      <CalendarGrid
        currentMonth={dayjs('2026-05-01')}
        density="compact"
        expandedDays={[]}
        postsByDate={monthPosts}
        onOpenCompactGroup={onOpenCompactGroup}
        onOpenPost={vi.fn()}
        onToggleDay={vi.fn()}
      />,
    );

    const facebookCard = screen.getByRole('button', { name: /Facebook: 2 posts on Fri, 8 May 2026/ });
    const tiktokCard = screen.getByRole('button', { name: /TikTok: 1 posts on Fri, 8 May 2026/ });

    expect(facebookCard).toHaveStyle({ '--compact-ratio': '1' });
    expect(tiktokCard).toHaveStyle({ '--compact-ratio': '0.5' });

    fireEvent.click(facebookCard);

    expect(onOpenCompactGroup).toHaveBeenCalledWith({
      dateKey: '2026-05-08',
      platform: 'facebook',
    });
  }, 10000);

  it('renders the right side panel with post cards and card actions', () => {
    render(
      <MemoryRouter>
        <CalendarPostSidePanel
          posts={futureSidePanelPosts}
          selection={{ dateKey: '2026-05-22', platform: 'facebook' }}
          onClose={vi.fn()}
          onOpenPost={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Fri, 22 May 2026')).toBeInTheDocument();
    expect(screen.getByText('2 posts')).toBeInTheDocument();
    expect(screen.getByText('First Facebook post')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Delete for Garena Delta Force/ })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: /View tags for Garena Delta Force/ })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: /Start Team Conversation for Garena Delta Force/ })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: /Duplicate for Garena Delta Force/ })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: /Send Now for Garena Delta Force/ })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: /Reschedule for Garena Delta Force/ })).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Close post list' })).toBeInTheDocument();
  }, 10000);

  it('exposes hover actions on empty month cells with list-view behavior', () => {
    const onCreatePost = vi.fn();
    const onCreateNote = vi.fn();

    render(
      <CalendarGrid
        currentMonth={dayjs('2026-05-01')}
        density="compact"
        expandedDays={[]}
        postsByDate={monthPosts}
        onCreateNote={onCreateNote}
        onCreatePost={onCreatePost}
        onOpenCompactGroup={vi.fn()}
        onOpenPost={vi.fn()}
        onToggleDay={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Schedule post for Friday, 22 May 2026' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add note for Friday, 22 May 2026' }));

    expect(onCreatePost).toHaveBeenCalledTimes(1);
    expect(onCreateNote).toHaveBeenCalledTimes(1);
    expect(onCreateNote.mock.calls[0][0].format('YYYY-MM-DD')).toBe('2026-05-22');
  }, 10000);
});
