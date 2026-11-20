import { createMessage, createReply, getDefaultMessageBody } from '../botData';

export const createTimestampId = (prefix) => `${prefix}-${Date.now()}`;

export const createKeywordCommand = ({ draft, createId = createTimestampId }) => ({
  ...draft,
  id: createId('cmd'),
});

export const getNodeValue = ({ ref, welcomeMessages, quickReplies }) => {
  if (ref.scope === 'welcome') {
    return welcomeMessages.find((message) => message.id === ref.messageId)?.body || '';
  }

  if (ref.scope === 'reply') {
    return quickReplies.find((reply) => reply.id === ref.replyId)?.text || '';
  }

  if (ref.scope === 'message') {
    const reply = quickReplies.find((item) => item.id === ref.replyId);
    return reply?.messages.find((message) => message.id === ref.messageId)?.body || '';
  }

  if (ref.scope === 'childReply') {
    const reply = quickReplies.find((item) => item.id === ref.replyId);
    return reply?.children.find((child) => child.id === ref.childId)?.text || '';
  }

  if (ref.scope === 'childMessage') {
    const reply = quickReplies.find((item) => item.id === ref.replyId);
    const child = reply?.children.find((item) => item.id === ref.childId);
    return child?.messages.find((message) => message.id === ref.messageId)?.body || '';
  }

  return '';
};

export const saveNodeValue = ({ editNode, value, welcomeMessages, quickReplies }) => {
  if (!editNode) return { welcomeMessages, quickReplies };

  if (editNode.scope === 'welcome') {
    return {
      welcomeMessages: welcomeMessages.map((message) => (
        message.id === editNode.messageId ? { ...message, body: value } : message
      )),
      quickReplies,
    };
  }

  return {
    welcomeMessages,
    quickReplies: quickReplies.map((reply) => {
      if (editNode.scope === 'reply' && reply.id === editNode.replyId) {
        return { ...reply, text: value };
      }

      if (editNode.scope === 'message' && reply.id === editNode.replyId) {
        return {
          ...reply,
          messages: reply.messages.map((message) => (
            message.id === editNode.messageId ? { ...message, body: value } : message
          )),
        };
      }

      if (editNode.scope === 'childReply' && reply.id === editNode.replyId) {
        return {
          ...reply,
          children: reply.children.map((child) => (
            child.id === editNode.childId ? { ...child, text: value } : child
          )),
        };
      }

      if (editNode.scope === 'childMessage' && reply.id === editNode.replyId) {
        return {
          ...reply,
          children: reply.children.map((child) => (
            child.id === editNode.childId
              ? {
                ...child,
                messages: child.messages.map((message) => (
                  message.id === editNode.messageId ? { ...message, body: value } : message
                )),
              }
              : child
          )),
        };
      }

      return reply;
    }),
  };
};

export const addContentToFlow = ({ context, type, welcomeMessages, quickReplies, createId }) => {
  if (!context) return { welcomeMessages, quickReplies };

  if (context.scope === 'welcome') {
    return {
      welcomeMessages: [...welcomeMessages, createMessage(getDefaultMessageBody(type), type, { createId })],
      quickReplies,
    };
  }

  if (context.scope === 'reply') {
    return {
      welcomeMessages,
      quickReplies: quickReplies.length >= 6
        ? quickReplies
        : [...quickReplies, createReply('Something else', 'Please tell us what you need help with.', [], { createId })],
    };
  }

  if (context.scope === 'message') {
    return {
      welcomeMessages,
      quickReplies: quickReplies.map((reply) => (
        reply.id === context.replyId
          ? { ...reply, messages: [...reply.messages, createMessage(getDefaultMessageBody(type), type, { createId })] }
          : reply
      )),
    };
  }

  if (context.scope === 'childReply') {
    return {
      welcomeMessages,
      quickReplies: quickReplies.map((reply) => (
        reply.id === context.replyId && reply.children.length < 6
          ? { ...reply, children: [...reply.children, createReply('New option', 'New nested response', [], { createId })] }
          : reply
      )),
    };
  }

  if (context.scope === 'childMessage') {
    return {
      welcomeMessages,
      quickReplies: quickReplies.map((reply) => (
        reply.id === context.replyId
          ? {
            ...reply,
            children: reply.children.map((child) => (
              child.id === context.childId
                ? { ...child, messages: [...child.messages, createMessage(getDefaultMessageBody(type), type, { createId })] }
                : child
            )),
          }
          : reply
      )),
    };
  }

  return { welcomeMessages, quickReplies };
};

export const duplicateNodeInFlow = ({ ref, welcomeMessages, quickReplies, createId = createTimestampId }) => {
  if (ref.scope === 'welcome') {
    const source = welcomeMessages.find((message) => message.id === ref.messageId);
    return {
      welcomeMessages: source ? [...welcomeMessages, { ...source, id: createId('welcome-copy') }] : welcomeMessages,
      quickReplies,
    };
  }

  return {
    welcomeMessages,
    quickReplies: quickReplies.flatMap((reply) => {
      if (ref.scope === 'reply' && reply.id === ref.replyId && quickReplies.length < 6) {
        return [reply, { ...reply, id: createId('qr-copy'), text: `${reply.text} Copy` }];
      }

      if (ref.scope === 'message' && reply.id === ref.replyId) {
        const message = reply.messages.find((item) => item.id === ref.messageId);
        return {
          ...reply,
          messages: message ? [...reply.messages, { ...message, id: createId('msg-copy') }] : reply.messages,
        };
      }

      if (ref.scope === 'childReply' && reply.id === ref.replyId) {
        const child = reply.children.find((item) => item.id === ref.childId);
        return {
          ...reply,
          children: child && reply.children.length < 6
            ? [...reply.children, { ...child, id: createId('child-copy'), text: `${child.text} Copy` }]
            : reply.children,
        };
      }

      if (ref.scope === 'childMessage' && reply.id === ref.replyId) {
        return {
          ...reply,
          children: reply.children.map((child) => {
            if (child.id !== ref.childId) return child;
            const message = child.messages.find((item) => item.id === ref.messageId);
            return {
              ...child,
              messages: message ? [...child.messages, { ...message, id: createId('msg-copy') }] : child.messages,
            };
          }),
        };
      }

      return reply;
    }),
  };
};

export const deleteNodeFromFlow = ({ ref, welcomeMessages, quickReplies }) => {
  if (ref.scope === 'welcome') {
    return {
      welcomeMessages: welcomeMessages.length > 1
        ? welcomeMessages.filter((message) => message.id !== ref.messageId)
        : welcomeMessages,
      quickReplies,
    };
  }

  if (ref.scope === 'reply') {
    return {
      welcomeMessages,
      quickReplies: quickReplies.length > 2 ? quickReplies.filter((reply) => reply.id !== ref.replyId) : quickReplies,
    };
  }

  return {
    welcomeMessages,
    quickReplies: quickReplies.map((reply) => {
      if (ref.scope === 'message' && reply.id === ref.replyId) {
        return { ...reply, messages: reply.messages.filter((message) => message.id !== ref.messageId) };
      }

      if (ref.scope === 'childReply' && reply.id === ref.replyId) {
        return { ...reply, children: reply.children.filter((child) => child.id !== ref.childId) };
      }

      if (ref.scope === 'childMessage' && reply.id === ref.replyId) {
        return {
          ...reply,
          children: reply.children.map((child) => (
            child.id === ref.childId
              ? { ...child, messages: child.messages.filter((message) => message.id !== ref.messageId) }
              : child
          )),
        };
      }

      return reply;
    }),
  };
};
