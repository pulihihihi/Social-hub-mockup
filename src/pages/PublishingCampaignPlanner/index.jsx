import { Button, Card, Col, Descriptions, Empty, Row, Space, Tag, Typography } from 'antd';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  EyeOutlined,
  ExportOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPageLayout from '../../components/AdminPageLayout';
import { TAG_GROUP_STATUS, TAG_STATUS } from '../../data/tagGroupModel';
import { useManagedTagTaxonomy } from '../../data/tagManagementStore';
import '../PublishingCampaignsShared.css';

const { Paragraph, Text } = Typography;

const STAT_ICONS = {
  'Scheduled/Queued Posts': CalendarOutlined,
  'Posts needing approval': ExperimentOutlined,
  'Sent Posts': ExportOutlined,
  Impressions: EyeOutlined,
};

const defaultStats = (group) => [
  { label: 'Scheduled/Queued Posts', value: '-', linkLabel: 'View on calendar', path: '/publishing/calendar' },
  { label: 'Posts needing approval', value: '-', linkLabel: 'Go to approvals', path: '/publishing/needs-approval' },
  { label: 'Sent Posts', value: group.sentPosts || '0' },
  { label: 'Impressions', value: group.impressions || '0' },
];

export default function PublishingCampaignPlannerPage() {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  const [taxonomy] = useManagedTagTaxonomy();
  const tagsById = new Map(taxonomy.tags.map((tag) => [tag.id, tag]));
  const tagGroup = taxonomy.tagGroups.find((group) => group.id === campaignId) || null;

  if (!tagGroup) {
    return (
      <AdminPageLayout title="Tag Group Planner" maxWidth="none" contentPadding="16px 24px 24px">
        <Card>
          <Empty
            description="This Tag Group could not be found in the current local taxonomy."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => navigate('/settings/tag-management?tab=groups')}>
              Back to Tag Groups
            </Button>
          </Empty>
        </Card>
      </AdminPageLayout>
    );
  }

  const tagNames = (tagGroup.tagIds || [])
    .map((tagId) => tagsById.get(tagId))
    .filter(Boolean)
    .filter((tag) => tag.status !== TAG_STATUS.ARCHIVED)
    .map((tag) => tag.name);
  const stats = tagGroup.stats || defaultStats(tagGroup);
  const isArchived = tagGroup.status === TAG_GROUP_STATUS.ARCHIVED;

  return (
    <AdminPageLayout
      title={tagGroup.name}
      headerExtra={(
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/settings/tag-management?tab=groups')}>
            Back to Tag Groups
          </Button>
          <Button onClick={() => navigate('/publishing/calendar')}>View on calendar</Button>
        </Space>
      )}
      maxWidth="none"
      contentPadding="16px 24px 24px"
    >
      <div className="publishing-campaigns-planner-page">
        <Card className="publishing-campaigns-planner-hero">
          <div className="publishing-campaigns-planner-stack">
            <div className="publishing-campaigns-planner-heading">
              <div>
                <Text type="secondary">Tag Group planner preview</Text>
                <div className="publishing-campaigns-planner-title">{tagGroup.name}</div>
              </div>
              <Tag color={isArchived ? 'default' : 'blue'}>
                {isArchived ? 'Archived Tag Group' : 'Active Tag Group'}
              </Tag>
            </div>
            <Paragraph className="publishing-campaigns-planner-copy">
              This planner keeps the existing planning shortcuts while grouping content from the tags assigned to this Tag Group.
            </Paragraph>
            <Descriptions size="small" column={3} className="publishing-campaigns-planner-descriptions">
              <Descriptions.Item label="Tag Group">{tagGroup.name}</Descriptions.Item>
              <Descriptions.Item label="Window">{tagGroup.dateRange || 'Not set'}</Descriptions.Item>
              <Descriptions.Item label="Tags">{tagNames.length ? tagNames.join(', ') : 'No tags assigned'}</Descriptions.Item>
            </Descriptions>
          </div>
        </Card>

        <Row gutter={[16, 16]}>
          {stats.map((stat) => {
            const Icon = STAT_ICONS[stat.label] || CalendarOutlined;

            return (
              <Col key={stat.label} xs={24} md={12} xl={6}>
                <Card className="publishing-campaigns-planner-stat-card">
                  <Space direction="vertical" size={10}>
                    <Text type="secondary">{stat.label}</Text>
                    <div className="publishing-campaigns-stat-value">
                      <Icon />
                      <span>{stat.value}</span>
                    </div>
                    {stat.path && stat.linkLabel ? (
                      <Button type="link" className="publishing-campaigns-link" onClick={() => navigate(stat.path)}>
                        {stat.linkLabel}
                      </Button>
                    ) : null}
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>

        <Card title="Planner shortcuts">
          <div className="publishing-campaigns-planner-shortcuts">
            <Button onClick={() => navigate('/publishing/calendar')}>Calendar</Button>
            <Button onClick={() => navigate('/publishing/needs-approval')}>Approvals</Button>
            <Button onClick={() => navigate('/settings/tag-management?tab=groups')}>Manage Tag Groups</Button>
          </div>
        </Card>
      </div>
    </AdminPageLayout>
  );
}
