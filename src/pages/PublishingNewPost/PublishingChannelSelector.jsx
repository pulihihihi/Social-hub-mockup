import { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Button,
  Checkbox,
  Popover,
  Tag,
  Typography,
} from 'antd';
import {
  CloseOutlined,
  DownOutlined,
  ExclamationCircleFilled,
  ExclamationCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ChannelGroupBadge } from '../../components/ChannelGroupBadge';
import { PlatformIcon } from '../../components/SharedBadges';
import {
  CHANNEL_GROUP_MANAGEMENT_ROUTE,
  CHANNEL_MANAGEMENT_ROUTE,
  CHANNEL_TERMINOLOGY,
  formatChannelCount,
} from '../../data/channelManagement';
import {
  CHANNEL_GROUPS,
  CHANNELS,
  DISCONNECTED_ACCOUNT_TOOLTIP,
  DISCONNECTED_CHANNELS_TOOLTIP,
  NETWORKS,
} from './publishingComposerConfig';
import { getPlatformMeta } from './publishingComposerUtils';
import { TooltipContent } from './PublishingTooltip';

const { Text } = Typography;

const ChannelChip = ({ channel, onRemove }) => {
  const network = getPlatformMeta(channel.platform);
  const chip = (
    <Tag
      className={[
        'publishing-new-post-channel-chip',
        channel.disabled ? 'is-error' : '',
      ].filter(Boolean).join(' ')}
      closeIcon={<CloseOutlined aria-label={`Remove ${channel.name}`} />}
      onClose={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onRemove(channel.id);
      }}
    >
      {channel.disabled ? (
        <span className="publishing-new-post-chip-warning" aria-hidden="true">
          <ExclamationCircleFilled />
        </span>
      ) : null}
      <span className="publishing-new-post-chip-icon">
        <PlatformIcon platform={network.key} size="chip" />
      </span>
      <span className="publishing-new-post-chip-text">{channel.name}</span>
    </Tag>
  );

  return channel.disabled ? (
    <TooltipContent title={DISCONNECTED_ACCOUNT_TOOLTIP}>{chip}</TooltipContent>
  ) : chip;
};

