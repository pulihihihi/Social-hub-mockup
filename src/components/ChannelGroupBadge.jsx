import { FolderOpenOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import {
  getChannelGroupColorLabel,
  getChannelGroupColorMeta,
} from '../data/channelManagement';
import { T } from '../theme';

const SIZE_STYLES = {
  sm: {
    borderRadius: 8,
    gap: 6,
    iconSize: 12,
    maxWidth: 220,
    minHeight: 30,
    padding: '4px 10px',
    textSize: T.fontSizeSM,
  },
  md: {
    borderRadius: 10,
    gap: 8,
    iconSize: 13,
    maxWidth: 260,
    minHeight: 36,
    padding: '6px 12px',
    textSize: T.fontSize,
  },
};

const resolveGroupInput = ({ color, group, name }) => ({
  color: group?.color || color,
  name: group?.name || name || '',
});

export const ChannelGroupBadge = ({
  color,
  group,
  maxWidth,
  name,
  selected = false,
  size = 'sm',
  style,
}) => {
  const { color: resolvedColor, name: resolvedName } = resolveGroupInput({ color, group, name });
  const palette = getChannelGroupColorMeta(resolvedColor, resolvedName);
  const resolvedSize = SIZE_STYLES[size] || SIZE_STYLES.sm;
  const borderColor = selected ? palette.selectedBorder : palette.border;
  const background = selected ? palette.selectedBg : palette.bg;
  const textColor = selected ? palette.selectedText : palette.text;

  return (
    <span
      title={resolvedName}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: resolvedSize.gap,
        maxWidth: maxWidth || resolvedSize.maxWidth,
        minHeight: resolvedSize.minHeight,
        padding: resolvedSize.padding,
        borderRadius: resolvedSize.borderRadius,
        border: `1px solid ${borderColor}`,
        background,
        color: textColor,
        lineHeight: 1.2,
        ...style,
      }}
    >
      <FolderOpenOutlined
        style={{
          color: textColor,
          flex: '0 0 auto',
          fontSize: resolvedSize.iconSize,
        }}
      />
      <span
        style={{
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: resolvedSize.textSize,
          fontWeight: T.fontWeightStrong,
        }}
      >
        {resolvedName}
      </span>
    </span>
  );
};

export const ChannelGroupBadgeList = ({
  groups = [],
  maxWidth,
  size = 'sm',
}) => {
  if (!groups.length) {
    return <span style={{ fontSize: T.fontSizeSM, color: T.colorTextTertiary }}>-</span>;
  }

  return (
    <Space size={[6, 6]} wrap>
      {groups.map((group) => (
        <ChannelGroupBadge
          key={group.id || `${group.name}-${group.color}`}
          group={group}
          maxWidth={maxWidth}
          size={size}
        />
      ))}
    </Space>
  );
};

export const ChannelGroupColorChip = ({
  color,
  groupName,
}) => {
  const palette = getChannelGroupColorMeta(color, groupName);
  const colorLabel = getChannelGroupColorLabel(color, groupName);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        minWidth: 0,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          background: palette.solid,
          flex: '0 0 auto',
          boxShadow: `0 0 0 2px ${palette.bg}`,
        }}
      />
      <span
        style={{
          fontSize: T.fontSizeSM,
          color: T.colorTextBase,
          whiteSpace: 'nowrap',
        }}
      >
        {colorLabel}
      </span>
    </span>
  );
};
