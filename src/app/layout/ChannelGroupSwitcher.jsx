import { Avatar, Badge, Button, Dropdown, Typography } from 'antd';
import {
  DownOutlined,
  FolderOpenOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ChannelGroupBadge } from '../../components/ChannelGroupBadge';
import { useChannelGroup } from '../providers/useChannelGroup';
import { CHANNEL_GROUP_MANAGEMENT_ROUTE } from '../../data/channelManagement';

const { Text } = Typography;

export const ChannelGroupSwitcher = () => {
  const navigate = useNavigate();
  const {
    activeChannelGroupId,
    channelGroups,
    setActiveChannelGroupId,
  } = useChannelGroup();

  if (!channelGroups.length) {
    return null;
  }

  const activeKey = activeChannelGroupId == null ? undefined : String(activeChannelGroupId);
  const menuItems = [
    ...channelGroups.map((group) => ({
      key: String(group.id),
      label: (
        <ChannelGroupBadge
          group={group}
          maxWidth={248}
          selected={String(group.id) === activeKey}
          size="sm"
        />
      ),
    })),
    { type: 'divider' },
    {
      key: 'manage',
      icon: <SettingOutlined />,
      label: 'Manage Channel Groups',
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === 'manage') {
      navigate(CHANNEL_GROUP_MANAGEMENT_ROUTE);
      return;
    }

    setActiveChannelGroupId(key);
  };

  return (
    <Dropdown
      trigger={['click']}
      placement="bottomLeft"
      classNames={{ root: 'social-channel-group-dropdown' }}
      menu={{
        items: menuItems,
        onClick: handleMenuClick,
        selectable: true,
        selectedKeys: activeKey ? [activeKey] : [],
      }}
    >
      <Button
        type="text"
        className="social-channel-group-trigger"
        aria-label="Open channel group selector"
        aria-haspopup="menu"
      >
        <Badge dot offset={[-2, 4]} className="social-channel-group-trigger-badge">
          <Avatar
            shape="square"
            size={30}
            icon={<FolderOpenOutlined />}
            className="social-channel-group-trigger-icon"
          />
        </Badge>
        <Text strong ellipsis className="social-channel-group-trigger-title">
          Channel Group
        </Text>
        <DownOutlined className="social-channel-group-trigger-arrow" aria-hidden="true" />
      </Button>
    </Dropdown>
  );
};
