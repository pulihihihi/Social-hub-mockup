import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  Input,
  Popover,
  Typography,
} from 'antd';
import {
  FileTextOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import AdminPageLayout from '../../components/AdminPageLayout';
import { ChannelGroupBadge } from '../../components/ChannelGroupBadge';
import PublishingFilterBar, {
  PublishingFilterCell,
} from '../../components/PublishingFilterBar';
import { getPublishingFilterSummary } from '../../components/PublishingFilterBar.utils';
import { useManagedTagCollections } from '../../data/tagManagementStore';
import { getPublishingChannelFilterGroups } from '../../data/channelManagement';
import { useChannelGroup } from '../../app/providers/useChannelGroup';
import {
  flattenOptionGroups,
  getPublishingTagFilterGroups,
} from '../../data/publishingTaxonomy';
import {
  getUserFilterOptions,
  useManagedUsers,
} from '../../data/userManagement';
import './PublishingDrafts.css';

const { Text, Title } = Typography;

const DRAFT_TYPE_OPTIONS = [
  { label: 'All Post Types', value: 'all-post-types' },
  { label: 'Scheduled Drafts', value: 'scheduled-drafts' },
  { label: 'Unscheduled Drafts', value: 'unscheduled-drafts' },
  { label: 'Posts I am tagged in', value: 'tagged-in' },
  { label: 'Posts I have commented on', value: 'commented-on' },
];

const initialFilters = {
  draftTypes: [],
  channels: [],
  tags: [],
  authors: [],
};

function FilterCheckboxList({ value, onChange, options }) {
  return (
    <Checkbox.Group value={value} onChange={onChange} className="publishing-drafts-filter-list">
      {options.map((option) => (
        <Checkbox key={option.value} value={option.value}>
          {option.label}
        </Checkbox>
      ))}
    </Checkbox.Group>
  );
}

function ChannelFilterMenu({ value, onChange, channelGroups }) {
  return (
    <div className="publishing-drafts-popover">
      {channelGroups.map((group) => (
        <div key={group.label} className="publishing-drafts-filter-group">
          <Text className="publishing-drafts-group-title">{group.label}</Text>
          <Checkbox.Group value={value} onChange={onChange} className="publishing-drafts-filter-list">
            {group.options.map((option) => (
              <Checkbox key={option.value} value={option.value}>
                {option.channelGroup ? (
                  <ChannelGroupBadge group={option.channelGroup} maxWidth={220} size="sm" />
                ) : (
                  <span className="publishing-drafts-channel-option">
                    <Avatar size={22} style={{ backgroundColor: option.color }}>
                      {option.initials}
                    </Avatar>
                    <span>{option.label}</span>
                  </span>
                )}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>
      ))}
    </div>
  );
}

function TagFilterMenu({ value, onChange, tagGroups }) {
  return (
    <div className="publishing-drafts-popover publishing-drafts-popover-wide">
      <Input
        allowClear
        size="small"
        prefix={<SearchOutlined />}
        placeholder="Search tags"
        className="publishing-drafts-search"
      />
      <Checkbox className="publishing-drafts-match-all">Match all selected tags</Checkbox>
      <Divider />
      {tagGroups.map((group) => (
        <div key={group.label} className="publishing-drafts-filter-group">
          <Text className="publishing-drafts-group-title">{group.label}</Text>
          <FilterCheckboxList value={value} onChange={onChange} options={group.options} />
        </div>
      ))}
      <Button type="link" size="small" className="publishing-drafts-reset-link" onClick={() => onChange([])}>
        Reset tags
      </Button>
    </div>
  );
}

function AuthorFilterMenu({ value, onChange, options }) {
  return (
    <div className="publishing-drafts-popover">
      <Checkbox.Group value={value} onChange={onChange} className="publishing-drafts-filter-list">
        {options.map((option) => (
          <Checkbox key={option.value} value={option.value}>
            <span className="publishing-drafts-channel-option">
              <Avatar size={22} icon={<UserOutlined />}>
                {option.initials}
              </Avatar>
              <span>{option.label}</span>
            </span>
          </Checkbox>
        ))}
      </Checkbox.Group>
    </div>
  );
}

function DraftCardPreview() {
  return (
    <div className="publishing-drafts-preview" aria-hidden="true">
      <div className="publishing-drafts-preview-close">x</div>
      <div className="publishing-drafts-preview-header">
        <div className="publishing-drafts-preview-avatar" />
        <div className="publishing-drafts-preview-lines">
          <span />
          <span />
        </div>
      </div>
      <div className="publishing-drafts-preview-copy">
        <span />
        <span />
        <span />
      </div>
      <div className="publishing-drafts-preview-media">
        <FileTextOutlined />
      </div>
      <div className="publishing-drafts-preview-footer">
        <span />
        <span />
        <span className="publishing-drafts-preview-cta" />
      </div>
    </div>
  );
}

export default function PublishingDraftsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(initialFilters);
  const [tagCollections] = useManagedTagCollections();
  const [users] = useManagedUsers();
  const { activeChannelIds, channelGroups: managedChannelGroups } = useChannelGroup();
  const channelGroups = useMemo(
    () => getPublishingChannelFilterGroups({
      channelGroups: managedChannelGroups,
      visibleChannelIds: activeChannelIds,
    }),
    [activeChannelIds, managedChannelGroups],
  );
  const tagGroups = useMemo(
    () => getPublishingTagFilterGroups(tagCollections),
    [tagCollections],
  );
  const tagOptions = useMemo(() => flattenOptionGroups(tagGroups), [tagGroups]);
  const authorOptions = useMemo(
    () => getUserFilterOptions(users),
    [users],
  );

  const activeFilterCount = useMemo(
    () => Object.values(filters).reduce((total, values) => total + values.length, 0),
    [filters],
  );

  const setFilter = (key, values) => {
    setFilters((current) => ({
      ...current,
      [key]: values,
    }));
  };

  const resetFilters = () => setFilters(initialFilters);

  const filterSummaryContent = (
    <div className="publishing-drafts-summary-popover">
      <Text strong>Filters</Text>
      <Text type="secondary">
        {activeFilterCount ? `${activeFilterCount} selected` : 'All drafts are visible'}
      </Text>
    </div>
  );

  return (
    <AdminPageLayout
      title="Drafts"
      headerExtra={(
        <Popover trigger="click" placement="bottomRight" content={filterSummaryContent}>
          <Button type="primary" icon={<FilterOutlined />}>Filters</Button>
        </Popover>
      )}
      maxWidth="none"
      contentPadding="16px 24px 24px"
    >
      <div className="publishing-drafts-page">
        <PublishingFilterBar
          ariaLabel="Draft filters"
          activeCount={activeFilterCount}
          onClearAll={resetFilters}
        >
          <PublishingFilterCell
            title="Draft Types"
            summary={getPublishingFilterSummary(filters.draftTypes)}
            activeCount={filters.draftTypes.length}
          >
            <div className="publishing-drafts-popover">
              <FilterCheckboxList
                value={filters.draftTypes}
                onChange={(values) => setFilter('draftTypes', values)}
                options={DRAFT_TYPE_OPTIONS}
              />
            </div>
          </PublishingFilterCell>
          <PublishingFilterCell
            title="Channels"
            summary={getPublishingFilterSummary(filters.channels)}
            activeCount={filters.channels.length}
          >
            <ChannelFilterMenu
              value={filters.channels}
              onChange={(values) => setFilter('channels', values)}
              channelGroups={channelGroups}
            />
          </PublishingFilterCell>
          <PublishingFilterCell
            title="Tags"
            summary={getPublishingFilterSummary(filters.tags, 'Viewing all', tagOptions)}
            activeCount={filters.tags.length}
            popoverWidth={280}
          >
            <TagFilterMenu
              value={filters.tags}
              onChange={(values) => setFilter('tags', values)}
              tagGroups={tagGroups}
            />
          </PublishingFilterCell>
          <PublishingFilterCell
            title="Authors"
            summary={getPublishingFilterSummary(filters.authors, 'Viewing all', authorOptions)}
            activeCount={filters.authors.length}
          >
            <AuthorFilterMenu value={filters.authors} onChange={(values) => setFilter('authors', values)} options={authorOptions} />
          </PublishingFilterCell>
        </PublishingFilterBar>

        <section className="publishing-drafts-empty" aria-label="Drafts empty state">
          <div className="publishing-drafts-empty-copy">
            <Title level={2}>Draft now, publish later</Title>
            <Text>
              When you and your team members save drafts, you&apos;ll see them here.
            </Text>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/publishing/new-post')}
            >
              Start a draft
            </Button>
          </div>
          <DraftCardPreview />
        </section>
      </div>
    </AdminPageLayout>
  );
}
