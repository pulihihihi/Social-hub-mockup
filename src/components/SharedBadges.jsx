import { Tag } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { T, C, S } from '../theme';
import { getPlatformConfig } from '../data/platforms';
import { getPlatformIconSize } from './platformIconContract';

export const PlatformIcon = ({
  platform,
  size = 'inline',
  className,
  style,
  ...rest
}) => {
  const config = getPlatformConfig(platform);
  const Icon = config.icon;
  const resolvedSize = getPlatformIconSize(size);

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        width: resolvedSize,
        height: resolvedSize,
        minWidth: resolvedSize,
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
        color: config.color,
        flexShrink: 0,
        ...style,
      }}
      {...rest}
    >
      {Icon ? (
        <Icon
          size={resolvedSize}
          color={config.color}
          aria-hidden="true"
          focusable="false"
        />
      ) : (
        <InfoCircleOutlined style={{ fontSize: resolvedSize, color: config.color }} />
      )}
    </span>
  );
};

export const PlatformDisplay = ({
  platform,
  iconSize = 'inline',
  label,
  textStyle,
  style,
}) => {
  const config = getPlatformConfig(platform);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        minWidth: 0,
        color: T.colorTextBase,
        ...style,
      }}
    >
      <PlatformIcon platform={platform} size={iconSize} />
      <span
        style={{
          fontSize: T.fontSizeSM,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          ...textStyle,
        }}
      >
        {label || config.label}
      </span>
    </span>
  );
};

// Unified PlatformTag used by Channels and anywhere platform is shown.
export const PlatformTag = ({ platform }) => (
  <PlatformDisplay platform={platform} />
);

export const ChannelModeBadge = ({ mode }) => {
  const map = {
    API: { label: "API", color: "blue" },
  };
  const resolved = map[mode] || map.API;
  return <Tag color={resolved.color}>{resolved.label}</Tag>;
};

export const ChannelHealthBadge = ({ health }) => {
  const map = {
    CONNECTED: { label: "Connected", color: "success" },
    DISCONNECTED: { label: "Disconnected", color: "warning" },
  };
  const resolved = map[health] || map.DISCONNECTED;
  return <Tag color={resolved.color}>{resolved.label}</Tag>;
};

export const ChannelApiStatusBadge = ({ status }) => {
  const map = {
    CONNECTED: { label: "API connected", color: "success" },
    DISCONNECTED: { label: "API Disconnected", color: "warning" },
  };
  const resolved = map[status] || map.DISCONNECTED;
  if (status === "CONNECTED") {
    return (
      <Tag
        style={{ background: "transparent", border: "none", color: T.colorTextBase, marginInlineEnd: 0 }}
      >
        {resolved.label}
      </Tag>
    );
  }
  return <Tag color={resolved.color}>{resolved.label}</Tag>;
};

// Unified role badge for Users page.
export const RoleBadge = ({ role }) => {
  const map = {
    ADMIN: { color: T.colorError },
    MEMBER: { color: T.colorPrimary },
    VIEWER: { color: C.custom },
  };
  const c = map[role] || map.MEMBER;
  return <Tag color={c.color}>{role}</Tag>;
};

// Marketplace source badge used in AI Skill surfaces.
export const MarketplaceTag = ({ show }) => {
  if (!show) return null;
  return <Tag color="blue" style={S.mpTag}>MP</Tag>;
};
