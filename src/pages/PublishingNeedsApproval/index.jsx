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
  ArrowRightOutlined,
  CheckSquareOutlined,
  FilterOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import AdminPageLayout from '../../components/AdminPageLayout';
import {
  PublishingFilterBar,
  PublishingFilterCell,
} from '../../components/PublishingFilterBar';
import { getPublishingFilterSummary } from '../../components/PublishingFilterBar.utils';
import { useManagedTagCollections } from '../../data/tagManagementStore';
import {
  flattenOptionGroups,
  getPublishingTagFilterGroups,
} from '../../data/publishingTaxonomy';
import {
  getApprovalWorkflowOptions,
  useManagedApprovalWorkflows,
} from '../../data/approvalWorkflowStore';
import {
  getUserFilterOptions,
  useManagedUsers,
} from '../../data/userManagement';
import './PublishingNeedsApproval.css';

const { Text, Title } = Typography;

const APPROVAL_SCOPE_OPTIONS = [
  { label: "All of my team's approvals", value: 'team' },
  { label: 'Assigned to me', value: 'mine' },
  { label: 'Requested by me', value: 'requested-by-me' },
  { label: 'Approvals I commented on', value: 'commented' },
];

const POST_TYPE_OPTIONS = [
  { label: 'All Post Types', value: 'all' },
  { label: 'Text', value: 'text' },
  { label: 'Image', value: 'image' },
  { label: 'Video', value: 'video' },
  { label: 'Link', value: 'link' },
  { label: 'Reel', value: 'reel' },
];

const initialFilters = {
  scope: [],
  workflows: [],
  tags: [],
  authors: [],
  postTypes: [],
};

function FilterCheckboxList({ value, onChange, options }) {
  return (
    <Checkbox.Group value={value} onChange={onChange} className="publishing-approval-filter-list">
      {options.map((option) => (
        <Checkbox key={option.value} value={option.value}>
          {option.label}
        </Checkbox>
      ))}
    </Checkbox.Group>
  );
}

function TagFilterMenu({ value, onChange, tagGroups }) {
  return (
    <div className="publishing-approval-popover publishing-approval-popover-wide">
      <Input
        allowClear
        size="small"
        prefix={<SearchOutlined />}
        placeholder="Search Tags"
        className="publishing-approval-search"
      />
      <Button type="link" size="small" className="publishing-approval-reset-link" onClick={() => onChange([])}>
        Reset
      </Button>
      <Divider />
      {tagGroups.map((group) => (
        <div key={group.label} className="publishing-approval-filter-group">
          <Text className="publishing-approval-group-title">{group.label}</Text>
          <FilterCheckboxList value={value} onChange={onChange} options={group.options} />
        </div>
      ))}
      <Checkbox className="publishing-approval-match-all">Match all selected</Checkbox>
    </div>
  );
}

