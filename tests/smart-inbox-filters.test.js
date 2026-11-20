import { describe, expect, it } from 'vitest';
import {
  MESSAGES,
  applySmartInboxMessageAction,
  filterSmartInboxMessages,
} from '../src/pages/SmartInboxAllMessages/smartInboxMockData';

describe('Smart Inbox local filtering', () => {
  it('matches search text across author, body, context, sentiment, and tags', () => {
    expect(filterSmartInboxMessages(MESSAGES, { query: 'quay lai' }).map((message) => message.id)).toEqual(['m-2']);
    expect(filterSmartInboxMessages(MESSAGES, { query: 'Always On' }).map((message) => message.id)).toEqual(['m-3']);
    expect(filterSmartInboxMessages(MESSAGES, { query: 'Neutral' }).map((message) => message.id)).toEqual(['m-4']);
  });

  it('narrows messages by source channel, message type, tag, and sentiment', () => {
    expect(filterSmartInboxMessages(MESSAGES, { sourceChannelIds: ['ig-delta'] }).map((message) => message.id)).toEqual(['m-1']);
    expect(filterSmartInboxMessages(MESSAGES, { messageTypes: ['facebook-private-messages'] }).map((message) => message.id)).toEqual(['m-3']);
    expect(filterSmartInboxMessages(MESSAGES, { tags: ['Campaign'] }).map((message) => message.id)).toEqual(['m-2']);
    expect(filterSmartInboxMessages(MESSAGES, { sentiments: ['Neutral'] }).map((message) => message.id)).toEqual(['m-4']);
  });

  it('treats empty source and message type selections as active filters with no matches', () => {
    expect(filterSmartInboxMessages(MESSAGES, { sourceChannelIds: [] })).toEqual([]);
    expect(filterSmartInboxMessages(MESSAGES, { messageTypes: [] })).toEqual([]);
  });

  it('combines active filters', () => {
    expect(filterSmartInboxMessages(MESSAGES, {
      query: 'thanh',
      sourceChannelIds: ['fb-delta-main'],
      messageTypes: ['facebook-private-messages'],
      tags: ['Always On'],
      sentiments: ['Unclassified'],
    }).map((message) => message.id)).toEqual(['m-3']);
  });

  it('supports private-thread fields and message intent filters', () => {
    const threads = [
      {
        id: 'thread-a',
        sourceChannelId: 'fb-warrior',
        messageType: 'facebook-private-messages',
        author: 'Thanh Nguyen',
        account: 'Chien Than Delta Force',
        detail: 'Customer is asking for order support.',
        tags: ['Always On'],
        sentiment: 'Unclassified',
        messageIntent: 'Order support',
      },
      {
        id: 'thread-b',
        sourceChannelId: 'ig-delta',
        messageType: 'instagram-direct-messages',
        author: 'Phat Jade',
        account: 'Garena Delta Force VN',
        detail: 'Bot handoff conversation.',
        tags: ['Community'],
        sentiment: 'Neutral',
        messageIntent: 'Bot handoff',
      },
    ];

    expect(filterSmartInboxMessages(threads, { query: 'order support' }).map((message) => message.id)).toEqual(['thread-a']);
    expect(filterSmartInboxMessages(threads, { messageIntents: ['Bot handoff'] }).map((message) => message.id)).toEqual(['thread-b']);
  });

  it('applies safe local message action state', () => {
    let messages = applySmartInboxMessageAction(MESSAGES, 'm-3', 'save');
    expect(messages.find((message) => message.id === 'm-3')?.saved).toBe(true);

    messages = applySmartInboxMessageAction(messages, 'm-3', 'sentiment', { sentiment: 'Negative' });
    expect(messages.find((message) => message.id === 'm-3')?.sentiment).toBe('Negative');

    messages = applySmartInboxMessageAction(messages, 'm-3', 'tags', { tags: ['Always On', 'Escalation'] });
    expect(messages.find((message) => message.id === 'm-3')?.tags).toEqual(['Always On', 'Escalation']);

    messages = applySmartInboxMessageAction(messages, 'm-3', 'case');
    expect(messages.find((message) => message.id === 'm-3')?.caseCreated).toBe(true);

    messages = applySmartInboxMessageAction(messages, 'm-3', 'complete');
    expect(messages.find((message) => message.id === 'm-3')?.completed).toBe(true);
  });
});
