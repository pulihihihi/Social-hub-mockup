import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Divider,
  Dropdown,
  Empty,
  Input,
  Select,
  Switch,
  Tooltip,
  Typography,
} from 'antd';
import {
  CalendarOutlined,
  CommentOutlined,
  ExportOutlined,
  FacebookFilled,
  FilterOutlined,
  GlobalOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  InstagramOutlined,
  MessageOutlined,
  MoreOutlined,
  PushpinOutlined,
  RightOutlined,
  SearchOutlined,
  TagsOutlined,
  YoutubeFilled,
} from '@ant-design/icons';
import AdminPageLayout from '../../components/AdminPageLayout';
import {
  PublishingFilterBar,
  PublishingFilterCell,
} from '../../components/PublishingFilterBar';
import { useManagedTagCollections } from '../../data/tagManagementStore';
import { getSmartInboxTagCategories } from '../../data/publishingTaxonomy';
import { MESSAGE_TYPE_GROUPS } from '../../data/messageTypes';
import '../SmartInboxAllMessages/SmartInboxAllMessages.css';

const { Text, Title } = Typography;

const SOURCE_GROUPS = [
  {
    label: 'All Facebook',
    network: 'facebook',
    options: ['Garena Delta Force VN', 'Garena Lien Quan Mobile'],
  },
  {
    label: 'All Instagram',
    network: 'instagram',
    options: ['garenadeltaforcevn', 'aovesportsvn'],
  },
  {
    label: 'All YouTube',
    network: 'youtube',
    options: ['Garena Delta Force'],
  },
];

