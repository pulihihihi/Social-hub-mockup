import { normalizeDiscussionMessage } from './normalizers';

export const normalizePostTitle = (value = '') =>
  value.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim();

export const dedupeDiscussionMessages = (messages) => {
  const seen = new Set();
  return messages.filter((message) => {
    if (seen.has(message.id)) return false;
    seen.add(message.id);
    return true;
  });
};

export const flattenDiscussionsByDate = (discussionsByDate, options = {}) =>
  Object.entries(discussionsByDate).flatMap(([dateLabel, messages]) =>
    messages.map((message) => normalizeDiscussionMessage({ ...message, dateLabel }, options)),
  );

export const selectFilteredDiscussions = (messages, filterType = 'all', filterValue = null) => {
  switch (filterType) {
    case 'date':
      return messages.filter((message) => message.dateLabel === filterValue);
    case 'sentiment':
      return messages.filter((message) => message.sentiment === filterValue);
    case 'platform':
      return messages.filter((message) => message.platform === filterValue || message.source === filterValue);
    case 'keyword':
      return messages.filter((message) => (message.text || '').toLowerCase().includes((filterValue || '').toLowerCase()));
    case 'post': {
      const normalizedFilter = normalizePostTitle(filterValue);
      return messages.filter((message) => {
        const titles = [message.postTitle, message.title, message.text].filter(Boolean).map(normalizePostTitle);
        return titles.some((title) => title === normalizedFilter || title.startsWith(normalizedFilter) || normalizedFilter.startsWith(title));
      });
    }
    case 'author':
      return messages.filter((message) => message.author === filterValue);
    case 'channel':
      return messages.filter((message) => message.channel === filterValue || message.author === filterValue);
    case 'all':
    default:
      return messages;
  }
};
