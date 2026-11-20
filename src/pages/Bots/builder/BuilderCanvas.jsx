import { Button, Popover, Tooltip, Typography } from 'antd';
import {
  AppstoreOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  KeyOutlined,
  MessageOutlined,
  MoreOutlined,
  PictureOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  RocketOutlined,
  SearchOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

function FlowNode({ type = 'bot', messageType = 'text', title, body, className = '', onEdit, onDuplicate, onDelete }) {
  const menu = (
    <div className="bots-flow-node-menu">
      <Button type="text" icon={<EditOutlined />} onClick={onEdit}>Edit</Button>
      <Button type="text" icon={<CopyOutlined />} onClick={onDuplicate}>Duplicate</Button>
      <Button type="text" icon={<DeleteOutlined />} danger onClick={onDelete}>Delete</Button>
    </div>
  );

  return (
    <div className={`bots-flow-node is-${type} ${className}`}>
      <div className="bots-flow-node-title">
        {type === 'user'
          ? <RocketOutlined />
          : messageType === 'image'
            ? <PictureOutlined />
            : messageType === 'carousel'
              ? <AppstoreOutlined />
              : <MessageOutlined />}
        <Text strong>{title}</Text>
        {onEdit ? (
          <Popover trigger="click" placement="bottomRight" content={menu} overlayClassName="bots-flow-node-menu-popover">
            <Button type="text" size="small" icon={<MoreOutlined />} aria-label={`Open actions for ${title}`} />
          </Popover>
        ) : (
          <MoreOutlined />
        )}
      </div>
      <p>{body}</p>
    </div>
  );
}

function AddFlowButton({ children = 'Add Message', className = '', onClick }) {
  return (
    <Button type="default" className={`bots-flow-add ${className}`} icon={<PlusOutlined />} onClick={onClick}>
      {children}
    </Button>
  );
}

export default function BuilderCanvas({
  welcomeMessages,
  quickReplies,
  onAdd,
  onEdit,
  onDuplicate,
  onDelete,
  onOpenPreview,
  onOpenKeywords,
  onOpenHelp,
}) {
  return (
    <main className="bots-builder-canvas">
      <div className="bots-builder-flow is-tree">
        {welcomeMessages.map((message, index) => (
          <FlowNode
            key={message.id}
            className={`is-root is-${message.type}`}
            messageType={message.type}
            title="Bot Says:"
            body={message.body}
            onEdit={() => onEdit({ scope: 'welcome', index, messageId: message.id })}
            onDuplicate={() => onDuplicate({ scope: 'welcome', index, messageId: message.id })}
            onDelete={() => onDelete({ scope: 'welcome', index, messageId: message.id })}
          />
        ))}
        <AddFlowButton onClick={() => onAdd({ scope: 'welcome' })} />
        <div
          className="bots-flow-branches"
          style={{ gridTemplateColumns: `repeat(${Math.min(quickReplies.length + 1, 6)}, 170px)` }}
        >
          {quickReplies.map((reply) => (
            <div key={reply.id} className="bots-flow-branch">
              <FlowNode
                type="user"
                title="User Clicks:"
                body={reply.text}
                onEdit={() => onEdit({ scope: 'reply', replyId: reply.id })}
                onDuplicate={() => onDuplicate({ scope: 'reply', replyId: reply.id })}
                onDelete={() => onDelete({ scope: 'reply', replyId: reply.id })}
              />
              {reply.messages.map((message) => (
                <FlowNode
                  key={message.id}
                  title="Bot Says:"
                  body={message.body}
                  messageType={message.type}
                  className={`is-${message.type}`}
                  onEdit={() => onEdit({ scope: 'message', replyId: reply.id, messageId: message.id })}
                  onDuplicate={() => onDuplicate({ scope: 'message', replyId: reply.id, messageId: message.id })}
                  onDelete={() => onDelete({ scope: 'message', replyId: reply.id, messageId: message.id })}
                />
              ))}
              {reply.children.length ? (
                <div
                  className="bots-flow-subbranches"
                  style={{ gridTemplateColumns: `repeat(${Math.min(reply.children.length + 1, 6)}, 150px)` }}
                >
                  {reply.children.map((childReply) => (
                    <div key={childReply.id} className="bots-flow-subbranch">
                      <FlowNode
                        type="user"
                        title="User Clicks:"
                        body={childReply.text}
                        onEdit={() => onEdit({ scope: 'childReply', replyId: reply.id, childId: childReply.id })}
                        onDuplicate={() => onDuplicate({ scope: 'childReply', replyId: reply.id, childId: childReply.id })}
                        onDelete={() => onDelete({ scope: 'childReply', replyId: reply.id, childId: childReply.id })}
                      />
                      {childReply.messages.map((message) => (
                        <FlowNode
                          key={message.id}
                          title="Bot Says:"
                          body={message.body}
                          messageType={message.type}
                          className={`is-${message.type}`}
                          onEdit={() => onEdit({ scope: 'childMessage', replyId: reply.id, childId: childReply.id, messageId: message.id })}
                          onDuplicate={() => onDuplicate({ scope: 'childMessage', replyId: reply.id, childId: childReply.id, messageId: message.id })}
                          onDelete={() => onDelete({ scope: 'childMessage', replyId: reply.id, childId: childReply.id, messageId: message.id })}
                        />
                      ))}
                      <AddFlowButton onClick={() => onAdd({ scope: 'childMessage', replyId: reply.id, childId: childReply.id })} />
                    </div>
                  ))}
                  <AddFlowButton onClick={() => onAdd({ scope: 'childReply', replyId: reply.id })}>
                    Add Quick Reply
                  </AddFlowButton>
                </div>
              ) : (
                <AddFlowButton onClick={() => onAdd({ scope: 'message', replyId: reply.id })} />
              )}
            </div>
          ))}
          <AddFlowButton onClick={() => onAdd({ scope: 'reply' })}>Add Quick Reply</AddFlowButton>
        </div>
      </div>
      <aside className="bots-builder-rail">
        <Tooltip title="Preview"><Button shape="circle" icon={<SearchOutlined />} onClick={onOpenPreview} /></Tooltip>
        <Tooltip title="Keyword commands"><Button shape="circle" icon={<KeyOutlined />} onClick={onOpenKeywords} /></Tooltip>
        <Tooltip title="Help resources"><Button shape="circle" icon={<QuestionCircleOutlined />} onClick={onOpenHelp} /></Tooltip>
      </aside>
      <div className="bots-builder-zoom">
        <Button type="text" icon={<PlusOutlined />} />
        <span />
        <Button type="text">-</Button>
      </div>
    </main>
  );
}
