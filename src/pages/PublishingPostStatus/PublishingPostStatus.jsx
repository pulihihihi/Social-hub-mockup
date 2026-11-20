import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Button,
  Checkbox,
  Input,
  Popover,
  Select,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  FacebookFilled,
  FilterOutlined,
  InstagramOutlined,
  LinkedinFilled,
  MessageOutlined,
  PaperClipOutlined,
  SearchOutlined,
  TagOutlined,
  WarningFilled,
  YoutubeFilled,
} from '@ant-design/icons';
import AdminPageLayout from '../../components/AdminPageLayout';
import { ChannelGroupBadge } from '../../components/ChannelGroupBadge';
import {
  PublishingFilterBar,
  PublishingFilterCell,
} from '../../components/PublishingFilterBar';
import { getPublishingFilterSummary } from '../../components/PublishingFilterBar.utils';
import { useManagedTagCollections } from '../../data/tagManagementStore';
import {
  filterItemsByChannelIds,
  getPublishingChannelFilterGroups,
  getPublishingChannelFilterOptions,
} from '../../data/channelManagement';
import { useChannelGroup } from '../../app/providers/useChannelGroup';
import {
  flattenOptionGroups,
  getPublishingTagFilterGroups,
} from '../../data/publishingTaxonomy';
import {
  DELETED_POSTS,
  DELETED_SORT_OPTIONS,
  FAILED_POSTS,
  FAILED_SORT_OPTIONS,
  initialFilters,
} from './publishingPostStatusData';
import './PublishingPostStatus.css';

const { Link, Text, Title } = Typography;

function NetworkIcon({ network }) {
  const iconByNetwork = {
    facebook: <FacebookFilled />,
    instagram: <InstagramOutlined />,
    linkedin: <LinkedinFilled />,
    youtube: <YoutubeFilled />,
  };

  return (
    <span className={`publishing-status-network publishing-status-network-${network}`} aria-hidden="true">
      {iconByNetwork[network] ?? <PaperClipOutlined />}
    </span>
  );
}

function ChannelFilterMenu({ value, onChange, channelGroups }) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const visibleGroups = channelGroups.map((group) => ({
    ...group,
    options: normalizedQuery
      ? group.options.filter((option) => option.label.toLowerCase().includes(normalizedQuery))
      : group.options,
  })).filter((group) => !normalizedQuery || group.label.toLowerCase().includes(normalizedQuery) || group.options.length);

  return (
    <div className="publishing-status-popover">
      <Text strong className="publishing-status-popover-title">Channels</Text>
      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder="Search Channels"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="publishing-status-channel-search"
      />
      <Checkbox.Group value={value} onChange={onChange} className="publishing-status-channel-checks">
        {visibleGroups.map((group) => (
          <div key={group.label} className="publishing-status-filter-group">
            <Checkbox value={group.value} className="publishing-status-group-checkbox">
              {group.label}
            </Checkbox>
            <div className="publishing-status-filter-list">
              {group.options.map((option) => (
                <Checkbox key={option.value} value={option.value}>
                  {option.channelGroup ? (
                    <ChannelGroupBadge group={option.channelGroup} maxWidth={220} size="sm" />
                  ) : (
                    <span className="publishing-status-channel-option">
                      <Avatar size={22} style={{ backgroundColor: option.color }}>
                        {option.initials}
                      </Avatar>
                      <span>{option.label}</span>
                    </span>
                  )}
                </Checkbox>
              ))}
            </div>
          </div>
        ))}
      </Checkbox.Group>
    </div>
  );
}

