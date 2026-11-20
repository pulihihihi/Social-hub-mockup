import { describe, expect, it } from 'vitest';
import { normalizeDiscussionCollection, normalizeDiscussionMessage } from '../src/domain/discussion/normalizers';
import { selectFilteredDiscussions } from '../src/domain/discussion/selectors';

describe('discussion normalization and selectors', () => {
  it('normalizes engage aliases and derives stable discussion fields', () => {
    const message = normalizeDiscussionMessage({
      author: '@espresso_daily',
      source: 'instagram',
      text: 'Launch day for the new espresso machine',
      engagements: 42,
      date: '2026-03-21T09:15:00+07:00',
    });

    expect(message.id).toContain('instagram');
    expect(message.platform).toBe('instagram');
    expect(message.handle).toBe('@espresso_daily');
    expect(message.engage).toBe(42);
    expect(message.dateLabel).toBe('21 Mar');
    expect(message.fullDate).toContain('2026');
    expect(message.postTitle).toContain('Launch day');
  });

  it('normalizes mixed engagement field names across a collection', () => {
    const records = normalizeDiscussionCollection([
      { id: 'd1', author: 'Alice', platform: 'fb_fanpage', text: 'A', engagement: 5 },
      { id: 'd2', author: 'Bob', platform: 'fb_group', text: 'B', engagements: 7 },
      { id: 'd3', author: 'Cara', platform: 'youtube', text: 'C', engage: 9 },
    ]);

    expect(records.map((record) => record.engage)).toEqual([5, 7, 9]);
  });

  it('filters normalized discussions by keyword, platform, post title, and sentiment', () => {
    const messages = normalizeDiscussionCollection([
      {
        id: 'p1',
        author: 'Alice',
        platform: 'fb_fanpage',
        title: 'Launch Day',
        text: 'Launch day campaign is trending hard',
        sentiment: 'positive',
      },
      {
        id: 'p2',
        author: 'Bob',
        platform: 'instagram',
        title: 'Support Complaint',
        text: 'The support queue is too slow',
        sentiment: 'negative',
      },
    ]);

    expect(selectFilteredDiscussions(messages, 'keyword', 'campaign')).toHaveLength(1);
    expect(selectFilteredDiscussions(messages, 'platform', 'instagram')).toHaveLength(1);
    expect(selectFilteredDiscussions(messages, 'post', 'Launch Day!!!')).toHaveLength(1);
    expect(selectFilteredDiscussions(messages, 'sentiment', 'negative')).toHaveLength(1);
  });
});
