import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';
import {
  buildMonthGrid,
  buildWeekDays,
  groupPostsByDate,
  matchesFilter,
  matchesTagFilter,
  sortPostsByTime,
} from '../src/pages/PublishingCalendar/calendarDateHelpers';

describe('PublishingCalendar date and filter helpers', () => {
  it('builds a Monday-first 42-day month grid around the selected month', () => {
    const grid = buildMonthGrid(dayjs('2026-05-07'));

    expect(grid).toHaveLength(42);
    expect(grid[0]).toMatchObject({
      key: '2026-04-27',
      isCurrentMonth: false,
    });
    expect(grid.find((day) => day.key === '2026-05-15')).toMatchObject({
      isCurrentMonth: true,
      isToday: true,
    });
  });

  it('builds a Monday-first week for the selected date', () => {
    expect(buildWeekDays(dayjs('2026-05-07')).map((day) => day.key)).toEqual([
      '2026-05-04',
      '2026-05-05',
      '2026-05-06',
      '2026-05-07',
      '2026-05-08',
      '2026-05-09',
      '2026-05-10',
    ]);
  });

  it('keeps Sunday inside the same Monday-first week', () => {
    expect(buildWeekDays(dayjs('2026-05-10')).map((day) => day.key)).toEqual([
      '2026-05-04',
      '2026-05-05',
      '2026-05-06',
      '2026-05-07',
      '2026-05-08',
      '2026-05-09',
      '2026-05-10',
    ]);
  });

  it('groups and sorts posts without mutating the source list', () => {
    const posts = [
      { id: 'late', date: '2026-05-07', scheduledAt: '2026-05-07T18:00:00' },
      { id: 'early', date: '2026-05-07', scheduledAt: '2026-05-07T09:00:00' },
      { id: 'other', date: '2026-05-08', scheduledAt: '2026-05-08T10:00:00' },
    ];

    expect(groupPostsByDate(posts)).toMatchObject({
      '2026-05-07': [{ id: 'late' }, { id: 'early' }],
      '2026-05-08': [{ id: 'other' }],
    });
    expect(sortPostsByTime(posts).map((post) => post.id)).toEqual(['early', 'late', 'other']);
    expect(posts.map((post) => post.id)).toEqual(['late', 'early', 'other']);
  });

  it('treats empty selected filters as viewing all values', () => {
    expect(matchesFilter('facebook', [])).toBe(true);
    expect(matchesFilter('facebook', ['instagram'])).toBe(false);
    expect(matchesTagFilter(['Launch', 'VN'], [])).toBe(true);
    expect(matchesTagFilter(['Launch', 'VN'], ['VN'])).toBe(true);
  });
});
