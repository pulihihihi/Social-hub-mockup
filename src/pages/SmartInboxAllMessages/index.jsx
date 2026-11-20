import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Divider,
  Dropdown,
  Empty,
  Input,
  Popover,
  Select,
  Switch,
  Tag,
  Tabs,
  Tooltip,
  Typography,
  message as antdMessage,
} from 'antd';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  CommentOutlined,
  DownOutlined,
  ExportOutlined,
  FacebookFilled,
  FilterOutlined,
  GlobalOutlined,
  HeartOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  InstagramOutlined,
  LinkOutlined,
  MessageOutlined,
  MoreOutlined,
  PushpinOutlined,
  RollbackOutlined,
  SearchOutlined,
  TagsOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  YoutubeFilled,
  RightOutlined,
} from '@ant-design/icons';
import AdminPageLayout from '../../components/AdminPageLayout';
import {
  PublishingFilterBar,
  PublishingFilterCell,
} from '../../components/PublishingFilterBar';
import {
  useManagedSystemTags,
  useManagedTagCollections,
} from '../../data/tagManagementStore';
import {
  resolveMessageSystemTags,
} from '../../data/tagManagement';
import {
  getPublishingTagFilterGroups,
  getSmartInboxTagCategories,
} from '../../data/publishingTaxonomy';
import { MESSAGE_TYPE_GROUPS } from '../../data/messageTypes';
import { filterItemsByChannelIds } from '../../data/channelManagement';
import { useChannelGroup } from '../../app/providers/useChannelGroup';
import {
  MESSAGES,
  applySmartInboxMessageAction,
  filterSmartInboxMessages,
  getMessageSentimentOptions,
  getMessageTagOptions,
  getMessageTypeValues,
  getSourceGroupsForChannels,
} from './smartInboxMockData';
import './SmartInboxAllMessages.css';

const { Text } = Typography;

const getSourceOptionValues = (sourceGroups) => (
  sourceGroups.flatMap((group) => group.options.map((option) => option.value))
);

const getSelectedSummary = (selectedCount, totalCount, allLabel = 'Viewing all') => {
  if (totalCount > 0 && selectedCount === totalCount) {
    return allLabel;
  }
  if (selectedCount === 0) {
    return 'None selected';
  }
  return `${selectedCount} selected`;
};

const getActiveCount = (selectedCount, totalCount) => (
  totalCount > 0 && selectedCount < totalCount ? Math.max(selectedCount, 1) : 0
);

const MORE_FILTERS = [
  { label: 'Tags', icon: <TagsOutlined /> },
  { label: 'Cases', icon: <PushpinOutlined /> },
  { label: 'Sentiment', icon: <CommentOutlined /> },
  { label: 'Message Status', icon: <CheckCircleOutlined /> },
  { label: 'Message Intent', icon: <MessageOutlined /> },
  { label: 'Response Classification', icon: <TagsOutlined /> },
  { label: 'Spam Classification', icon: <FilterOutlined /> },
  { label: 'Languages', icon: <GlobalOutlined /> },
];

const networkIconByName = {
  facebook: <FacebookFilled />,
  instagram: <InstagramOutlined />,
  youtube: <YoutubeFilled />,
};

const networkClassByName = {
  facebook: 'smart-inbox-network-facebook',
  instagram: 'smart-inbox-network-instagram',
  youtube: 'smart-inbox-network-youtube',
};

const sentimentColorByName = {
  Negative: 'error',
  Neutral: 'warning',
  Positive: 'success',
  Unclassified: 'default',
};

const systemTagColorByCategory = {
  Alert: 'red',
  Campaign: 'purple',
  Performance: 'gold',
  Sentiment: 'blue',
};

function NetworkIcon({ network }) {
  return (
    <span className={`smart-inbox-network ${networkClassByName[network] ?? ''}`} aria-hidden="true">
      {networkIconByName[network] ?? <MessageOutlined />}
    </span>
  );
}