const MORE_FILTERS = [
  { label: 'Cases', icon: <PushpinOutlined /> },
  { label: 'Sentiment', icon: <CommentOutlined /> },
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

function NetworkIcon({ network }) {
  return (
    <span className={`smart-inbox-network ${networkClassByName[network] ?? ''}`} aria-hidden="true">
      {networkIconByName[network] ?? <MessageOutlined />}
    </span>
  );
}

function SourceFilterContent() {
  return (
    <div className="smart-inbox-popover">
      <div className="smart-inbox-popover-header">
        <Text strong>Sources</Text>
        <Button type="link">Clear</Button>
      </div>
      <div className="smart-inbox-popover-scroll">
        {SOURCE_GROUPS.map((group) => (
          <div key={group.label} className="smart-inbox-filter-group">
            <Checkbox defaultChecked>{group.label}</Checkbox>
            {group.options.map((option) => (
              <Checkbox key={option} defaultChecked>
                <span className="smart-inbox-filter-option">
                  <NetworkIcon network={group.network} />
                  {option}
                </span>
              </Checkbox>
            ))}
          </div>
        ))}
      </div>
      <div className="smart-inbox-popover-footer">
          <Button type="link">Connect a Channel</Button>
      </div>
    </div>
  );
}

function MessageTypesContent() {
  return (
    <div className="smart-inbox-popover">
      <div className="smart-inbox-popover-header">
        <Text strong>Message Types</Text>
        <Button type="link">Clear</Button>
      </div>
      <Input prefix={<SearchOutlined />} placeholder="Search Message Types" className="smart-inbox-popover-search" />
      <div className="smart-inbox-popover-scroll is-short">
        {MESSAGE_TYPE_GROUPS.map((group) => (
          <div key={group.value} className="smart-inbox-filter-group">
            <Checkbox defaultChecked>{group.label}</Checkbox>
            {group.options.map((option) => (
              <Checkbox key={option.value} defaultChecked>
                <span className="smart-inbox-filter-option">
                  <NetworkIcon network={group.network} />
                  {option.label}
                </span>
              </Checkbox>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function TagsFilterContent() {
  const [tagCollections] = useManagedTagCollections();
  const tagCategories = getSmartInboxTagCategories(tagCollections);

  return (
    <div className="smart-inbox-popover smart-inbox-tags-popover">
      <div className="smart-inbox-popover-header">
        <Text strong>Tags</Text>
        <Button type="link">Reset</Button>
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
      <div className="smart-inbox-popover-toggles">
        <label>
          <Switch />
          <span>Match all selected</span>
        </label>
      </div>
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
        <span key={index} style={{ height: `${6 + ((index * 5) % 20)}px` }} />
      ))}
    </span>
  );
}

function MoreActionsMenuContent() {
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
            <Switch />
      </div>
      <div className="smart-inbox-top-menu-row">
        <span>
          Conversation view <InfoCircleOutlined />
        </span>
            <Switch />
      </div>
      <Divider />
      <Text type="secondary" className="smart-inbox-top-menu-label">Bulk Update options</Text>
      <Button type="text" icon={<InboxOutlined />}>View Bulk Update Status</Button>
      <Divider />
      <Text type="secondary" className="smart-inbox-top-menu-label">Settings</Text>
      <Button type="text">Manage Contact Lists</Button>
      <Button type="text">Rule Settings</Button>
      <Button type="text" onClick={() => navigate('/settings/tag-management')}>Manage Tags</Button>
    </div>
  );
}

function HeaderControls({ setFiltersVisible }) {
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
      />
      <Button className="smart-inbox-metric-button">
        <ActivitySparkline />
        <span>0 completed</span>
      </Button>
      <Button icon={<CalendarOutlined />}>Previous 90 days</Button>
      <Tooltip title="Share">
        <Button icon={<ExportOutlined />} aria-label="Share completed messages" />
      </Tooltip>
      <Dropdown trigger={['click']} placement="bottomRight" popupRender={() => <MoreActionsMenuContent />}>
        <Button icon={<MoreOutlined />} aria-label="More completed message actions" />
      </Dropdown>
    </div>
  );
}

function FilterBar({ visible }) {
  if (!visible) {
    return null;
  }

  return (
    <PublishingFilterBar ariaLabel="Completed Messages filters" className="smart-inbox-global-filterbar">
      <PublishingFilterCell title="Sources" summary="Viewing all" popoverWidth={360}>
        <SourceFilterContent />
      </PublishingFilterCell>
      <PublishingFilterCell title="Message Types" summary="Viewing all" popoverWidth={360}>
        <MessageTypesContent />
      </PublishingFilterCell>
      <PublishingFilterCell title="Tags" summary="None selected" popoverWidth={360}>
        <TagsFilterContent />
      </PublishingFilterCell>
      <PublishingFilterCell title="More Filters" summary="" popoverWidth={360}>
        <MoreFiltersContent />
      </PublishingFilterCell>
    </PublishingFilterBar>
  );
}

function CompletedEmptyState() {
  return (
    <Empty
      className="smart-inbox-empty is-completed"
      image={(
        <div className="smart-inbox-completed-illustration" aria-hidden="true">
          <div className="smart-inbox-completed-card">
            <span />
            <span />
            <span />
          </div>
          <div className="smart-inbox-completed-search">
            <SearchOutlined />
          </div>
        </div>
      )}
      description={(
        <>
          <Title level={2}>No messages found</Title>
          <Text>You have no messages that match your current filters.</Text>
        </>
      )}
    >
      <Button type="primary">Reset filters</Button>
    </Empty>
  );
}

function BulkSelectContent() {
  return (
    <div className="smart-inbox-bulk-menu">
      <Checkbox defaultChecked>Select visible (0)</Checkbox>
      <Checkbox disabled>Select all</Checkbox>
      <Text type="secondary">
        Select all is unavailable when there are no completed messages matching the current filters.
      </Text>
    </div>
  );
}

export default function SmartInboxCompletedPage() {
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [sortValue, setSortValue] = useState('newest');

  return (
    <AdminPageLayout
      title="Completed Messages"
      headerExtra={<HeaderControls setFiltersVisible={setFiltersVisible} />}
      maxWidth="none"
      contentPadding="0 24px 24px"
    >
      <div className="smart-inbox-page">
        <FilterBar visible={filtersVisible} />
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
          <Dropdown trigger={['click']} placement="bottomRight" popupRender={() => <BulkSelectContent />}>
            <Button className="smart-inbox-bulk-button">
              <Checkbox aria-label="Select all messages" />
              <MoreOutlined />
            </Button>
          </Dropdown>
        </div>
        <CompletedEmptyState />
      </div>
    </AdminPageLayout>
  );
}