export const ChannelSelector = ({
  selectedChannelIds,
  onChange,
  channels = CHANNELS,
  channelGroups = CHANNEL_GROUPS,
}) => {
  const navigate = useNavigate();
  const triggerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [triggerWidth, setTriggerWidth] = useState(null);
  const visibleChannelIdSet = new Set(channels.map((channel) => channel.id));
  const visibleSelectedChannelIds = selectedChannelIds.filter((channelId) => (
    visibleChannelIdSet.has(channelId)
  ));
  const selectedChannels = channels.filter((channel) => visibleSelectedChannelIds.includes(channel.id));
  const visibleChannelGroups = channelGroups
    .map((channelGroup) => ({
      ...channelGroup,
      channelIds: (channelGroup.channelIds || []).filter((channelId) => visibleChannelIdSet.has(channelId)),
    }))
    .filter((channelGroup) => channelGroup.channelIds.length);
  const selectedDisconnectedChannels = selectedChannels.filter((channel) => channel.disabled);
  const selectedConnectedChannels = selectedChannels.filter((channel) => !channel.disabled);
  const visibleDisconnectedChannels = [...selectedDisconnectedChannels].sort((left, right) => {
    const getPriority = (channel) => {
      if (channel.id === 'ig-delta') return 0;
      if (channel.id === 'ig-warrior') return 1;
      if (channel.platform === 'instagram') return 2;
      return 3;
    };

    return getPriority(left) - getPriority(right);
  });
  const visibleChannels = selectedDisconnectedChannels.length && selectedChannels.length > 3
    ? [selectedConnectedChannels[0], ...visibleDisconnectedChannels].filter(Boolean).slice(0, 3)
    : selectedChannels.slice(0, 3);
  const hiddenCount = Math.max(selectedChannels.length - visibleChannels.length, 0);
  const hasSelectedIssue = selectedDisconnectedChannels.length > 0;
  const selectedChannelIdSet = new Set(visibleSelectedChannelIds);

  const updateTriggerWidth = () => {
    const width = triggerRef.current?.getBoundingClientRect().width;

    if (width) {
      setTriggerWidth(Math.round(width));
    }
  };

  useEffect(() => {
    updateTriggerWidth();

    if (typeof window === 'undefined') return undefined;

    const node = triggerRef.current;
    const resizeObserver = typeof ResizeObserver !== 'undefined' && node
      ? new ResizeObserver(updateTriggerWidth)
      : null;

    if (node) {
      resizeObserver?.observe(node);
    }

    window.addEventListener('resize', updateTriggerWidth);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateTriggerWidth);
    };
  }, []);

  const toggleChannel = (channelId) => {
    onChange(
      selectedChannelIdSet.has(channelId)
        ? visibleSelectedChannelIds.filter((id) => id !== channelId)
        : [...visibleSelectedChannelIds, channelId],
    );
  };
  const toggleChannelSet = (channelIds) => {
    const enabledChannelIds = channelIds.filter((channelId) => (
      !channels.find((channel) => channel.id === channelId)?.disabled
    ));
    const hasEveryEnabledChannel = enabledChannelIds.every((channelId) => selectedChannelIdSet.has(channelId));

    onChange(
      hasEveryEnabledChannel
        ? visibleSelectedChannelIds.filter((channelId) => !channelIds.includes(channelId))
        : Array.from(new Set([...visibleSelectedChannelIds, ...enabledChannelIds])),
    );
  };
  const toggleChannelGroup = (channelGroup) => {
    const enabledChannelIds = channelGroup.channelIds.filter((channelId) => (
      !channels.find((channel) => channel.id === channelId)?.disabled
    ));
    const hasEveryEnabledChannel = enabledChannelIds.every((channelId) => selectedChannelIdSet.has(channelId));

    onChange(
      hasEveryEnabledChannel
        ? visibleSelectedChannelIds.filter((channelId) => !channelGroup.channelIds.includes(channelId))
        : Array.from(new Set([...visibleSelectedChannelIds, ...enabledChannelIds])),
    );
  };

  const selectorContent = (
    <div
      key={visibleSelectedChannelIds.join('|') || 'none'}
      className="publishing-new-post-channel-menu"
    >
      <div className="publishing-new-post-channel-menu-fixed-head">
        <div className="publishing-new-post-channel-menu-head">
          <Text strong>{CHANNEL_TERMINOLOGY.plural} ({selectedChannels.length})</Text>
          <Button
            type="link"
            onClick={() => {
              onChange([]);
            }}
          >
            Clear All
          </Button>
        </div>
        <div className="publishing-new-post-channel-chip-row">
          {selectedChannels.map((channel) => (
            <ChannelChip
              key={channel.id}
              channel={channel}
              onRemove={(channelId) => onChange(visibleSelectedChannelIds.filter((id) => id !== channelId))}
            />
          ))}
        </div>
      </div>

      <div className="publishing-new-post-channel-menu-body">
        <div className="publishing-new-post-channel-section-title">
          <Text type="secondary">Select all channels in this group</Text>
          <DownOutlined />
        </div>
        {visibleChannelGroups.map((channelGroup) => {
          const enabledChannelIds = channelGroup.channelIds.filter((channelId) => (
            !channels.find((channel) => channel.id === channelId)?.disabled
          ));
          const isSelected = enabledChannelIds.length > 0
            && enabledChannelIds.every((channelId) => selectedChannelIdSet.has(channelId));

          return (
            <button
              key={channelGroup.id}
              type="button"
              className={[
                'publishing-new-post-channel-group-row',
                isSelected ? 'is-selected' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => toggleChannelGroup(channelGroup)}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  minWidth: 0,
                }}
              >
                <ChannelGroupBadge group={channelGroup} maxWidth={220} size="sm" />
                <Text type="secondary">({formatChannelCount(channelGroup.channelIds.length)})</Text>
              </span>
              <Checkbox
                checked={isSelected}
                onClick={(event) => event.stopPropagation()}
                onChange={() => toggleChannelGroup(channelGroup)}
              />
            </button>
          );
        })}

        {NETWORKS.map((network) => {
          const networkChannels = channels.filter((channel) => channel.platform === network.key);
          if (!networkChannels.length) {
            return null;
          }

          return (
            <div key={network.key} className="publishing-new-post-channel-network">
              <div className="publishing-new-post-channel-network-head">
                <Text strong>{network.label}</Text>
                <Button
                  type="link"
                  size="small"
                  className="publishing-new-post-channel-network-all"
                  onClick={() => toggleChannelSet(networkChannels.map((channel) => channel.id))}
                >
                  All {network.label}
                </Button>
              </div>
              {networkChannels.map((channel) => {
                const isSelected = selectedChannelIdSet.has(channel.id);
                const canToggle = !channel.disabled || isSelected;

                return (
                  <button
                    key={channel.id}
                    type="button"
                    className={[
                      'publishing-new-post-channel-row',
                      isSelected ? 'is-selected' : '',
                      channel.disabled ? 'is-disabled' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => {
                      if (canToggle) {
                        toggleChannel(channel.id);
                      }
                    }}
                  >
                    <Avatar style={{ background: channel.avatarColor }}>{channel.name.slice(0, 1)}</Avatar>
                    <span className="publishing-new-post-channel-copy">
                      <span>
                        <PlatformIcon platform={network.key} size="row" />
                        <Text strong={!channel.disabled}>{channel.name}</Text>
                      </span>
                      <Text type="secondary">{channel.handle}</Text>
                    </span>
                    <span className="publishing-new-post-channel-row-actions">
                      {channel.disabled ? (
                        <TooltipContent title={DISCONNECTED_ACCOUNT_TOOLTIP}>
                          <ExclamationCircleOutlined className="publishing-new-post-row-warning" />
                        </TooltipContent>
                      ) : null}
                      <Checkbox
                        checked={isSelected}
                        onClick={(event) => event.stopPropagation()}
                        onChange={() => {
                          if (canToggle) {
                            toggleChannel(channel.id);
                          }
                        }}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="publishing-new-post-channel-menu-footer">
        <Button
          type="link"
          href={CHANNEL_GROUP_MANAGEMENT_ROUTE}
          onClick={(event) => {
            event.preventDefault();
            navigate(CHANNEL_GROUP_MANAGEMENT_ROUTE);
          }}
        >
          Manage {CHANNEL_TERMINOLOGY.lowerGroupPlural}
        </Button>
        <Button
          className="publishing-new-post-channel-connect-button"
          icon={<PlusOutlined />}
          onClick={() => navigate(CHANNEL_MANAGEMENT_ROUTE)}
          type="dashed"
        >
          Connect a {CHANNEL_TERMINOLOGY.singular}
        </Button>
      </div>
    </div>
  );

  return (
    <Popover
      trigger="click"
      placement="bottomLeft"
      content={selectorContent}
      destroyOnHidden
      fresh
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (nextOpen) {
          updateTriggerWidth();
        }
      }}
      arrow={false}
      overlayClassName="publishing-new-post-channel-popover"
      overlayStyle={triggerWidth ? { '--publishing-new-post-channel-popover-width': `${triggerWidth}px` } : undefined}
    >
      <Button
        ref={triggerRef}
        htmlType="button"
        aria-label={`${CHANNEL_TERMINOLOGY.singular} selection`}
        className={[
          'publishing-new-post-channel-trigger',
          hasSelectedIssue ? 'is-error' : '',
        ].filter(Boolean).join(' ')}
        style={{
          alignItems: 'center',
          display: 'flex',
          height: 'auto',
          justifyContent: 'space-between',
          lineHeight: 1.4,
          marginInline: 'auto',
          minHeight: 56,
          padding: '8px 12px 8px 16px',
          whiteSpace: 'normal',
          width: 'min(800px, 100%)',
        }}
      >
        <span className="publishing-new-post-selected-channels">
          {visibleChannels.map((channel) => (
            <ChannelChip
              key={channel.id}
              channel={channel}
              onRemove={(channelId) => onChange(visibleSelectedChannelIds.filter((id) => id !== channelId))}
            />
          ))}
        </span>
        {hiddenCount ? <span className="publishing-new-post-more-chip">{hiddenCount} more...</span> : null}
        {hasSelectedIssue ? (
          <TooltipContent title={DISCONNECTED_CHANNELS_TOOLTIP}>
            <ExclamationCircleOutlined className="publishing-new-post-trigger-warning" />
          </TooltipContent>
        ) : null}
        <DownOutlined />
      </Button>
    </Popover>
  );
};
