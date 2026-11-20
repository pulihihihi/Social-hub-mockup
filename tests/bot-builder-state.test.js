import { describe, expect, it } from 'vitest';
import { buildInitialReplies, createMessage, createReply } from '../src/pages/Bots/botData';
import {
  addContentToFlow,
  createKeywordCommand,
  deleteNodeFromFlow,
  duplicateNodeInFlow,
  getNodeValue,
  saveNodeValue,
} from '../src/pages/Bots/builder/botBuilderState';

const createId = (prefix) => `${prefix}_stable`;

describe('bot builder state helpers', () => {
  it('injects stable ids for bot messages and replies', () => {
    expect(createMessage('Hello', 'text', { createId })).toMatchObject({
      id: 'msg_stable',
      body: 'Hello',
      type: 'text',
    });

    const reply = createReply('Help', 'How can we help?', [], { createId });
    expect(reply).toMatchObject({
      id: 'qr_stable',
      text: 'Help',
      messages: [{ id: 'msg_stable', body: 'How can we help?' }],
    });
  });

  it('finds and saves nested message values without mutating unrelated branches', () => {
    const quickReplies = buildInitialReplies({ createId: (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 4)}` });
    const orderReply = quickReplies.find((reply) => reply.text === 'My Order');
    const childReply = orderReply.children[0];
    const message = childReply.messages[0];

    expect(getNodeValue({
      ref: { scope: 'childMessage', replyId: orderReply.id, childId: childReply.id, messageId: message.id },
      welcomeMessages: [],
      quickReplies,
    })).toBe(message.body);

    const nextState = saveNodeValue({
      editNode: { scope: 'childMessage', replyId: orderReply.id, childId: childReply.id, messageId: message.id },
      value: 'Updated nested response',
      welcomeMessages: [],
      quickReplies,
    });

    const nextOrderReply = nextState.quickReplies.find((reply) => reply.id === orderReply.id);
    expect(nextOrderReply.children[0].messages[0].body).toBe('Updated nested response');
  });

  it('adds, duplicates, and deletes flow nodes through pure helpers', () => {
    const welcomeMessages = [createMessage('Welcome', 'text', { createId: (prefix) => `${prefix}_welcome` })];
    const quickReplies = [
      { id: 'reply_1', text: 'Reply 1', messages: [createMessage('Answer 1', 'text', { createId })], children: [] },
      { id: 'reply_2', text: 'Reply 2', messages: [createMessage('Answer 2', 'text', { createId })], children: [] },
    ];

    const added = addContentToFlow({
      context: { scope: 'message', replyId: 'reply_1' },
      type: 'image',
      welcomeMessages,
      quickReplies,
      createId,
    });
    expect(added.quickReplies[0].messages.at(-1)).toMatchObject({
      id: 'msg_stable',
      type: 'image',
    });

    const duplicated = duplicateNodeInFlow({
      ref: { scope: 'reply', replyId: 'reply_1' },
      welcomeMessages,
      quickReplies,
      createId: (prefix) => `${prefix}_copy`,
    });
    expect(duplicated.quickReplies.map((reply) => reply.id)).toContain('qr-copy_copy');
    expect(duplicated.quickReplies[1].text).toBe('Reply 1 Copy');

    const deleted = deleteNodeFromFlow({
      ref: { scope: 'reply', replyId: 'reply_1' },
      welcomeMessages,
      quickReplies: duplicated.quickReplies,
    });
    expect(deleted.quickReplies.some((reply) => reply.id === 'reply_1')).toBe(false);
  });

  it('creates keyword command ids through an injectable id factory', () => {
    expect(createKeywordCommand({
      draft: { title: 'Restart', keywords: 'restart', response: 'Welcome Message' },
      createId,
    })).toMatchObject({
      id: 'cmd_stable',
      title: 'Restart',
    });
  });
});
