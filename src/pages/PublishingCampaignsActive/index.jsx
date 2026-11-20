import { useMemo, useState } from 'react';
import { Button, Dropdown, Select, Typography } from 'antd';
import {
  CalendarOutlined,
  EllipsisOutlined,
  EyeOutlined,
  ExperimentOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AppPageToolbar from '../../app/layout/AppPageToolbar';
import AdminPageLayout from '../../components/AdminPageLayout';
import PublishingCampaignCreateMenu from '../PublishingCampaignCreateMenu';
import {
  ACTIVE_CAMPAIGN_SORT_OPTIONS,
  CAMPAIGN_PLANNER_ROUTE_PREFIX,
} from '../../data/publishingCampaigns';
import { useManagedActiveCampaigns } from '../../data/publishingCampaignStore';
import '../PublishingCampaignsShared.css';

const { Text, Title } = Typography;

const STAT_ICONS = {
  'Scheduled/Queued Posts': CalendarOutlined,
  'Posts needing approval': ExperimentOutlined,
  'Sent Posts': ExportOutlined,
  Impressions: EyeOutlined,
};

const sortCampaigns = (campaigns, sortOrder) => {
  if (sortOrder === 'name-asc') {
    return [...campaigns].sort((left, right) => left.name.localeCompare(right.name));
  }

  if (sortOrder === 'start-date-newest') {
    return [...campaigns].sort((left, right) => right.sortSequence - left.sortSequence);
  }

  return [...campaigns].sort((left, right) => left.sortSequence - right.sortSequence);
};

function CampaignCard({ campaign, navigate }) {
  const menuItems = [
    {
      key: 'planner',
      label: 'See campaign planner',
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

  return (
    <article className="publishing-campaigns-card">
      <header className="publishing-campaigns-card-header">
        <div className="publishing-campaigns-card-title">
          <span className="publishing-campaigns-card-dot" style={{ background: campaign.accent }} />
          <div>
            <Title level={4}>{campaign.name}</Title>
            {campaign.dateRange ? <Text>{campaign.dateRange}</Text> : null}
          </div>
        </div>
        <div className="publishing-campaigns-card-actions">
          <Dropdown menu={{ items: menuItems }} trigger={['click']}>
            <Button aria-label={`Campaign options for ${campaign.name}`} icon={<EllipsisOutlined />} />
          </Dropdown>
          <Button onClick={() => navigate(`${CAMPAIGN_PLANNER_ROUTE_PREFIX}/${campaign.id}`)}>
            {campaign.plannerLabel}
          </Button>
        </div>
      </header>
      <div className="publishing-campaigns-stats">
        {campaign.stats.map((stat) => {
          const Icon = STAT_ICONS[stat.label] || CalendarOutlined;

          return (
            <section key={stat.label} className="publishing-campaigns-stat">
              <Text className="publishing-campaigns-stat-label">{stat.label}</Text>
              <div className="publishing-campaigns-stat-value">
                <Icon />
                <span>{stat.value}</span>
              </div>
              {stat.path && stat.linkLabel ? (
                <Button
                  type="link"
                  className="publishing-campaigns-link"
                  onClick={() => navigate(stat.path)}
                >
                  {stat.linkLabel}
                </Button>
              ) : null}
            </section>
          );
        })}
      </div>
    </article>
  );
}

export default function PublishingCampaignsActivePage() {
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState(ACTIVE_CAMPAIGN_SORT_OPTIONS[0].value);
  const [activeCampaigns] = useManagedActiveCampaigns();
  const campaigns = useMemo(() => sortCampaigns(activeCampaigns, sortOrder), [activeCampaigns, sortOrder]);

  return (
    <AdminPageLayout
      title="Active Campaigns"
      headerExtra={<PublishingCampaignCreateMenu />}
      maxWidth="none"
      contentPadding="16px 24px 24px"
    >
      <div className="publishing-campaigns-page">
        <AppPageToolbar
          style={{ marginBottom: 0 }}
          right={(
            <label className="publishing-campaigns-order">
              <Text strong>Order by</Text>
              <Select
                value={sortOrder}
                options={ACTIVE_CAMPAIGN_SORT_OPTIONS}
                style={{ width: 200 }}
                onChange={setSortOrder}
              />
            </label>
          )}
        />

        <div className="publishing-campaigns-list">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} navigate={navigate} />
          ))}
        </div>
      </div>
    </AdminPageLayout>
  );
}