function SourceFilterContent({ sourceGroups, selectedSourceIds, onChange }) {
  const allSourceIds = getSourceOptionValues(sourceGroups);
  const selectedSet = new Set(selectedSourceIds);
  const setGroupSelected = (group, checked) => {
    const groupValues = group.options.map((option) => option.value);
    const next = new Set(selectedSourceIds);
    groupValues.forEach((value) => {
      if (checked) {
        next.add(value);
      } else {
        next.delete(value);
      }
    });
    onChange([...next]);
  };

  return (
    <div className="smart-inbox-popover">
      <div className="smart-inbox-popover-header">
        <Text strong>Sources</Text>
        <Button type="link" onClick={() => onChange([])}>Clear</Button>
      </div>
      <div className="smart-inbox-popover-scroll">
        {sourceGroups.map((group) => (
          <div key={group.value} className="smart-inbox-filter-group">
            <Checkbox
              checked={group.options.every((option) => selectedSet.has(option.value))}
              indeterminate={group.options.some((option) => selectedSet.has(option.value))
                && !group.options.every((option) => selectedSet.has(option.value))}
              onChange={(event) => setGroupSelected(group, event.target.checked)}
            >
              {group.label}
            </Checkbox>
            <Checkbox.Group value={selectedSourceIds} onChange={onChange} className="smart-inbox-checkbox-grid">
              {group.options.map((option) => (
                <Checkbox key={option.value} value={option.value}>
                  <span className="smart-inbox-filter-option">
                    <NetworkIcon network={group.network} />
                    {option.label}
                  </span>
                </Checkbox>
              ))}
            </Checkbox.Group>
          </div>
        ))}
      </div>
      <div className="smart-inbox-popover-footer">
        <Button type="link" onClick={() => onChange(allSourceIds)}>Select all</Button>
        <Divider type="vertical" />
          <Button type="link">Connect a Channel</Button>
        <Divider type="vertical" />
        <Button type="link">Manage Keywords</Button>
      </div>
    </div>
  );
}

function MessageTypesContent({ selectedMessageTypes, onChange, allMessageTypes }) {
  return (
    <div className="smart-inbox-popover">
      <div className="smart-inbox-popover-header">
        <Text strong>Message Types</Text>
        <Button type="link" onClick={() => onChange([])}>Clear</Button>
      </div>
      <Input prefix={<SearchOutlined />} placeholder="Search Message Types" className="smart-inbox-popover-search" />
      <div className="smart-inbox-popover-scroll is-short">
        <Checkbox.Group value={selectedMessageTypes} onChange={onChange} className="smart-inbox-checkbox-grid">
          {MESSAGE_TYPE_GROUPS.map((group) => (
            <div key={group.value} className="smart-inbox-filter-group">
              <Text strong>{group.label}</Text>
              {group.options.map((option) => (
                <Checkbox key={option.value} value={option.value}>
                  <span className="smart-inbox-filter-option">
                    <NetworkIcon network={group.network} />
                    {option.label}
                  </span>
                </Checkbox>
              ))}
            </div>
          ))}
        </Checkbox.Group>
      </div>
      <div className="smart-inbox-popover-toggles">
        <Button type="link" onClick={() => onChange(allMessageTypes)}>Select all</Button>
        <label>
          <Switch defaultChecked />
          <span>Show completed messages</span>
        </label>
        <label>
          <Switch defaultChecked />
          <span>Show sent messages</span>
        </label>
      </div>
    </div>
  );
}

function SmartInboxTagsFilterContent({ onBack }) {
  const navigate = useNavigate();
  const [tagCollections] = useManagedTagCollections();
  const tagCategories = getSmartInboxTagCategories(tagCollections);

  return (
    <div className="smart-inbox-popover smart-inbox-tags-popover">
      <div className="smart-inbox-popover-header">
        <Text strong>Tags</Text>
        {onBack ? (
          <Button type="link" onClick={onBack}>
            Back
          </Button>
        ) : null}
      </div>
      <Input prefix={<SearchOutlined />} placeholder="Search Tags..." className="smart-inbox-popover-search" />
      <div className="smart-inbox-more-filter-list">
        {tagCategories.map((label) => (
          <Button key={label} type="text" icon={<TagsOutlined />} className="smart-inbox-filter-row-button">
            <span>{label}</span>
            <RightOutlined />
          </Button>
        ))}
      </div>
      <div className="smart-inbox-popover-footer">
        <Button type="link" onClick={() => navigate('/settings/tag-management')}>
          Manage
        </Button>
      </div>
    </div>
  );
}