function TagFilterMenu({ tagGroups, value, onChange }) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const visibleGroups = tagGroups
    .map((group) => ({
      ...group,
      options: normalizedQuery
        ? group.options.filter((option) => option.label.toLowerCase().includes(normalizedQuery))
        : group.options,
    }))
    .filter((group) => !normalizedQuery || group.label.toLowerCase().includes(normalizedQuery) || group.options.length);

  return (
    <div className="publishing-status-popover">
      <div className="publishing-status-popover-head">
        <Text strong className="publishing-status-popover-title">Tags</Text>
        <Button type="link" size="small" disabled={!value.length} onClick={() => onChange([])}>
          Reset
        </Button>
      </div>
      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder="Search Tags"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="publishing-status-channel-search"
      />
      <Checkbox.Group value={value} onChange={onChange} className="publishing-status-channel-checks">
        {visibleGroups.map((group) => (
          <div key={group.label} className="publishing-status-filter-group">
            <Text type="secondary" className="publishing-status-tag-group-label">{group.label}</Text>
            <div className="publishing-status-filter-list">
              {group.options.map((option) => (
                <Checkbox key={option.value} value={option.value}>
                  {option.label}
                </Checkbox>
              ))}
            </div>
          </div>
        ))}
      </Checkbox.Group>
    </div>
  );
}

function StatusFilterBar({
  filtersVisible,
  filters,
  setFilter,
  resetFilters,
  ariaLabel,
  channelGroups,
  channelOptions,
  tagGroups,
  tagOptions,
}) {
  if (!filtersVisible) {
    return null;
  }

  return (
    <PublishingFilterBar
      ariaLabel={ariaLabel}
      activeCount={filters.channels.length + filters.tags.length}
      onClearAll={resetFilters}
      showClearAll
      className="publishing-status-filterbar"
    >
      <PublishingFilterCell
        title="Channels"
        summary={getPublishingFilterSummary(filters.channels, 'Viewing all', channelOptions)}
        activeCount={filters.channels.length}
        popoverWidth={360}
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
        popoverWidth={360}
      >
        <TagFilterMenu tagGroups={tagGroups} value={filters.tags} onChange={(values) => setFilter('tags', values)} />
      </PublishingFilterCell>
    </PublishingFilterBar>
  );
}

function StatusSortToolbar({ label = 'Sort by', value, options, onChange }) {
  return (
    <div className="publishing-status-stream-toolbar">
      <Text className="publishing-status-sort-label">{label}</Text>
      <Select
        value={value}
        options={options}
        onChange={onChange}
        className="publishing-status-sort"
        aria-label={label}
      />
    </div>
  );
}

function StatusNotice({ children }) {
  return (
    <Alert
      showIcon
      type="info"
      className="publishing-status-notice"
      title={<div className="publishing-status-notice-copy">{children}</div>}
    />
  );
}

function StreamEmptyState({ title }) {
  return (
    <div className="publishing-status-empty">
      <WarningFilled />
      <Title level={2}>{title}</Title>
    </div>
  );
}

