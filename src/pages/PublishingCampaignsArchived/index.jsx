import { Button, Dropdown, Table } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AdminPageLayout from '../../components/AdminPageLayout';
import PublishingCampaignCreateMenu from '../PublishingCampaignCreateMenu';
import {
  ARCHIVED_CAMPAIGNS,
  CAMPAIGN_PLANNER_ROUTE_PREFIX,
} from '../../data/publishingCampaigns';
import '../PublishingCampaignsShared.css';

const getRowMenuItems = (campaign, navigate) => [
  {
    key: 'planner',
    label: 'Open archived planner',
    onClick: () => navigate(`${CAMPAIGN_PLANNER_ROUTE_PREFIX}/${campaign.id}`),
  },
  {
    key: 'calendar',
    label: 'View on calendar',
    onClick: () => navigate('/publishing/calendar'),
  },
  {
    key: 'approvals',
    label: 'Go to approvals',
    onClick: () => navigate('/publishing/needs-approval'),
  },
];

export default function PublishingCampaignsArchivedPage() {
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Campaign Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, campaign) => (
        <div className="publishing-campaigns-table-name">
          <span className="publishing-campaigns-card-dot" style={{ background: campaign.accent }} />
          <button
            type="button"
            className="publishing-campaigns-table-link"
            onClick={() => navigate(`${CAMPAIGN_PLANNER_ROUTE_PREFIX}/${campaign.id}`)}
          >
            {campaign.name}
          </button>
        </div>
      ),
    },
    {
      title: 'Dates',
      dataIndex: 'dateRange',
      key: 'dateRange',
      render: (value) => value || '-',
      width: 240,
    },
    {
      title: 'Sent Posts',
      dataIndex: 'sentPosts',
      key: 'sentPosts',
      width: 140,
    },
    {
      title: 'Impressions',
      dataIndex: 'impressions',
      key: 'impressions',
      width: 180,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, campaign) => (
        <Dropdown menu={{ items: getRowMenuItems(campaign, navigate) }} trigger={['click']}>
          <Button aria-label={`Actions for ${campaign.name}`} icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <AdminPageLayout
      title="Archived Campaigns"
      headerExtra={<PublishingCampaignCreateMenu />}
      maxWidth="none"
      contentPadding="16px 24px 24px"
    >
      <div className="publishing-campaigns-page">
        <div className="publishing-campaigns-table-shell">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={ARCHIVED_CAMPAIGNS}
            pagination={false}
            size="middle"
          />
        </div>
      </div>
    </AdminPageLayout>
  );
}
