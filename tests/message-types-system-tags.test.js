import { describe, expect, it } from 'vitest';
import {
  MESSAGE_TYPE_VALUES,
  getMessageTypeScopeLabel,
  isMessageTypeCoveredByScope,
  isMessageTypeScope,
} from '../src/data/messageTypes';
import {
  SYSTEM_TAGS,
  resolveMessageSystemTags,
} from '../src/data/tagManagement';

describe('message type backed system tags', () => {
  it('keeps every system tag appliesTo value inside the Smart Inbox message type taxonomy', () => {
    const invalidScopes = SYSTEM_TAGS.flatMap((tag) => (
      tag.appliesTo
        .filter((scope) => !isMessageTypeScope(scope))
        .map((scope) => `${tag.id}:${scope}`)
    ));

    expect(invalidScopes).toEqual([]);
    expect(MESSAGE_TYPE_VALUES).toContain('facebook-private-messages');
    expect(getMessageTypeScopeLabel('instagram-direct-messages')).toBe('Instagram Direct Messages');
  });

  it('resolves message system tags from Tag Management data only when enabled and applicable', () => {
    const message = {
      messageType: 'facebook-comments',
      systemTagIds: ['sentiment-negative', 'alert-cs-escalation', 'post-performance-drop'],
    };
    const disabledNegative = SYSTEM_TAGS.map((tag) => (
      tag.id === 'sentiment-negative' ? { ...tag, enabled: false } : tag
    ));

    expect(isMessageTypeCoveredByScope('all-facebook', 'facebook-comments')).toBe(true);
    expect(resolveMessageSystemTags(message, disabledNegative).map((tag) => tag.id)).toEqual(['alert-cs-escalation']);
  });
});