function FailedPostCard({ post }) {
  const [detailsVisible, setDetailsVisible] = useState(false);

  return (
    <article className="publishing-status-card publishing-status-card-failed">
      <header className="publishing-status-card-header">
        <Avatar size={42} className="publishing-status-account-avatar">
          {post.account.slice(0, 1)}
        </Avatar>
        <div className="publishing-status-card-title">
          <div className="publishing-status-account-line">
            <NetworkIcon network={post.network} />
            <Text strong>{post.account}</Text>
            <Text type="secondary">{post.handle}</Text>
          </div>
          <Text type="secondary" className={post.channelState ? 'publishing-status-card-subtitle has-warning' : 'publishing-status-card-subtitle'}>
            {post.channelState ? <WarningFilled /> : null}
            {post.channelState ? `${post.channelState} - ${post.status}` : post.status}
          </Text>
        </div>
        <Text type="secondary" className="publishing-status-card-time">{post.timestamp}</Text>
      </header>

      <div className="publishing-status-card-body">
        <Text>{post.body}</Text>
        <div className="publishing-status-media publishing-status-media-failed" aria-hidden="true">
          <div className="publishing-status-media-mark">SOCIAL</div>
          <div className="publishing-status-media-lines">
            <span />
            <span />
            <span />
          </div>
        </div>
        <Text type="secondary" className="publishing-status-byline">
          <Avatar size={20}>{post.authorInitials}</Avatar>
          by {post.author}
        </Text>
        {post.tags?.length ? (
          <div className="publishing-status-selected-tags">
            {post.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </div>
        ) : null}
      </div>

      <div className="publishing-status-card-actions">
        <Tooltip title="Dismiss">
          <Button type="text" icon={<DeleteOutlined />} aria-label="Dismiss failed post" />
        </Tooltip>
        <Tooltip title="Edit and resend">
          <Button type="text" icon={<EditOutlined />} aria-label="Edit and resend failed post" />
        </Tooltip>
      </div>

      <footer className="publishing-status-error">
        <div className="publishing-status-error-line">
          <WarningFilled />
          <Text strong>{post.issue}</Text>
          <Button type="link" onClick={() => setDetailsVisible((visible) => !visible)}>
            {detailsVisible ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>
        {detailsVisible ? (
          <Text type="secondary" className="publishing-status-error-details">
            {post.details}
          </Text>
        ) : null}
      </footer>
    </article>
  );
}

function PostTagAction({ post, tagGroups }) {
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState(post.tags || []);

  return (
    <Popover
      trigger="click"
      placement="bottomRight"
      overlayClassName="publishing-filterbar-overlay"
      content={(
        <div className="publishing-status-tag-popover">
          <div className="publishing-status-popover-head">
            <Text strong>Tags</Text>
            <Button type="link" size="small" disabled={!selectedTags.length} onClick={() => setSelectedTags([])}>
              Clear
            </Button>
          </div>
          <Checkbox.Group value={selectedTags} onChange={setSelectedTags} className="publishing-status-channel-checks">
            {tagGroups.map((group) => (
              <div key={group.label} className="publishing-status-filter-group">
                <Text type="secondary" className="publishing-status-tag-group-label">{group.label}</Text>
                <div className="publishing-status-filter-list">
                  {group.options.map((option) => (
                    <Checkbox key={option.value} value={option.value}>
                      {option.label}
                    </Checkbox>
                  ))}
                </div>
              </div>
            ))}
          </Checkbox.Group>
          <div className="publishing-status-selected-tags">
            {selectedTags.length ? selectedTags.map((tag) => <Tag key={tag}>{tag}</Tag>) : <Text type="secondary">No tags applied</Text>}
          </div>
          <Button type="link" className="publishing-status-manage-tags" onClick={() => navigate('/settings/tag-management')}>
            Manage tags
          </Button>
        </div>
      )}
    >
      <Button type="text" icon={<TagOutlined />} aria-label="Tags" />
    </Popover>
  );
}

function DeletedPostCard({ post, compact = false, tagGroups }) {
  return (
    <article className={compact ? 'publishing-status-card publishing-status-card-deleted is-compact' : 'publishing-status-card publishing-status-card-deleted'}>
      <header className="publishing-status-card-header publishing-status-card-header-deleted">
        <Avatar size={42} className="publishing-status-account-avatar">
          {post.account.slice(0, 1)}
        </Avatar>
        <div className="publishing-status-card-title">
          <div className="publishing-status-account-line">
            <NetworkIcon network={post.network} />
            <Text strong>{post.account}</Text>
            <Text type="secondary">{post.handle}</Text>
          </div>
          <Text className="publishing-status-deleted-meta">
            {post.status} - {post.deletedAt}
          </Text>
        </div>
      </header>

      <div className="publishing-status-card-body">
        <Text>{post.body}</Text>
        {!compact ? (
          <div className={`publishing-status-media publishing-status-media-deleted publishing-status-media-${post.tone}`} aria-hidden="true">
            <div className="publishing-status-photo-grid">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        ) : null}
        <div className="publishing-status-card-bottom">
          <Text type="secondary" className="publishing-status-byline">
            <Avatar size={20}>{post.authorInitials}</Avatar>
            by {post.author}
          </Text>
          <div className="publishing-status-inline-actions">
            <Tooltip title="Tags">
              <PostTagAction post={post} tagGroups={tagGroups} />
            </Tooltip>
            <Tooltip title="Comments">
              <Button type="text" icon={<MessageOutlined />} aria-label="Comments" />
            </Tooltip>
            <Tooltip title="Activity">
              <Button type="text" icon={<ClockCircleOutlined />} aria-label="Activity" />
            </Tooltip>
            <Tooltip title="Edit">
              <Button type="text" icon={<EditOutlined />} aria-label="Edit deleted post" />
            </Tooltip>
          </div>
        </div>
      </div>
    </article>
  );
}

function useStatusFilters(posts) {
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [filters, setFilters] = useState(initialFilters);

  const visiblePosts = useMemo(() => {
    if (!filters.channels.length && !filters.tags.length) {
      return posts;
    }

    return posts.filter((post) => {
      if (filters.channels.length) {
        const matchesChannel = filters.channels.includes(post.channelValue) ||
          filters.channels.includes('group-channel-groups') ||
          filters.channels.includes(`group-${post.network}`);

        if (!matchesChannel) {
          return false;
        }
      }

      if (filters.tags.length) {
        const postTags = post.tags || [];
        const selectedTags = filters.tags.filter((tag) => tag !== '__no_tags_applied__');
        const matchesSelectedTag = selectedTags.some((tag) => postTags.includes(tag));
        const matchesNoTags = filters.tags.includes('__no_tags_applied__') && !postTags.length;

        if (!matchesSelectedTag && !matchesNoTags) {
          return false;
        }
      }

      return true;
    });
  }, [filters.channels, filters.tags, posts]);

  const setFilter = (key, values) => {
    setFilters((current) => ({
      ...current,
      [key]: values,
    }));
  };

  return {
    filters,
    filtersVisible,
    resetFilters: () => setFilters(initialFilters),
    setFilter,
    setFiltersVisible,
    visiblePosts,
  };
}

export function PublishingFailedPostsPage() {
  const [sortValue, setSortValue] = useState('last-modified-newest');
  const [tagCollections] = useManagedTagCollections();
  const { activeChannelIds, channelGroups: managedChannelGroups } = useChannelGroup();
  const scopedPosts = useMemo(
    () => filterItemsByChannelIds(FAILED_POSTS, activeChannelIds),
    [activeChannelIds],
  );
  const tagGroups = useMemo(
    () => getPublishingTagFilterGroups(tagCollections, { includeNoTagsApplied: true }),
    [tagCollections],
  );
  const tagOptions = useMemo(() => flattenOptionGroups(tagGroups), [tagGroups]);
  const channelGroups = useMemo(
    () => getPublishingChannelFilterGroups({
      channelGroups: managedChannelGroups,
      visibleChannelIds: activeChannelIds,
    }),
    [activeChannelIds, managedChannelGroups],
  );
  const channelOptions = useMemo(
    () => getPublishingChannelFilterOptions({
      channelGroups: managedChannelGroups,
      visibleChannelIds: activeChannelIds,
    }),
    [activeChannelIds, managedChannelGroups],
  );
  const {
    filters,
    filtersVisible,
    resetFilters,
    setFilter,
    setFiltersVisible,
    visiblePosts,
  } = useStatusFilters(scopedPosts);

  return (
    <AdminPageLayout
      title="Failed Posts"
      headerExtra={(
        <Button
          type="primary"
          icon={<FilterOutlined />}
          className="publishing-status-filter-button"
          onClick={() => setFiltersVisible((visible) => !visible)}
        >
          Filters
        </Button>
      )}
      maxWidth="none"
      contentPadding="16px 24px 24px"
    >
      <div className="publishing-status-page">
        <StatusFilterBar
          filtersVisible={filtersVisible}
          filters={filters}
          setFilter={setFilter}
          resetFilters={resetFilters}
          ariaLabel="Failed post filters"
          channelGroups={channelGroups}
          channelOptions={channelOptions}
          tagGroups={tagGroups}
          tagOptions={tagOptions}
        />

        <StatusSortToolbar
          value={sortValue}
          options={FAILED_SORT_OPTIONS}
          onChange={setSortValue}
        />

        <StatusNotice>
          Due to a Meta issue that started on May 1 around 9:00 pm CT, we're seeing an increase in Instagram and Threads video failures.
          {' '}
          If you received a failure notification, please attempt to post again. We apologize for any inconvenience.
        </StatusNotice>

        <section className="publishing-status-stream" aria-label="Failed posts stream">
          {visiblePosts.length ? (
            visiblePosts.map((post) => <FailedPostCard key={post.id} post={post} />)
          ) : (
            <StreamEmptyState title="No failed posts based on the filters you have selected." />
          )}
        </section>
      </div>
    </AdminPageLayout>
  );
}

export function PublishingDeletedPostsPage() {
  const [sortValue, setSortValue] = useState('deleted-most-recent');
  const [tagCollections] = useManagedTagCollections();
  const { activeChannelIds, channelGroups: managedChannelGroups } = useChannelGroup();
  const scopedPosts = useMemo(
    () => filterItemsByChannelIds(DELETED_POSTS, activeChannelIds),
    [activeChannelIds],
  );
  const tagGroups = useMemo(
    () => getPublishingTagFilterGroups(tagCollections, { includeNoTagsApplied: true }),
    [tagCollections],
  );
  const tagOptions = useMemo(() => flattenOptionGroups(tagGroups), [tagGroups]);
  const channelGroups = useMemo(
    () => getPublishingChannelFilterGroups({
      channelGroups: managedChannelGroups,
      visibleChannelIds: activeChannelIds,
    }),
    [activeChannelIds, managedChannelGroups],
  );
  const channelOptions = useMemo(
    () => getPublishingChannelFilterOptions({
      channelGroups: managedChannelGroups,
      visibleChannelIds: activeChannelIds,
    }),
    [activeChannelIds, managedChannelGroups],
  );
  const {
    filters,
    filtersVisible,
    resetFilters,
    setFilter,
    setFiltersVisible,
    visiblePosts,
  } = useStatusFilters(scopedPosts);

  return (
    <AdminPageLayout
      title="Recently Deleted Posts"
      headerMeta={<Text type="secondary" className="publishing-status-header-meta">Posts are saved here for 30 days after deletion</Text>}
      headerExtra={(
        <Button
          type="primary"
          icon={<FilterOutlined />}
          className="publishing-status-filter-button"
          onClick={() => setFiltersVisible((visible) => !visible)}
        >
          Filters
        </Button>
      )}
      maxWidth="none"
      contentPadding="16px 24px 24px"
    >
      <div className="publishing-status-page">
        <StatusFilterBar
          filtersVisible={filtersVisible}
          filters={filters}
          setFilter={setFilter}
          resetFilters={resetFilters}
          ariaLabel="Deleted post filters"
          channelGroups={channelGroups}
          channelOptions={channelOptions}
          tagGroups={tagGroups}
          tagOptions={tagOptions}
        />

        <StatusSortToolbar
          value={sortValue}
          options={DELETED_SORT_OPTIONS}
          onChange={setSortValue}
        />

        <StatusNotice>
          Looking for deleted Sent Posts? Deleted posts that were published to a social network can be re-published from the Inbox or the Post Performance Report.
          {' '}
          <Link href="https://support.sproutsocial.com/hc/en-us/articles/15799278111629" target="_blank" rel="noreferrer">
            Learn more in the help center
          </Link>
          {' '}
          <ExportOutlined aria-hidden="true" />
        </StatusNotice>

        <section className="publishing-status-stream publishing-status-stream-deleted" aria-label="Deleted posts stream">
          {visiblePosts.length ? (
            visiblePosts.map((post, index) => (
              <DeletedPostCard key={post.id} post={post} compact={index > 0} tagGroups={tagGroups} />
            ))
          ) : (
            <StreamEmptyState title="No deleted posts based on the filters you have selected." />
          )}
        </section>

        <div className="publishing-status-end-marker">
          <Text>You&apos;ve reached the end</Text>
        </div>
      </div>
    </AdminPageLayout>
  );
}
