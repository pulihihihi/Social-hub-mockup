import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Dropdown,
  Empty,
  Input,
  Select,
  Tabs,
  Tag,
  Tooltip,
  Typography,
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
  InfoCircleOutlined,
  InstagramOutlined,
  LinkOutlined,
  MessageOutlined,
  MoreOutlined,
  PictureOutlined,
  PushpinOutlined,
  RightOutlined,
  SearchOutlined,
  SmileOutlined,
  TagsOutlined,
  ThunderboltOutlined,
  UserOutlined,
  YoutubeFilled,
} from '@ant-design/icons';
import AdminPageLayout from '../../components/AdminPageLayout';
import {
  PublishingFilterBar,
  PublishingFilterCell,
} from '../../components/PublishingFilterBar';
import { PRIVATE_MESSAGE_TYPE_GROUPS } from '../../data/messageTypes';
import { filterItemsByChannelIds } from '../../data/channelManagement';
import { useChannelGroup } from '../../app/providers/useChannelGroup';
import {
  filterSmartInboxMessages,
  getMessageIntentOptions,
  getMessageSentimentOptions,
  getMessageTagOptions,
  getMessageTypeValues,
  getSourceGroupsForChannels,
} from '../SmartInboxAllMessages/smartInboxMockData';
import '../SmartInboxAllMessages/SmartInboxAllMessages.css';

const { Text, Title } = Typography;
const { TextArea } = Input;

const MORE_FILTERS = [
  { label: 'Cases', icon: <PushpinOutlined /> },
  { label: 'Sentiment', icon: <CommentOutlined /> },
  { label: 'Message Intent', icon: <MessageOutlined /> },
  { label: 'Response Classification', icon: <TagsOutlined /> },
  { label: 'Spam Classification', icon: <FilterOutlined /> },
  { label: 'Languages', icon: <GlobalOutlined /> },
];

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

