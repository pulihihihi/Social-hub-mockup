import { useState } from 'react';
import {
  Button,
  Checkbox,
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
      <div className="smart-inbox-popover-toggles">
        <label>
          <Switch defaultChecked />
          <span>Show sent messages</span>
        </label>
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

function HeaderControls({ setFiltersVisible }) {
  return (
    <div className="smart-inbox-header-controls">
      <Button
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
      <Button icon={<CalendarOutlined />}>Previous 90 days</Button>
      <Tooltip title="Share">
        <Button icon={<ExportOutlined />} aria-label="Share saved messages" />
      </Tooltip>
      <Tooltip title="More actions">
        <Button icon={<MoreOutlined />} aria-label="More saved message actions" />
      </Tooltip>
    </div>
  );
}

function FilterBar({ visible }) {
  if (!visible) {
    return null;
  }

  return (
    <PublishingFilterBar ariaLabel="Saved Messages filters" className="smart-inbox-global-filterbar">
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

function SavedMessagesEmptyState() {
  return (
    <section className="smart-inbox-empty is-saved" aria-label="Saved messages empty state">
      <div className="smart-inbox-empty-copy">
        <Title level={2}>Save messages you need to revisit later</Title>
        <Text>
          Messages you save from the Smart Inbox appear here so you can take action whenever you're ready.
        </Text>
      </div>
      <div className="smart-inbox-saved-illustration" aria-hidden="true">
        <div className="smart-inbox-saved-card">
          <span className="smart-inbox-saved-network" />
          <span />
          <span />
          <span />
          <div className="smart-inbox-saved-media" />
          <div className="smart-inbox-saved-actions">
            <MoreOutlined />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="smart-inbox-saved-note">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  );
}

export default function SmartInboxSavedMessagesPage() {
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [sortValue, setSortValue] = useState('newest');

  return (
    <AdminPageLayout
      title="Saved Messages"
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
        </div>
        <SavedMessagesEmptyState />
      </div>
    </AdminPageLayout>
  );
}