function AuthorFilterMenu({ value, onChange, options }) {
  return (
    <div className="publishing-approval-popover">
      <Checkbox.Group value={value} onChange={onChange} className="publishing-approval-filter-list">
        {options.map((option) => (
          <Checkbox key={option.value} value={option.value}>
            <span className="publishing-approval-author-option">
              <Avatar size={24} icon={<UserOutlined />}>
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

function ApprovalWorkflowIllustration() {
  return (
    <div className="publishing-approval-illustration" aria-hidden="true">
      <div className="publishing-approval-card publishing-approval-card-post">
        <span className="publishing-approval-card-dot" />
        <span />
        <span />
        <div className="publishing-approval-card-media">
          <CheckSquareOutlined />
        </div>
      </div>
      <div className="publishing-approval-card publishing-approval-card-steps">
        <span><CheckSquareOutlined /> 1</span>
        <span><CheckSquareOutlined /> 2</span>
        <span><CheckSquareOutlined /> 3</span>
      </div>
      <div className="publishing-approval-envelope" />
      <div className="publishing-approval-badge publishing-approval-badge-left">
        <ArrowRightOutlined />
      </div>
      <div className="publishing-approval-badge publishing-approval-badge-right">
        <SettingOutlined />
      </div>
    </div>
  );
}

export default function PublishingNeedsApprovalPage() {
  const navigate = useNavigate();
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const [tagCollections] = useManagedTagCollections();
  const [approvalWorkflows] = useManagedApprovalWorkflows();
  const [users] = useManagedUsers();
  const workflowOptions = useMemo(
    () => getApprovalWorkflowOptions(approvalWorkflows),
    [approvalWorkflows],
  );
  const authorOptions = useMemo(
    () => getUserFilterOptions(users),
    [users],
  );

  const tagGroups = useMemo(
    () => getPublishingTagFilterGroups(tagCollections),
    [tagCollections],
  );
  const tagOptions = useMemo(() => flattenOptionGroups(tagGroups), [tagGroups]);

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

  const helpContent = (
    <div className="publishing-approval-help">
      <Text strong>Approval workflows</Text>
      <Text type="secondary">
        Build a workflow to route posts to teammates before they are scheduled or published.
      </Text>
    </div>
  );

  return (
    <AdminPageLayout
      title="Needs Approval"
      headerExtra={(
        <div className="publishing-approval-header-actions">
          <Button
            type="primary"
            icon={<FilterOutlined />}
            onClick={() => setFiltersVisible((visible) => !visible)}
          >
            Filters
          </Button>
          <Button icon={<SettingOutlined />} onClick={() => navigate('/settings/approval-workflows')}>
            Manage Workflows
          </Button>
          <Popover trigger="click" placement="bottomRight" content={helpContent}>
            <Button icon={<QuestionCircleOutlined />}>Help</Button>
          </Popover>
        </div>
      )}
      maxWidth="none"
      contentPadding="16px 24px 24px"
    >
      <div className="publishing-approval-page">
        {filtersVisible ? (
          <PublishingFilterBar
            ariaLabel="Approval filters"
            activeCount={activeFilterCount}
            onClearAll={resetFilters}
          >
            <PublishingFilterCell
              title="My Approvals"
              summary={getPublishingFilterSummary(filters.scope, "All of my team's approvals")}
              activeCount={filters.scope.length}
            >
              <div className="publishing-approval-popover">
                <FilterCheckboxList
                  value={filters.scope}
                  onChange={(values) => setFilter('scope', values)}
                  options={APPROVAL_SCOPE_OPTIONS}
                />
              </div>
            </PublishingFilterCell>
            <PublishingFilterCell
              title="Workflows"
              summary={getPublishingFilterSummary(filters.workflows, 'Viewing all', workflowOptions)}
              activeCount={filters.workflows.length}
            >
              <div className="publishing-approval-popover">
                <FilterCheckboxList
                  value={filters.workflows}
                  onChange={(values) => setFilter('workflows', values)}
                  options={workflowOptions}
                />
              </div>
            </PublishingFilterCell>
            <PublishingFilterCell
              title="Tags"
              summary={getPublishingFilterSummary(filters.tags, 'Viewing all', tagOptions)}
              activeCount={filters.tags.length}
              popoverWidth={286}
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
            <PublishingFilterCell
              title="Post Types"
              summary={getPublishingFilterSummary(filters.postTypes)}
              activeCount={filters.postTypes.length}
            >
              <div className="publishing-approval-popover">
                <FilterCheckboxList
                  value={filters.postTypes}
                  onChange={(values) => setFilter('postTypes', values)}
                  options={POST_TYPE_OPTIONS}
                />
              </div>
            </PublishingFilterCell>
          </PublishingFilterBar>
        ) : null}

        <section className="publishing-approval-empty" aria-label="Approval empty state">
          <div className="publishing-approval-empty-inner publishing-approval-empty-inner-filtered">
            <ApprovalWorkflowIllustration />
            <Title level={2}>No posts need approval based on the filters you have selected.</Title>
          </div>
        </section>
      </div>

    </AdminPageLayout>
  );
}
