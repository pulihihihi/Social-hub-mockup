import { useState } from 'react';
import { Button, Dropdown, Form, Modal, Select, Space, Typography, message } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getUniqueManagedTags } from '../data/tagManagement';
import { useManagedTagCollections } from '../data/tagManagementStore';
import { makeLocalCampaign, useManagedActiveCampaigns } from '../data/publishingCampaignStore';

const { Paragraph, Text } = Typography;

export default function PublishingCampaignCreateMenu() {
  const navigate = useNavigate();
  const [isConvertOpen, setIsConvertOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [tagCollections] = useManagedTagCollections();
  const [, setActiveCampaigns] = useManagedActiveCampaigns();
  const tagOptions = getUniqueManagedTags(tagCollections).map((tag) => ({
    label: tag,
    value: tag,
  }));

  const convertTagToCampaign = () => {
    if (!selectedTag) {
      message.warning('Select a tag to convert first.');
      return;
    }

    setActiveCampaigns((currentCampaigns) => {
      if (currentCampaigns.some((campaign) => campaign.name === selectedTag)) {
        return currentCampaigns;
      }

      return [...currentCampaigns, makeLocalCampaign({ name: selectedTag })];
    });
    message.success('Campaign created from tag locally');
    setSelectedTag(null);
    setIsConvertOpen(false);
  };

  const menuItems = [
    {
      key: 'new-campaign',
      label: 'Create a brand new campaign',
      onClick: () => navigate('/publishing/campaigns/new'),
    },
    {
      key: 'convert-tag',
      label: 'Convert an existing tag to a campaign',
      onClick: () => setIsConvertOpen(true),
    },
  ];

  return (
    <>
      <Dropdown
        menu={{ items: menuItems }}
        placement="bottomRight"
        trigger={['click']}
        overlayClassName="publishing-campaigns-create-menu"
      >
        <Button type="primary" icon={<PlusOutlined />}>
          Create Campaign
        </Button>
      </Dropdown>

      <Modal
        title="Convert existing tag to Campaign tag"
        open={isConvertOpen}
        width={800}
        closeIcon={<CloseOutlined />}
        onCancel={() => setIsConvertOpen(false)}
        footer={(
          <Space>
            <Button onClick={() => setIsConvertOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={convertTagToCampaign}>
              Convert to Campaign
            </Button>
          </Space>
        )}
      >
        <Paragraph className="publishing-campaigns-convert-copy">
          You can convert tags you're using to track your campaigns into a Campaign tag. This way, you can take advantage
          of the Campaign Planner, highlighting, and more. All previously tagged posts and content automatically appear
          in the Campaign Planner after you convert.
        </Paragraph>
        <Form layout="vertical" className="publishing-campaigns-convert-form">
          <Form.Item
            label={<Text strong>Which tag do you want to convert?</Text>}
          >
            <Select
              placeholder="Select a tag"
              showSearch
              options={tagOptions}
              value={selectedTag}
              onChange={setSelectedTag}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