const PRIVATE_THREADS = [
  {
    id: 'thread-1',
    sourceChannelId: 'ig-delta',
    author: 'Phat Jade',
    handle: 'jadephat',
    initials: 'PJ',
    network: 'instagram',
    messageType: 'instagram-direct-messages',
    account: 'Garena Delta Force VN',
    accountHandle: 'garenadeltaforcevn',
    time: '2 days ago',
    message: 'https://vt.tiktok.com/ZS9FeFDy3ksgg-DzD64/',
    detail:
      'Hi there! Thanks for reaching out, you are messaging with our chatbot. Please click on one of the options below so we can better assist you.',
    sentiment: 'Unclassified',
    messageIntent: 'Bot handoff',
    tags: ['Community'],
    remaining: '1 message',
  },
  {
    id: 'thread-2',
    sourceChannelId: 'fb-warrior',
    author: 'Thanh Nguyen',
    handle: 'thanhnguyen',
    initials: 'TN',
    network: 'facebook',
    messageType: 'facebook-private-messages',
    account: 'Chien Than Delta Force',
    accountHandle: 'chienthanDF',
    time: '3 days ago',
    message: 'Minh can kiem tra tinh trang don hang va chinh sach hoan tien.',
    detail: 'Cool. Click below and enter your login information to get an update on your order.',
    sentiment: 'Unclassified',
    messageIntent: 'Order support',
    tags: ['Always On'],
    remaining: '3 messages',
  },
  {
    id: 'thread-3',
    sourceChannelId: 'fb-warrior',
    author: 'Tran Van Tan',
    handle: 'tantran',
    initials: 'TT',
    network: 'facebook',
    messageType: 'facebook-private-messages',
    account: 'Chien Than Delta Force',
    accountHandle: 'chienthanDF',
    time: '4 days ago',
    message: 'Can gap nhan vien ho tro truc tiep.',
    detail: 'Great! Someone will be in touch shortly. While you wait, would you mind letting us know what you are reaching out about?',
    sentiment: 'Neutral',
    messageIntent: 'Agent request',
    tags: ['Escalation'],
    remaining: '2 messages',
  },
  {
    id: 'thread-4',
    sourceChannelId: 'fb-delta-main',
    author: 'Ngo Van Cuong',
    handle: 'cuongngo',
    initials: 'NC',
    network: 'facebook',
    messageType: 'facebook-private-messages',
    account: 'Garena Delta Force (VN - Vietnamese)',
    accountHandle: 'GarenaDeltaForceVN',
    time: '5 days ago',
    message: 'Cho minh xin thong tin doi tra.',
    detail: 'Sorry to hear your order did not work out. Please click this link and login to your account to cancel your order.',
    sentiment: 'Negative',
    messageIntent: 'Returns',
    tags: ['Refund'],
    remaining: '1 message',
  },
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

  return (
    <div className="smart-inbox-popover">
      <div className="smart-inbox-popover-header">
        <Text strong>Sources</Text>
        <Button type="link" disabled={!selectedSourceIds.length} onClick={() => onChange([])}>
          Clear
        </Button>
      </div>
      <div className="smart-inbox-popover-scroll">
        {sourceGroups.map((group) => (
          <div key={group.value} className="smart-inbox-filter-group">
            <Checkbox
              checked={group.options.every((option) => selectedSet.has(option.value))}
              indeterminate={group.options.some((option) => selectedSet.has(option.value))
                && !group.options.every((option) => selectedSet.has(option.value))}
              onChange={(event) => {
                const groupValues = group.options.map((option) => option.value);
                if (event.target.checked) {
                  onChange([...new Set([...selectedSourceIds, ...groupValues])]);
                  return;
                }
                onChange(selectedSourceIds.filter((value) => !groupValues.includes(value)));
              }}
            >
              {group.label}
            </Checkbox>
            <Checkbox.Group
              value={selectedSourceIds}
              onChange={onChange}
              className="smart-inbox-checkbox-grid"
            >
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
        <Button type="link">Connect a Channel</Button>
      </div>
    </div>
  );
}

function MessageTypesContent({ selectedMessageTypes, onChange, allMessageTypes }) {
  const selectedSet = new Set(selectedMessageTypes);

  return (
    <div className="smart-inbox-popover">
      <div className="smart-inbox-popover-header">
        <Text strong>Message Types</Text>
        <Button type="link" disabled={!selectedMessageTypes.length} onClick={() => onChange([])}>
          Clear
        </Button>
      </div>
      <Input prefix={<SearchOutlined />} placeholder="Search Message Types" className="smart-inbox-popover-search" />
      <div className="smart-inbox-popover-scroll is-short">
        {PRIVATE_MESSAGE_TYPE_GROUPS.map((group) => (
          <div key={group.value} className="smart-inbox-filter-group">
            <Checkbox
              checked={group.options.every((option) => selectedSet.has(option.value))}
              indeterminate={group.options.some((option) => selectedSet.has(option.value))
                && !group.options.every((option) => selectedSet.has(option.value))}
              onChange={(event) => {
                const groupValues = group.options.map((option) => option.value);
                if (event.target.checked) {
                  onChange([...new Set([...selectedMessageTypes, ...groupValues])]);
                  return;
                }
                onChange(selectedMessageTypes.filter((value) => !groupValues.includes(value)));
              }}
            >
              {group.label}
            </Checkbox>
            <Checkbox.Group
              value={selectedMessageTypes}
              onChange={onChange}
              className="smart-inbox-checkbox-grid"
            >
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
        <Button type="link" onClick={() => onChange(allMessageTypes)}>Select all</Button>
      </div>
    </div>
  );
}

function TagsFilterContent({ tagOptions, selectedTags, onChange }) {
  return (
    <div className="smart-inbox-popover is-compact">
      <div className="smart-inbox-popover-header">
        <Text strong>Tags</Text>
        <Button type="link" disabled={!selectedTags.length} onClick={() => onChange([])}>
          Clear
        </Button>
      </div>
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
      <Text type="secondary">No case-linked private messages are available in the local Smart Inbox mock data.</Text>
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

function MessageIntentFilterContent({ messageIntentOptions, selectedMessageIntents, onChange }) {
  return (
    <div className="smart-inbox-popover is-compact">
      <div className="smart-inbox-popover-header">
        <Text strong>Message Intent</Text>
        <Button type="link" disabled={!selectedMessageIntents.length} onClick={() => onChange([])}>
          Clear
        </Button>
      </div>
      <Checkbox.Group value={selectedMessageIntents} onChange={onChange} className="smart-inbox-checkbox-grid">
        {messageIntentOptions.map((intent) => (
          <Checkbox key={intent} value={intent}>
            {intent}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </div>
  );
}

function MoreFiltersContent() {
  return (
    <div className="smart-inbox-popover is-compact">
      <div className="smart-inbox-popover-header">
        <Text strong>More Filters</Text>
      </div>
      <div className="smart-inbox-more-filter-list">
        {MORE_FILTERS.map((item) => (
          <Button key={item.label} type="text" icon={item.icon} className="smart-inbox-filter-row-button">
            <span>{item.label}</span>
            <RightOutlined />
          </Button>
        ))}
      </div>
    </div>
  );
}

function ActivitySparkline() {
  return (
    <span className="smart-inbox-sparkline" aria-hidden="true">
      {Array.from({ length: 14 }).map((_, index) => (
        <span key={index} style={{ height: `${7 + ((index * 5) % 16)}px` }} />
      ))}
    </span>
  );
}

function HeaderControls({ setFiltersVisible, searchQuery, onSearchChange }) {
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
        className="smart-inbox-search"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <Button className="smart-inbox-metric-button">
        <ActivitySparkline />
        <span>66 remaining</span>
      </Button>
      <Button icon={<CalendarOutlined />}>Previous 90 days</Button>
      <Tooltip title="Share">
        <Button icon={<ExportOutlined />} aria-label="Share private messages" />
      </Tooltip>
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
  messageIntentOptions,
  selectedMessageIntents,
  setSelectedMessageIntents,
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
    + selectedSentiments.length
    + selectedMessageIntents.length;

  return (
    <PublishingFilterBar
      ariaLabel="Private Messages filters"
      className="smart-inbox-global-filterbar"
      activeCount={activeFilterCount}
      onClearAll={onResetFilters}
      clearText="Reset"
      showClearAll
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
        summary={getSelectedSummary(selectedMessageTypes.length, allMessageTypes.length)}
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
        <TagsFilterContent
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
      <PublishingFilterCell
        title="Message Intent"
        summary={selectedMessageIntents.length ? `${selectedMessageIntents.length} selected` : 'None selected'}
        activeCount={selectedMessageIntents.length}
        popoverWidth={360}
      >
        <MessageIntentFilterContent
          messageIntentOptions={messageIntentOptions}
          selectedMessageIntents={selectedMessageIntents}
          onChange={setSelectedMessageIntents}
        />
      </PublishingFilterCell>
      <PublishingFilterCell title="More Filters" summary="" popoverWidth={360}>
        <MoreFiltersContent />
      </PublishingFilterCell>
    </PublishingFilterBar>
  );
}

function ThreadCard({ thread, selected, onSelect }) {
  return (
    <Card
      className={`smart-inbox-private-thread-card ${selected ? 'is-selected' : ''}`}
      styles={{ body: { padding: 0 } }}
      onClick={onSelect}
    >
      <div className="smart-inbox-private-thread-head">
        <Avatar size={36} className="smart-inbox-avatar">{thread.initials}</Avatar>
        <div>
          <div className="smart-inbox-author-line">
            <NetworkIcon network={thread.network} />
            <Text strong>{thread.author}</Text>
          </div>
          <Text type="secondary">@{thread.handle}</Text>
        </div>
        <Checkbox aria-label={`Select conversation with ${thread.author}`} onClick={(event) => event.stopPropagation()} />
      </div>
      <Text className="smart-inbox-private-thread-message">{thread.message}</Text>
      <div className="smart-inbox-private-thread-footer">
        <Tag>{thread.sentiment}</Tag>
        <Text type="secondary">{thread.time}</Text>
        <Button type="link" onClick={(event) => { event.stopPropagation(); onSelect(); }}>
          View Thread
        </Button>
      </div>
    </Card>
  );
}

function ThreadMoreMenu({ thread }) {
  return (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      menu={{
        items: [
          { key: 'summarize', label: 'Summarize conversation' },
          { key: 'assign', label: 'Create Case' },
          { key: 'tag', label: 'Apply Tags' },
          { key: 'complete', label: 'Mark All Complete' },
          { type: 'divider' },
          { key: 'email', label: 'Email Message' },
          { key: 'delete', label: 'Delete from Sprout', danger: true },
        ],
      }}
    >
      <Button type="text" icon={<MoreOutlined />} aria-label={`More actions for ${thread.author}`} />
    </Dropdown>
  );
}

function ConversationDetail({ thread, onClose }) {
  if (!thread) {
    return (
      <Card className="smart-inbox-private-detail is-empty" styles={{ body: { padding: 0 } }}>
        <Text type="secondary">No Conversation Selected</Text>
      </Card>
    );
  }

  return (
    <Card className="smart-inbox-private-detail" styles={{ body: { padding: 0 } }}>
      <div className="smart-inbox-private-detail-header">
        <Button type="text" icon={<CloseOutlined />} aria-label="Close conversation detail" onClick={onClose} />
        <div>
          <Title level={4}>Private Conversation between {thread.author} and {thread.account}</Title>
          <Text type="secondary">{thread.remaining} in this thread</Text>
        </div>
        <Button icon={<UserOutlined />}>Open Details</Button>
      </div>
      <Tabs
        className="smart-inbox-private-detail-tabs"
        defaultActiveKey="reply"
        items={[
          { key: 'reply', label: 'Private Reply' },
          { key: 'history', label: 'History' },
          { key: 'private-history', label: 'Private Message History' },
        ]}
      />
      <div className="smart-inbox-private-thread-actions">
        <Button icon={<ThunderboltOutlined />}>Summarize</Button>
        <Button icon={<CheckCircleOutlined />}>Mark All Complete</Button>
        <ThreadMoreMenu thread={thread} />
      </div>
      <div className="smart-inbox-private-timeline">
        <div className="smart-inbox-private-date">4 May 2026</div>
        <div className="smart-inbox-private-bubble">
          <Avatar size={32} className="smart-inbox-avatar">{thread.initials}</Avatar>
          <div>
            <Text strong>{thread.author}</Text>
            <Text>{thread.detail}</Text>
            {thread.message.startsWith('http') ? (
              <Button type="default" icon={<LinkOutlined />} className="smart-inbox-link-bubble">
                {thread.message}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      <Card className="smart-inbox-private-composer" styles={{ body: { padding: 0 } }}>
        <div className="smart-inbox-private-composer-channel">
          <Avatar size={30} className="smart-inbox-avatar">{thread.account.slice(0, 2).toUpperCase()}</Avatar>
          <div>
            <Text strong>{thread.account}</Text>
            <Text type="secondary">@{thread.accountHandle}</Text>
          </div>
        </div>
        <TextArea rows={4} placeholder="Enter a reply" />
        <div className="smart-inbox-private-composer-toolbar">
          <Button type="text" icon={<TagsOutlined />} aria-label="Saved replies" />
          <Button type="text" icon={<PictureOutlined />} aria-label="Add media" />
          <Button type="text" icon={<SmileOutlined />} aria-label="Add emoji" />
          <Button type="text" icon={<HeartOutlined />} aria-label="Like" />
          <Checkbox>Mark All Complete</Checkbox>
          <Button type="primary">Send</Button>
        </div>
      </Card>
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

function PrivateMessagesSplitView({ threads, onResetFilters }) {
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const selectedThread = threads.find((thread) => thread.id === selectedThreadId);

  return (
    <section className="smart-inbox-private-shell" aria-label="Private message conversation view">
      <Card className="smart-inbox-private-list" styles={{ body: { padding: 0 } }}>
        {threads.length ? (
          threads.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              selected={thread.id === selectedThreadId}
              onSelect={() => setSelectedThreadId(thread.id)}
            />
          ))
        ) : (
          <Empty
            className="smart-inbox-private-empty"
            description={(
              <>
                <Text strong>No private messages found</Text>
                <Text type="secondary">Adjust search or reset filters to broaden the private stream.</Text>
              </>
            )}
          >
            <Button onClick={onResetFilters}>Reset filters</Button>
          </Empty>
        )}
      </Card>
      <ConversationDetail thread={selectedThread} onClose={() => setSelectedThreadId(null)} />
    </section>
  );
}

export default function SmartInboxPrivatePage() {
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [sortValue, setSortValue] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSourceIds, setSelectedSourceIds] = useState([]);
  const [selectedMessageTypes, setSelectedMessageTypes] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedSentiments, setSelectedSentiments] = useState([]);
  const [selectedMessageIntents, setSelectedMessageIntents] = useState([]);
  const { activeChannelIds } = useChannelGroup();
  const channelScopedThreads = useMemo(
    () => filterItemsByChannelIds(PRIVATE_THREADS, activeChannelIds),
    [activeChannelIds],
  );
  const sourceGroups = useMemo(
    () => getSourceGroupsForChannels(activeChannelIds),
    [activeChannelIds],
  );
  const allSourceIds = useMemo(() => getSourceOptionValues(sourceGroups), [sourceGroups]);
  const allMessageTypes = useMemo(() => getMessageTypeValues(PRIVATE_MESSAGE_TYPE_GROUPS), []);
  const tagOptions = useMemo(() => getMessageTagOptions(channelScopedThreads), [channelScopedThreads]);
  const sentimentOptions = useMemo(() => getMessageSentimentOptions(channelScopedThreads), [channelScopedThreads]);
  const messageIntentOptions = useMemo(() => getMessageIntentOptions(channelScopedThreads), [channelScopedThreads]);

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
    setSelectedMessageIntents([]);
  };

  const resetSearchAndFilters = () => {
    setSearchQuery('');
    resetFilters();
  };

  const filteredThreads = useMemo(
    () => filterSmartInboxMessages(channelScopedThreads, {
      query: searchQuery,
      sourceChannelIds: selectedSourceIds,
      messageTypes: selectedMessageTypes,
      tags: selectedTags,
      sentiments: selectedSentiments,
      messageIntents: selectedMessageIntents,
    }),
    [
      channelScopedThreads,
      searchQuery,
      selectedMessageIntents,
      selectedMessageTypes,
      selectedSentiments,
      selectedSourceIds,
      selectedTags,
    ],
  );

  const visibleThreads = useMemo(() => {
    const nextThreads = [...filteredThreads];
    return sortValue === 'oldest' ? nextThreads.reverse() : nextThreads;
  }, [filteredThreads, sortValue]);

  return (
    <AdminPageLayout
      title="Private Messages"
      headerExtra={(
        <HeaderControls
          setFiltersVisible={setFiltersVisible}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}
      maxWidth="none"
      contentPadding="0 24px 24px"
    >
      <div className="smart-inbox-page">
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
          messageIntentOptions={messageIntentOptions}
          selectedMessageIntents={selectedMessageIntents}
          setSelectedMessageIntents={setSelectedMessageIntents}
          onResetFilters={resetFilters}
        />
        <div className="smart-inbox-private-toolbar">
          <Select
            value={sortValue}
            onChange={setSortValue}
            className="smart-inbox-sort"
            options={[
              { label: 'Newest to Oldest', value: 'newest' },
              { label: 'Oldest to Newest', value: 'oldest' },
            ]}
          />
          <Dropdown trigger={['click']} placement="bottomRight" popupRender={() => <BulkSelectContent />}>
            <Button className="smart-inbox-bulk-button">
              <Checkbox aria-label="Select visible private messages" />
              <DownOutlined />
            </Button>
          </Dropdown>
          <span className="smart-inbox-mode-hint">
            Conversation view <InfoCircleOutlined />
          </span>
        </div>
        <PrivateMessagesSplitView threads={visibleThreads} onResetFilters={resetSearchAndFilters} />
      </div>
    </AdminPageLayout>
  );
}
