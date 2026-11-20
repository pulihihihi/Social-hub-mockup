import { Alert, Button, Card, DatePicker, Form, Input, Select, Space, Typography, message } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, CloseOutlined, ExpandAltOutlined, TagOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AdminPageLayout from '../../components/AdminPageLayout';
import { makeLocalCampaign, useManagedActiveCampaigns } from '../../data/publishingCampaignStore';
import '../PublishingCampaignsShared.css';

const { Text, Title } = Typography;

const colorOptions = [
  { label: 'Campaign Name', value: 'campaign-name' },
  { label: 'Launch Red', value: 'launch-red' },
  { label: 'Community Blue', value: 'community-blue' },
  { label: 'Event Green', value: 'event-green' },
];

const groupOptions = [
  { label: 'All Groups', value: 'all-groups' },
  { label: 'Garena Vietnam', value: 'garena-vietnam' },
  { label: 'Publishing Ops', value: 'publishing-ops' },
  { label: 'Creator Program', value: 'creator-program' },
];

export default function PublishingCampaignCreatePage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [, setActiveCampaigns] = useManagedActiveCampaigns();

  const saveCampaign = async () => {
    const values = await form.validateFields();
    const [startDate, endDate] = values.dateRange || [];
    const dateRange = startDate
      ? (endDate ? `${startDate.format('MMM D, YYYY')} - ${endDate.format('MMM D, YYYY')}` : startDate.format('MMM D, YYYY'))
      : '';

    const accentByColor = {
      'campaign-name': '#e6f4ff',
      'launch-red': '#fff1f0',
      'community-blue': '#e7efff',
      'event-green': '#f6ffed',
    };
    const nextCampaign = makeLocalCampaign({
      accent: accentByColor[values.color] || '#e6f4ff',
      dateRange,
      name: values.name,
    });

    setActiveCampaigns((currentCampaigns) => [...currentCampaigns, nextCampaign]);
    message.success('Campaign created locally');
    navigate('/publishing/campaigns/active');
  };

  return (
    <AdminPageLayout
      title="Create new campaign"
      headerExtra={(
        <Space size={12}>
          <Text className="publishing-campaigns-esc-key">esc</Text>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            go back
          </Button>
          <Button aria-label="Close campaign creation" icon={<CloseOutlined />} onClick={() => navigate('/publishing/campaigns/archived')} />
        </Space>
      )}
      maxWidth="none"
      contentPadding="0 24px 24px"
    >
      <div className="publishing-campaigns-create-page">
        <div className="publishing-campaigns-create-actionbar">
          <Button type="primary" onClick={saveCampaign}>Save</Button>
        </div>

        <div className="publishing-campaigns-create-body">
          <Alert
            className="publishing-campaigns-create-alert"
            type="info"
            showIcon
            closable
            icon={<TagOutlined />}
            message={(
              <span>
                <Text strong>Campaigns are a tag type in Sprout</Text>
                {' '}that provide you with extra tools to plan and manage your social media campaigns. Like other tags
                in Sprout, you'll see Campaigns in your tag filters and the Tag Report.
                {' '}
                <Button type="link" className="publishing-campaigns-inline-link">
                  Learn more about Campaigns in the help center.
                </Button>
              </span>
            )}
          />

          <Card className="publishing-campaigns-create-card" title="General Information">
            <Form form={form} layout="vertical" initialValues={{ color: 'campaign-name', groups: ['all-groups'] }}>
              <div className="publishing-campaigns-create-grid">
                <Form.Item label="Campaign Name*" name="name" rules={[{ required: true, message: 'Enter a campaign name' }]}>
                  <Input placeholder="Give your campaign a name" />
                </Form.Item>
                <Form.Item label="Calendar highlight color" name="color">
                  <Select options={colorOptions} />
                </Form.Item>
              </div>

              <Form.Item label="Date Range" name="dateRange">
                <Text className="publishing-campaigns-field-help">
                  When does this campaign start, and how long does it last?
                </Text>
                <DatePicker.RangePicker
                  className="publishing-campaigns-date-range"
                  suffixIcon={<CalendarOutlined />}
                  placeholder={['Choose date range', '']}
                  allowEmpty={[false, true]}
                />
              </Form.Item>

              <Form.Item label="Group Visibility">
                <Text className="publishing-campaigns-field-help">
                  Choose all the groups where you want this campaign to be visible and selectable.
                </Text>
                <Select mode="multiple" defaultValue={['all-groups']} options={groupOptions} />
              </Form.Item>
            </Form>
          </Card>

          <Card
            className="publishing-campaigns-create-card publishing-campaigns-brief-card"
            title={(
              <div className="publishing-campaigns-brief-title">
                <div>
                  <Title level={4}>Campaign Brief</Title>
                  <Text>Provide strategic or creative direction for your team. Visible in Compose while writing posts, or on the campaign homepage.</Text>
                </div>
                <Button aria-label="Expand campaign brief" icon={<ExpandAltOutlined />} />
              </div>
            )}
          >
            <Input.TextArea
              placeholder="Start typing here"
              autoSize={{ minRows: 8, maxRows: 14 }}
            />
          </Card>
        </div>
      </div>
    </AdminPageLayout>
  );
}