function MessageTagsFilterContent({ tagOptions, selectedTags, onChange }) {
  return (
    <div className="smart-inbox-popover smart-inbox-tags-popover">
      <div className="smart-inbox-popover-header">
        <Text strong>Tags</Text>
        <Button type="link" disabled={!selectedTags.length} onClick={() => onChange([])}>
          Clear
        </Button>
      </div>
      <Input prefix={<SearchOutlined />} placeholder="Search Tags..." className="smart-inbox-popover-search" />
      <Checkbox.Group value={selectedTags} onChange={onChange} className="smart-inbox-checkbox-grid">
        {tagOptions.map((tag) => (
          <Checkbox key={tag} value={tag}>
            {tag}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </div>
  );
}

function CasesFilterContent() {
  return (
    <div className="smart-inbox-popover is-compact">
      <div className="smart-inbox-popover-header">
        <Text strong>Cases</Text>
      </div>
      <Text type="secondary">No case-linked messages are available in the local Smart Inbox mock data.</Text>
    </div>
  );
}

function SentimentFilterContent({ sentimentOptions, selectedSentiments, onChange }) {
  return (
    <div className="smart-inbox-popover is-compact">
      <div className="smart-inbox-popover-header">
        <Text strong>Sentiment</Text>
        <Button type="link" disabled={!selectedSentiments.length} onClick={() => onChange([])}>
          Clear
        </Button>
      </div>
      <Checkbox.Group value={selectedSentiments} onChange={onChange} className="smart-inbox-checkbox-grid">
        {sentimentOptions.map((sentiment) => (
          <Checkbox key={sentiment} value={sentiment}>
            {sentiment}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </div>
  );
}

function MoreFiltersContent() {
  const [activePanel, setActivePanel] = useState(null);

  if (activePanel === 'Tags') {
    return <SmartInboxTagsFilterContent onBack={() => setActivePanel(null)} />;
  }

  return (
    <div className="smart-inbox-popover is-compact">
      <div className="smart-inbox-popover-header">
        <Text strong>More Filters</Text>
      </div>
      <div className="smart-inbox-more-filter-list">
        {MORE_FILTERS.map((item) => (
          <Button
            key={item.label}
            type="text"
            icon={item.icon}
            onClick={() => {
              if (item.label === 'Tags') {
                setActivePanel('Tags');
              }
            }}
          >
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

function ActivitySparkline() {
  return (
    <span className="smart-inbox-sparkline" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, index) => (
        <span key={index} style={{ height: `${8 + ((index * 7) % 18)}px` }} />
      ))}
    </span>
  );
}

function MoreActionsMenuContent({
  splitPaneMode,
  setSplitPaneMode,
  conversationView,
  setConversationView,
}) {
  const navigate = useNavigate();

  return (
    <div className="smart-inbox-top-menu" role="menu">
      <div className="smart-inbox-top-menu-row">
        <Text strong>Message size:</Text>
        <Button.Group>
          <Button size="small">Compact</Button>
          <Button size="small" type="primary">Large</Button>
        </Button.Group>
      </div>
      <div className="smart-inbox-top-menu-row">
        <span>
          Split pane mode <InfoCircleOutlined />
        </span>
        <Switch
          checked={splitPaneMode}
          onChange={setSplitPaneMode}
          aria-label="Toggle split pane mode"
        />
      </div>
      <div className="smart-inbox-top-menu-row">
        <span>
          Conversation view <InfoCircleOutlined />
        </span>
        <Switch
          checked={conversationView}
          onChange={setConversationView}
          aria-label="Toggle conversation view"
        />
      </div>
      <Divider />
      <Text type="secondary" className="smart-inbox-top-menu-label">Bulk Update options</Text>
      <Button type="text" icon={<CheckCircleOutlined />}>Mark Complete in Bulk</Button>
      <Button type="text" icon={<InboxOutlined />}>View Bulk Update Status</Button>
      <Divider />
      <Text type="secondary" className="smart-inbox-top-menu-label">Settings</Text>
      <Button type="text">Manage Contact Lists</Button>
      <Button type="text">Rule Settings</Button>
      <Button type="text" onClick={() => navigate('/settings/tag-management')}>Manage Tags</Button>
      <Divider />
      <Text type="secondary" className="smart-inbox-top-menu-label">Insights</Text>
      <Button type="text" icon={<TeamOutlined />}>View Team Report</Button>
    </div>
  );
}

function MoreActionsDropdown({
  label = 'More actions',
  splitPaneMode,
  setSplitPaneMode,
  conversationView,
  setConversationView,
}) {
  return (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      popupRender={() => (
        <MoreActionsMenuContent
          splitPaneMode={splitPaneMode}
          setSplitPaneMode={setSplitPaneMode}
          conversationView={conversationView}
          setConversationView={setConversationView}
        />
      )}
    >
      <Button icon={<MoreOutlined />} aria-label={label} />
    </Dropdown>
  );
}

function HeaderControls({
  setFiltersVisible,
  searchQuery,
  onSearchChange,
  splitPaneMode,
  setSplitPaneMode,
  conversationView,
  setConversationView,
}) {
  return (
    <div className="smart-inbox-header-controls">
      <Button
        type="primary"
        icon={<FilterOutlined />}
        className="smart-inbox-filter-button"
        onClick={() => setFiltersVisible((visible) => !visible)}
      >
        Filters
      </Button>
      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder="Search messages..."
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        className="smart-inbox-search"
      />
      <Button className="smart-inbox-metric-button">
        <ActivitySparkline />
        <span>71 remaining</span>
      </Button>
      <Button icon={<CalendarOutlined />}>Previous 90 days</Button>
      <Tooltip title="Share">
        <Button icon={<ExportOutlined />} aria-label="Share inbox view" />
      </Tooltip>
      <MoreActionsDropdown
        splitPaneMode={splitPaneMode}
        setSplitPaneMode={setSplitPaneMode}
        conversationView={conversationView}
        setConversationView={setConversationView}
      />
    </div>
  );
}

function FilterBar({
  visible,
  sourceGroups,
  selectedSourceIds,
  setSelectedSourceIds,
  selectedMessageTypes,
  setSelectedMessageTypes,
  allMessageTypes,
  tagOptions,
  selectedTags,
  setSelectedTags,
  sentimentOptions,
  selectedSentiments,
  setSelectedSentiments,
  onResetFilters,
}) {
  if (!visible) {
    return null;
  }

  const allSourceIds = getSourceOptionValues(sourceGroups);
  const activeSourceCount = getActiveCount(selectedSourceIds.length, allSourceIds.length);
  const activeMessageTypeCount = getActiveCount(selectedMessageTypes.length, allMessageTypes.length);
  const activeFilterCount = activeSourceCount
    + activeMessageTypeCount
    + selectedTags.length
    + selectedSentiments.length;

  return (
    <PublishingFilterBar
      ariaLabel="Smart Inbox filters"
      className="smart-inbox-global-filterbar"
      activeCount={activeFilterCount}
      onClearAll={onResetFilters}
      clearText="Reset"
      showClearAll
      actions={<Button>Save As...</Button>}
    >
      <PublishingFilterCell
        title="Sources"
        summary={getSelectedSummary(selectedSourceIds.length, allSourceIds.length)}
        activeCount={activeSourceCount}
        popoverWidth={360}
      >
        <SourceFilterContent
          sourceGroups={sourceGroups}
          selectedSourceIds={selectedSourceIds}
          onChange={setSelectedSourceIds}
        />
      </PublishingFilterCell>
      <PublishingFilterCell
        title="Message Types"
        summary={`${getSelectedSummary(selectedMessageTypes.length, allMessageTypes.length)} Showing Completed`}
        activeCount={activeMessageTypeCount}
        popoverWidth={360}
      >
        <MessageTypesContent
          selectedMessageTypes={selectedMessageTypes}
          onChange={setSelectedMessageTypes}
          allMessageTypes={allMessageTypes}
        />
      </PublishingFilterCell>
      <PublishingFilterCell
        title="Tags"
        summary={selectedTags.length ? `${selectedTags.length} selected` : 'None selected'}
        activeCount={selectedTags.length}
        popoverWidth={360}
      >
        <MessageTagsFilterContent
          tagOptions={tagOptions}
          selectedTags={selectedTags}
          onChange={setSelectedTags}
        />
      </PublishingFilterCell>
      <PublishingFilterCell title="Cases" summary="None selected" popoverWidth={360}>
        <CasesFilterContent />
      </PublishingFilterCell>
      <PublishingFilterCell
        title="Sentiment"
        summary={selectedSentiments.length ? `${selectedSentiments.length} selected` : 'None selected'}
        activeCount={selectedSentiments.length}
        popoverWidth={360}
      >
        <SentimentFilterContent
          sentimentOptions={sentimentOptions}
          selectedSentiments={selectedSentiments}
          onChange={setSelectedSentiments}
        />
      </PublishingFilterCell>
      <PublishingFilterCell title="More Filters" summary="" popoverWidth={360}>
        <MoreFiltersContent />
      </PublishingFilterCell>
    </PublishingFilterBar>
  );
}

function MessageMediaPreview() {
  return (
    <div className="smart-inbox-media-preview" aria-hidden="true">
      <span className="smart-inbox-media-brand">TGD</span>
      <span />
      <span />
      <span />
    </div>
  );
}

function MessageOverflowMenu({ message, onMessageAction }) {
  return (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      menu={{
        items: [
          { key: 'save', label: message.saved ? 'Unsave Message' : 'Save Message' },
          {
            key: 'sentiment',
            label: 'Change Sentiment',
            children: ['Positive', 'Neutral', 'Negative', 'Unclassified'].map((sentiment) => ({
              key: `sentiment:${sentiment}`,
              label: sentiment,
            })),
          },
          { key: 'language', label: 'Detected Language' },
          { key: 'email', label: 'Email Message' },
          { key: 'export', label: 'Export Thread' },
          { type: 'divider' },
          { key: 'delete', label: 'Delete from Sprout', danger: true },
        ],
        onClick: ({ key }) => {
          if (key === 'save') {
            onMessageAction(message.id, 'save');
            return;
          }
          if (key.startsWith('sentiment:')) {
            onMessageAction(message.id, 'sentiment', { sentiment: key.replace('sentiment:', '') });
          }
        },
      }}
    >
      <Button type="text" icon={<MoreOutlined />} aria-label={`More actions for ${message.author}`} />
    </Dropdown>
  );
}

function MessageTagPicker({ selectedTags, onChange }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [tagCollections] = useManagedTagCollections();
  const normalizedQuery = query.trim().toLowerCase();
  const tagGroups = useMemo(
    () => getPublishingTagFilterGroups(tagCollections),
    [tagCollections],
  );
  const visibleGroups = tagGroups
    .map((group) => ({
      ...group,
      options: normalizedQuery
        ? group.options.filter((option) => option.label.toLowerCase().includes(normalizedQuery))
        : group.options,
    }))
    .filter((group) => !normalizedQuery || group.label.toLowerCase().includes(normalizedQuery) || group.options.length);

  return (
    <div className="smart-inbox-popover smart-inbox-tags-apply-popover">
      <div className="smart-inbox-popover-header">
        <Text strong>Apply Tags</Text>
        <Button type="link" disabled={!selectedTags.length} onClick={() => onChange([])}>
          Clear
        </Button>
      </div>
      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder="Search Tags..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="smart-inbox-popover-search"
      />
      <Checkbox.Group value={selectedTags} onChange={onChange} className="smart-inbox-tag-checks">
        {visibleGroups.map((group) => (
          <div key={group.label} className="smart-inbox-filter-group">
            <Text type="secondary" className="smart-inbox-tag-group-label">{group.label}</Text>
            {group.options.map((option) => (
              <Checkbox key={option.value} value={option.label}>
                {option.label}
              </Checkbox>
            ))}
          </div>
        ))}
      </Checkbox.Group>
      <div className="smart-inbox-popover-footer">
        <Button type="link" onClick={() => navigate('/settings/tag-management')}>
          Manage Tags
        </Button>
      </div>
    </div>
  );
}

function MessageAction({ label, message, onMessageAction }) {
  const iconByLabel = {
    Like: <HeartOutlined />,
    'Apply Macro': <ThunderboltOutlined />,
    'Start Team Conversation': <CommentOutlined />,
    Tags: <TagsOutlined />,
    'Mark Complete': <CheckCircleOutlined />,
    'Create Case': <InboxOutlined />,
    Pin: <PushpinOutlined />,
    Reply: <RollbackOutlined />,
  };

  if (label === 'Tags') {
    return (
      <Popover
        trigger="click"
        placement="bottomRight"
        content={(
          <MessageTagPicker
            selectedTags={message.tags || []}
            onChange={(tags) => onMessageAction(message.id, 'tags', { tags })}
          />
        )}
        overlayClassName="smart-inbox-filter-popover"
      >
        <Button type="text" icon={<TagsOutlined />} aria-label={label} />
      </Popover>
    );
  }

  if (label === 'Mark Complete') {
    return (
      <Tooltip title={label}>
        <Button
          type="text"
          icon={<CheckCircleOutlined />}
          aria-label={label}
          onClick={() => onMessageAction(message.id, 'complete')}
        />
      </Tooltip>
    );
  }

  if (label === 'Create Case') {
    return (
      <Tooltip title={message.caseCreated ? 'Case created' : label}>
        <Button
          type="text"
          icon={<InboxOutlined />}
          aria-label={message.caseCreated ? 'Case created' : label}
          disabled={message.caseCreated}
          onClick={() => onMessageAction(message.id, 'case')}
        />
      </Tooltip>
    );
  }

  return (
    <Tooltip title={label}>
      <Button type="text" icon={iconByLabel[label] ?? <MoreOutlined />} aria-label={label} />
    </Tooltip>
  );
}

function isConversationMessage(message) {
  return /private|direct/.test(message.messageType);
}

function MessageCard({
  message,
  systemTags,
  onMessageAction,
  selected = false,
  onSelect,
  conversationView = false,
}) {
  const messageSystemTags = useMemo(
    () => resolveMessageSystemTags(message, systemTags),
    [message, systemTags],
  );
  const canSelect = typeof onSelect === 'function';
  const conversationMessage = isConversationMessage(message);

  return (
    <Card
      className={[
        'smart-inbox-message-card',
        selected ? 'is-selected' : '',
        conversationView ? 'is-conversation-view' : '',
      ].filter(Boolean).join(' ')}
      styles={{ body: { padding: 0 } }}
      onClick={canSelect ? () => onSelect(message.id) : undefined}
      role={canSelect ? 'button' : undefined}
      tabIndex={canSelect ? 0 : undefined}
      onKeyDown={canSelect ? (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(message.id);
        }
      } : undefined}
    >
      <header className="smart-inbox-message-header">
        <Avatar size={38} className="smart-inbox-avatar">{message.initials}</Avatar>
        <div className="smart-inbox-message-meta">
          <div className="smart-inbox-author-line">
            <NetworkIcon network={message.network} />
            <Text strong>{message.author}</Text>
            <Text type="secondary">@{message.handle}</Text>
          </div>
          <Text type="secondary">
            {message.context} <span className="smart-inbox-post-title">{message.postTitle}</span>
          </Text>
        </div>
        <div className="smart-inbox-card-status">
          <Text type="secondary" className="smart-inbox-message-time">{message.time}</Text>
          <Checkbox
            aria-label={`Select message from ${message.author}`}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      </header>
      <div className="smart-inbox-message-body">
        {message.isLinkBubble ? (
          <Button type="default" icon={<LinkOutlined />} className="smart-inbox-link-bubble">
            {message.message}
          </Button>
        ) : (
          <Text>{message.message}</Text>
        )}
        {message.hasMedia ? <MessageMediaPreview /> : null}
        <div className="smart-inbox-tags">
          {messageSystemTags.map((systemTag) => (
            <Tag
              key={systemTag.id}
              className="smart-inbox-system-tag"
              color={systemTagColorByCategory[systemTag.category] || 'blue'}
              icon={<TagsOutlined />}
            >
              {systemTag.name}
            </Tag>
          ))}
          {message.tags?.map((tag) => (
            <Tag key={tag} icon={<TagsOutlined />}>{tag}</Tag>
          ))}
          {message.saved ? (
            <Tag icon={<PushpinOutlined />}>Saved</Tag>
          ) : null}
          {message.caseCreated ? (
            <Tag color="blue" icon={<InboxOutlined />}>Case created</Tag>
          ) : null}
          {message.responseRecommended ? (
            <Tag icon={<MessageOutlined />}>Response recommended</Tag>
          ) : null}
          {conversationView && conversationMessage ? (
            <Tag icon={<MessageOutlined />}>Conversation</Tag>
          ) : null}
          <Tag color={sentimentColorByName[message.sentiment]}>{message.sentiment}</Tag>
        </div>
      </div>
      <footer className="smart-inbox-message-footer">
        <Button
          type="link"
          className="smart-inbox-thread-button"
          onClick={(event) => {
            event.stopPropagation();
            onSelect?.(message.id);
          }}
        >
          View Thread
        </Button>
        <div className="smart-inbox-card-actions" onClick={(event) => event.stopPropagation()}>
          <MessageOverflowMenu message={message} onMessageAction={onMessageAction} />
          {message.actions.map((action) => (
            <MessageAction key={action} label={action} message={message} onMessageAction={onMessageAction} />
          ))}
        </div>
      </footer>
    </Card>
  );
}

function ConversationModeHint() {
  return (
    <div className="smart-inbox-conversation-hint">
      <InfoCircleOutlined />
      <Text type="secondary">
        Conversation View is enabled. Click through to a thread before taking actions on individual messages.
      </Text>
    </div>
  );
}

function SplitPaneDetail({ message, conversationView, onClose }) {
  if (!message) {
    return (
      <Card className="smart-inbox-split-detail is-empty" styles={{ body: { padding: 0 } }}>
        <Empty
          description={(
            <>
              <Text strong>No Conversation Selected</Text>
              <Text type="secondary">Select a message from the stream to review the thread.</Text>
            </>
          )}
        />
      </Card>
    );
  }

  const title = isConversationMessage(message)
    ? `Private Conversation between ${message.author} and ${message.context.replace(/^(Direct Message to|Sent a Private Message to)\s+/i, '')}`
    : `Conversation on ${message.postTitle || message.context}`;

  return (
    <Card className="smart-inbox-split-detail" styles={{ body: { padding: 0 } }}>
      <header className="smart-inbox-split-detail-header">
        <div>
          <Text strong>{title}</Text>
          <Text type="secondary">@{message.handle} - {message.time}</Text>
        </div>
        <Button type="text" icon={<CloseOutlined />} aria-label="Close conversation detail" onClick={onClose} />
      </header>
      <div className="smart-inbox-split-detail-body">
        <Button type="link" className="smart-inbox-open-detail-button">Open Details</Button>
        {conversationView ? (
          <div className="smart-inbox-mode-hint">
            <InfoCircleOutlined />
            <span>Conversation view is grouping thread context for this message.</span>
          </div>
        ) : null}
        <Tabs
          size="small"
          items={[
            {
              key: 'reply',
              label: isConversationMessage(message) ? 'Private Reply' : 'Reply',
              children: (
                <div className="smart-inbox-thread-tab">
                  <div className="smart-inbox-thread-bubble">
                    <Avatar size={28} className="smart-inbox-avatar">{message.initials}</Avatar>
                    <div>
                      <Text strong>{message.author}</Text>
                      <Text>{message.message}</Text>
                    </div>
                  </div>
                  {message.hasMedia ? <MessageMediaPreview /> : null}
                  <Input.TextArea
                    disabled
                    autoSize={{ minRows: 3, maxRows: 4 }}
                    placeholder="Enter a reply"
                  />
                  <div className="smart-inbox-thread-actions">
                    <Checkbox>Mark All Complete</Checkbox>
                    <Button type="primary" disabled>Send</Button>
                  </div>
                </div>
              ),
            },
            {
              key: 'history',
              label: 'History',
              children: (
                <div className="smart-inbox-thread-history">
                  <Text type="secondary">No local history events have been recorded for this mock thread.</Text>
                </div>
              ),
            },
            {
              key: 'message-history',
              label: isConversationMessage(message) ? 'Private Message History' : 'Message History',
              children: (
                <div className="smart-inbox-thread-history">
                  <Text type="secondary">Thread history is read-only in this local parity view.</Text>
                </div>
              ),
            },
          ]}
        />
      </div>
    </Card>
  );
}

function BulkSelectContent() {
  return (
    <div className="smart-inbox-bulk-menu">
      <Checkbox defaultChecked>Select visible (36)</Checkbox>
      <Checkbox disabled>Select all</Checkbox>
      <Text type="secondary">
        Select all is unavailable when "Show sent messages" is enabled under the Message Type filter.
      </Text>
    </div>
  );
}

function BulkSelectDropdown() {
  return (
    <Dropdown trigger={['click']} placement="bottomRight" popupRender={() => <BulkSelectContent />}>
      <Button className="smart-inbox-bulk-button">
        <Checkbox aria-label="Select visible messages" />
        <DownOutlined />
      </Button>
    </Dropdown>
  );
}

export default function SmartInboxAllMessagesPage() {
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [sortValue, setSortValue] = useState('newest');
  const [messages, setMessages] = useState(MESSAGES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSourceIds, setSelectedSourceIds] = useState([]);
  const [selectedMessageTypes, setSelectedMessageTypes] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedSentiments, setSelectedSentiments] = useState([]);
  const [splitPaneMode, setSplitPaneMode] = useState(false);
  const [conversationView, setConversationView] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [systemTags] = useManagedSystemTags();
  const { activeChannelIds } = useChannelGroup();
  const channelScopedMessages = useMemo(
    () => filterItemsByChannelIds(messages.filter((message) => !message.completed), activeChannelIds),
    [activeChannelIds, messages],
  );
  const sourceGroups = useMemo(
    () => getSourceGroupsForChannels(activeChannelIds),
    [activeChannelIds],
  );
  const allSourceIds = useMemo(() => getSourceOptionValues(sourceGroups), [sourceGroups]);
  const allMessageTypes = useMemo(() => getMessageTypeValues(MESSAGE_TYPE_GROUPS), []);
  const tagOptions = useMemo(() => getMessageTagOptions(channelScopedMessages), [channelScopedMessages]);
  const sentimentOptions = useMemo(() => getMessageSentimentOptions(channelScopedMessages), [channelScopedMessages]);

  useEffect(() => {
    setSelectedSourceIds(allSourceIds);
  }, [allSourceIds]);

  useEffect(() => {
    setSelectedMessageTypes(allMessageTypes);
  }, [allMessageTypes]);

  const resetFilters = () => {
    setSelectedSourceIds(allSourceIds);
    setSelectedMessageTypes(allMessageTypes);
    setSelectedTags([]);
    setSelectedSentiments([]);
  };

  const handleMessageAction = (messageId, action, payload) => {
    setMessages((currentMessages) => applySmartInboxMessageAction(currentMessages, messageId, action, payload));

    if (action === 'complete') {
      antdMessage.success('Message marked complete locally');
      return;
    }
    if (action === 'save') {
      const target = messages.find((message) => message.id === messageId);
      antdMessage.success(target?.saved ? 'Message unsaved locally' : 'Message saved locally');
      return;
    }
    if (action === 'sentiment') {
      antdMessage.success(`Sentiment changed to ${payload?.sentiment}`);
      return;
    }
    if (action === 'tags') {
      antdMessage.success('Tags updated locally');
      return;
    }
    if (action === 'case') {
      antdMessage.success('Case created locally');
    }
  };

  const filteredMessages = useMemo(
    () => filterSmartInboxMessages(channelScopedMessages, {
      query: searchQuery,
      sourceChannelIds: selectedSourceIds,
      messageTypes: selectedMessageTypes,
      tags: selectedTags,
      sentiments: selectedSentiments,
    }),
    [channelScopedMessages, searchQuery, selectedMessageTypes, selectedSentiments, selectedSourceIds, selectedTags],
  );

  const visibleMessages = useMemo(() => {
    const nextMessages = [...filteredMessages];
    return sortValue === 'oldest' ? nextMessages.reverse() : nextMessages;
  }, [filteredMessages, sortValue]);

  useEffect(() => {
    if (!visibleMessages.length) {
      setSelectedMessageId(null);
      return;
    }

    if (splitPaneMode && !visibleMessages.some((message) => message.id === selectedMessageId)) {
      setSelectedMessageId(visibleMessages[0].id);
    }
  }, [selectedMessageId, splitPaneMode, visibleMessages]);

  const selectedMessage = useMemo(
    () => visibleMessages.find((message) => message.id === selectedMessageId) || null,
    [selectedMessageId, visibleMessages],
  );

  const loadedLabel = useMemo(() => {
    const hasActiveNarrowing = Boolean(searchQuery.trim())
      || messages.some((message) => message.completed)
      || selectedSourceIds.length !== allSourceIds.length
      || selectedMessageTypes.length !== allMessageTypes.length
      || selectedTags.length > 0
      || selectedSentiments.length > 0;
    const loadedCount = hasActiveNarrowing ? visibleMessages.length : visibleMessages.length * 9;
    return `${loadedCount} ${loadedCount === 1 ? 'message' : 'messages'} loaded`;
  }, [
    allMessageTypes.length,
    allSourceIds.length,
    messages,
    searchQuery,
    selectedMessageTypes.length,
    selectedSentiments.length,
    selectedSourceIds.length,
    selectedTags.length,
    visibleMessages.length,
  ]);

  return (
    <AdminPageLayout
      title="All Messages"
      headerExtra={(
        <HeaderControls
          setFiltersVisible={setFiltersVisible}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          splitPaneMode={splitPaneMode}
          setSplitPaneMode={setSplitPaneMode}
          conversationView={conversationView}
          setConversationView={setConversationView}
        />
      )}
      maxWidth="none"
      contentPadding="0 24px 24px"
    >
      <div className={[
        'smart-inbox-page',
        splitPaneMode ? 'is-split-pane' : '',
        conversationView ? 'is-conversation-view' : '',
      ].filter(Boolean).join(' ')}
      >
        <FilterBar
          visible={filtersVisible}
          sourceGroups={sourceGroups}
          selectedSourceIds={selectedSourceIds}
          setSelectedSourceIds={setSelectedSourceIds}
          selectedMessageTypes={selectedMessageTypes}
          setSelectedMessageTypes={setSelectedMessageTypes}
          allMessageTypes={allMessageTypes}
          tagOptions={tagOptions}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          sentimentOptions={sentimentOptions}
          selectedSentiments={selectedSentiments}
          setSelectedSentiments={setSelectedSentiments}
          onResetFilters={resetFilters}
        />
        <div className="smart-inbox-stream-toolbar">
          <Select
            value={sortValue}
            onChange={setSortValue}
            className="smart-inbox-sort"
            options={[
              { label: 'Newest to Oldest', value: 'newest' },
              { label: 'Oldest to Newest', value: 'oldest' },
            ]}
          />
          <Text type="secondary">{loadedLabel}</Text>
          <BulkSelectDropdown />
        </div>
        {conversationView ? <ConversationModeHint /> : null}
        <div className={splitPaneMode ? 'smart-inbox-split-shell' : ''}>
          <section className="smart-inbox-stream" aria-label="All messages stream">
            {visibleMessages.length ? (
              visibleMessages.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  systemTags={systemTags}
                  onMessageAction={handleMessageAction}
                  selected={splitPaneMode && selectedMessageId === message.id}
                  onSelect={splitPaneMode ? setSelectedMessageId : undefined}
                  conversationView={conversationView}
                />
              ))
            ) : (
              <Empty
                className="smart-inbox-stream-empty"
                description={(
                  <>
                    <Text strong>No messages found</Text>
                    <Text type="secondary">Adjust search or reset filters to broaden the stream.</Text>
                  </>
                )}
              >
                <Button onClick={() => { setSearchQuery(''); resetFilters(); }}>Reset filters</Button>
              </Empty>
            )}
          </section>
          {splitPaneMode ? (
            <SplitPaneDetail
              message={selectedMessage}
              conversationView={conversationView}
              onClose={() => setSelectedMessageId(null)}
            />
          ) : null}
        </div>
      </div>
    </AdminPageLayout>
  );
}
