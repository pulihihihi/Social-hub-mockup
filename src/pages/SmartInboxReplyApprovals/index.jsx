import { useState } from 'react';
import {
  Avatar,
  Button,
  Checkbox,
  Select,
  Tooltip,
  Typography,
} from 'antd';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  FilterOutlined,
  MoreOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import AdminPageLayout from '../../components/AdminPageLayout';
import {
  PublishingFilterBar,
  PublishingFilterCell,
} from '../../components/PublishingFilterBar';
import {
  getUserFilterOptions,
  useManagedUsers,
} from '../../data/userManagement';
import '../SmartInboxAllMessages/SmartInboxAllMessages.css';

const { Text, Title } = Typography;

function ApprovalStatusContent() {
  return (
    <div className="smart-inbox-popover is-compact">
      <div className="smart-inbox-popover-header">
        <Text strong>Approval Status</Text>
        <Button type="link">Clear</Button>
      </div>
      <div className="smart-inbox-approval-list">
        <Checkbox defaultChecked>Pending</Checkbox>
        <Checkbox>Approved</Checkbox>
        <Checkbox>Rejected</Checkbox>
      </div>
    </div>
  );
}

function TeamMemberFilterContent({ title, allLabel, members }) {
  return (
    <div className="smart-inbox-popover is-team">
      <div className="smart-inbox-popover-header">
        <Text strong>{title}</Text>
      </div>
      <div className="smart-inbox-approval-list">
        <Checkbox>{allLabel}</Checkbox>
        {members.map((member) => (
          <Checkbox key={member.value}>
            <span className="smart-inbox-team-option">
              <Avatar size={18} className="smart-inbox-team-avatar">{member.initials}</Avatar>
              {member.label}
            </span>
          </Checkbox>
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
      <Button icon={<CalendarOutlined />}>Previous 90 days</Button>
      <Tooltip title="More actions">
        <Button icon={<MoreOutlined />} aria-label="More reply approval actions" />
      </Tooltip>
    </div>
  );
}

function FilterBar({ visible, members }) {
  if (!visible) {
    return null;
  }

  return (
    <PublishingFilterBar ariaLabel="Reply Approvals filters" className="smart-inbox-global-filterbar">
      <PublishingFilterCell title="Approval Status" summary="Viewing Pending" popoverWidth={360}>
        <ApprovalStatusContent />
      </PublishingFilterCell>
      <PublishingFilterCell title="Authors" summary="None selected" popoverWidth={360}>
        <TeamMemberFilterContent title="Authors" allLabel="All Authors" members={members} />
      </PublishingFilterCell>
      <PublishingFilterCell title="Approvers" summary="None selected" popoverWidth={360}>
        <TeamMemberFilterContent title="Approvers" allLabel="All Approvers" members={members} />
      </PublishingFilterCell>
    </PublishingFilterBar>
  );
}

function ReplyApprovalsEmptyState() {
  return (
    <section className="smart-inbox-empty is-reply" aria-label="Reply approvals empty state">
      <div className="smart-inbox-reply-empty-art" aria-hidden="true">
        <div className="smart-inbox-mailbox">
          <span />
          <i />
        </div>
        <span className="smart-inbox-empty-plus">+</span>
        <span className="smart-inbox-empty-search"><SearchOutlined /></span>
        <span className="smart-inbox-empty-check"><CheckCircleOutlined /></span>
      </div>
      <Title level={2}>No replies found</Title>
      <Text>
        It doesn't look like there are any replies that match the filters you've selected.
      </Text>
      <Text type="secondary">
        You can turn on all filters to view any messages you may have missed.
      </Text>
    </section>
  );
}

export default function SmartInboxReplyApprovalsPage() {
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [sortValue, setSortValue] = useState('newest');
  const [users] = useManagedUsers();
  const members = getUserFilterOptions(users);

  return (
    <AdminPageLayout
      title="Reply Approvals"
      headerExtra={<HeaderControls setFiltersVisible={setFiltersVisible} />}
      maxWidth="none"
      contentPadding="0 24px 24px"
    >
      <div className="smart-inbox-page">
        <FilterBar visible={filtersVisible} members={members} />
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
        <ReplyApprovalsEmptyState />
      </div>
    </AdminPageLayout>
  );
}
