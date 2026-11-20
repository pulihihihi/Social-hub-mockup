import { useEffect, useState } from 'react';
import { Avatar, Button, Card, Input, Modal, Select, Typography } from 'antd';
import { CONTENT_TYPES } from '../botData';
import { createKeywordCommand } from './botBuilderState';

const { Text } = Typography;

export function ContentTypeModal({ open, context, onSelect, onClose }) {
  const allowedTypes = context?.scope === 'reply' || context?.scope === 'childReply'
    ? CONTENT_TYPES.filter((type) => type.key === 'quickReply')
    : CONTENT_TYPES.filter((type) => type.key !== 'quickReply');

  return (
    <Modal centered open={open} width={720} title="Choose Content Type" footer={null} onCancel={onClose}>
      <div className="bots-content-type-grid">
        {allowedTypes.map((type) => (
          <Card
            key={type.key}
            hoverable
            role="button"
            tabIndex={0}
            className="bots-content-type-card"
            onClick={() => onSelect(type.key)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelect(type.key);
              }
            }}
          >
            <span>{type.icon}</span>
            <Text strong>{type.title}</Text>
            <Text type="secondary">{type.description}</Text>
          </Card>
        ))}
      </div>
    </Modal>
  );
}

export function EditNodeModal({ node, open, onSave, onClose }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(node?.value || '');
  }, [node]);

  const isReply = node?.kind === 'reply';

  return (
    <Modal
      centered
      open={open}
      width={620}
      title={isReply ? 'Edit Quick Reply' : 'Edit Message'}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="save" type="primary" onClick={() => onSave(value)}>Save</Button>,
      ]}
    >
      <div className="bots-edit-node">
        <Text>{isReply ? 'Quick Reply label' : 'Message content'}</Text>
        {isReply ? (
          <Input value={value} onChange={(event) => setValue(event.target.value)} maxLength={20} />
        ) : (
          <Input.TextArea value={value} onChange={(event) => setValue(event.target.value)} rows={5} />
        )}
      </div>
    </Modal>
  );
}

export function PreviewPanel({ open, onClose, welcomeMessages, quickReplies, settings }) {
  const [selectedReplyId, setSelectedReplyId] = useState(null);
  const selectedReply = quickReplies.find((reply) => reply.id === selectedReplyId);

  return (
    <Modal open={open} width={420} title="Live Preview" footer={null} onCancel={onClose} className="bots-preview-modal">
      <div className="bots-preview-phone">
        <div className="bots-preview-header">
          <Avatar size={34} className="bots-card-avatar">TG</Avatar>
          <div>
            <Text strong>{settings.name || 'test'}</Text>
            <Text type="secondary">Messenger preview</Text>
          </div>
        </div>
        <div className="bots-preview-thread">
          {welcomeMessages.map((message) => (
            <div key={message.id} className={`bots-preview-bubble is-${message.type}`}>{message.body}</div>
          ))}
          <div className="bots-preview-replies">
            {quickReplies.slice(0, 6).map((reply) => (
              <Button key={reply.id} onClick={() => setSelectedReplyId(reply.id)}>{reply.text}</Button>
            ))}
          </div>
          {selectedReply ? (
            <>
              <div className="bots-preview-user">{selectedReply.text}</div>
              {selectedReply.messages.map((message) => (
                <div key={message.id} className="bots-preview-bubble">{message.body}</div>
              ))}
              {selectedReply.children.length ? (
                <div className="bots-preview-replies">
                  {selectedReply.children.map((child) => (
                    <Button key={child.id}>{child.text}</Button>
                  ))}
                </div>
              ) : null}
            </>
          ) : null}
        </div>
        {settings.disableFreeText ? (
          <Text type="secondary">Free-text replies are disabled. Users interact with quick replies only.</Text>
        ) : (
          <Input placeholder="Type a message..." />
        )}
      </div>
    </Modal>
  );
}

export function KeywordCommandsPanel({ open, onClose, commands, setCommands, quickReplies }) {
  const [draft, setDraft] = useState({ title: 'Restart', keywords: 'restart, menu', response: 'Welcome Message' });

  const saveCommand = () => {
    setCommands((current) => [...current, createKeywordCommand({ draft })]);
    setDraft({ title: '', keywords: '', response: 'Welcome Message' });
  };

  return (
    <Modal
      open={open}
      width={680}
      title="Keyword Commands"
      onCancel={onClose}
      footer={<Button type="primary" onClick={saveCommand}>Save Keyword Command</Button>}
    >
      <div className="bots-keywords-panel">
        <Text type="secondary">
          Keyword Commands are exact-match, rules-based shortcuts that can send a custom message or direct a user to an
          existing message in the conversation map.
        </Text>
        <label>
          <Text strong>Title</Text>
          <Input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} />
        </label>
        <label>
          <Text strong>Keywords or phrases</Text>
          <Input value={draft.keywords} onChange={(event) => setDraft((current) => ({ ...current, keywords: event.target.value }))} />
        </label>
        <label>
          <Text strong>Response</Text>
          <Select
            value={draft.response}
            onChange={(response) => setDraft((current) => ({ ...current, response }))}
            options={[
              { label: 'Welcome Message', value: 'Welcome Message' },
              ...quickReplies.map((reply) => ({ label: reply.text, value: reply.text })),
            ]}
          />
        </label>
        <div className="bots-keywords-list">
          {commands.map((command) => (
            <div key={command.id}>
              <Text strong>{command.title}</Text>
              <Text type="secondary">{command.keywords}</Text>
              <Text>Routes to: {command.response}</Text>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export function HelpPanel({ open, onClose }) {
  return (
    <Modal open={open} width={640} title="Chatbot Guide" onCancel={onClose} footer={null}>
      <div className="bots-help-panel">
        <section>
          <Text strong>Chatbot anatomy</Text>
          <Text>Welcome messages set expectations, quick replies guide choices, and bot responses answer each branch.</Text>
        </section>
        <section>
          <Text strong>Best practices</Text>
          <Text>Add two to six quick replies, include an Other option, keep labels short, and use preview before going online.</Text>
        </section>
        <section>
          <Text strong>Smart Inbox handoff</Text>
          <Text>Messages can still flow into Smart Inbox so the team can reply, tag, complete, or escalate conversations.</Text>
        </section>
      </div>
    </Modal>
  );
}
