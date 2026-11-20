import { Button, Empty, Popover, Tag, Tooltip } from "antd";
import { ChannelGroupBadge } from "../../components/ChannelGroupBadge";
import { T, C } from "../../theme";
import { PlatformDisplay } from "../../components/SharedBadges";
import { getUserRoleCompactLabel } from "../../data/userManagement";
import {
  CHANNEL_TERMINOLOGY,
  MANAGED_CHANNELS,
} from "../../data/channelManagement";

const roleColors = {
  SuperAdmin: T.colorError,
  PublishingAdmin: C.campaign,
  ContentPublisher: T.colorPrimary,
  ApprovalManager: C.event,
  CommunityAgent: C.aiBlue,
  MarketingAnalyst: C.custom,
  SettingsAdmin: T.colorWarning,
  Viewer: T.colorSuccess,
};

const ACCESS_TAG_STYLE = {
  maxWidth: 172,
  marginInlineEnd: 0,
  borderRadius: T.borderRadiusSM,
  overflow: "hidden",
};

export const RoleTag = ({ role }) => (
  <Tag color={roleColors[role] || T.colorPrimary} style={{ fontSize: T.fontSizeSM, fontWeight: T.fontWeightStrong }}>
    {getUserRoleCompactLabel(role)}
  </Tag>
);

const AccessTag = ({ item, type = "channel" }) => (
  <Tag style={type === "group" ? { ...ACCESS_TAG_STYLE, padding: 0, border: "none", background: "transparent" } : ACCESS_TAG_STYLE}>
    {type === "channel" ? (
      <PlatformDisplay
        platform={item.platformKey || item.platform}
        label={item.name}
        iconSize="inline"
        textStyle={{ maxWidth: 132 }}
      />
    ) : (
      <ChannelGroupBadge group={item} maxWidth={144} size="sm" />
    )}
  </Tag>
);

const AccessListPopoverContent = ({ items, type }) => (
  <div style={{ display: "grid", gap: 8, minWidth: 240, maxWidth: 320, padding: 2 }}>
    {items.map((item) => (
      <div key={item.id} style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
        {type === "channel" ? (
          <PlatformDisplay
            platform={item.platformKey || item.platform}
            label={item.name}
            iconSize="inline"
            textStyle={{ maxWidth: 250 }}
          />
        ) : (
          <ChannelGroupBadge group={item} maxWidth={230} size="sm" />
        )}
      </div>
    ))}
  </div>
);

export const AccessListCell = ({ items = [], type = "channel", maxVisible = 2 }) => {
  const visibleItems = items.slice(0, maxVisible);
  const hiddenCount = Math.max(items.length - visibleItems.length, 0);

  if (!items.length) {
    return <span style={{ color: T.colorTextTertiary, fontSize: T.fontSizeSM }}>-</span>;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, minWidth: 0, overflow: "hidden" }}>
      {visibleItems.map((item) => (
        <AccessTag key={item.id} item={item} type={type} />
      ))}
      {hiddenCount > 0 ? (
        <Popover
          content={<AccessListPopoverContent items={items} type={type} />}
          placement="rightTop"
          trigger="click"
        >
          <Button type="link" size="small" style={{ height: 24, paddingInline: 4, fontWeight: T.fontWeightStrong }}>
            +{hiddenCount} more
          </Button>
        </Popover>
      ) : null}
    </div>
  );
};

export const GrantedChannelPreview = ({ channelGroupIds = [], channelGroups = [], channelIds = [] }) => {
  const selectedGroupIdSet = new Set((channelGroupIds || []).map(String));
  const directChannelIdSet = new Set(channelIds || []);
  const sourceGroupsByChannelId = new Map();

  channelGroups
    .filter((group) => selectedGroupIdSet.has(String(group.id)))
    .forEach((group) => {
      group.channelIds.forEach((channelId) => {
        const groups = sourceGroupsByChannelId.get(channelId) || [];
        groups.push(group.name);
        sourceGroupsByChannelId.set(channelId, groups);
      });
    });

  const grantedChannelIds = new Set([
    ...sourceGroupsByChannelId.keys(),
    ...directChannelIdSet,
  ]);
  const grantedChannels = MANAGED_CHANNELS.filter((channel) => grantedChannelIds.has(channel.id));

  const getSourceLabel = (channelId) => {
    const sourceParts = [];
    const groups = sourceGroupsByChannelId.get(channelId) || [];

    if (groups.length) {
      sourceParts.push(`From group: ${groups.join(", ")}`);
    }

    if (directChannelIdSet.has(channelId)) {
      sourceParts.push("Selected individually");
    }

    return sourceParts.join(" | ");
  };

  return (
    <div
      style={{
        border: `1px solid ${T.colorBorderSecondary}`,
        borderRadius: T.borderRadiusLG,
        background: T.colorFillAlter,
        padding: T.paddingSM,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: T.paddingSM }}>
        <span style={{ color: T.colorTextBase, fontSize: T.fontSizeSM, fontWeight: T.fontWeightStrong }}>
          Granted {CHANNEL_TERMINOLOGY.plural} ({grantedChannels.length})
        </span>
        <span style={{ color: T.colorTextTertiary, fontSize: T.fontSizeXS }}>
          Group + direct grants
        </span>
      </div>

      {grantedChannels.length ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            maxHeight: 136,
            overflowY: "auto",
            paddingTop: T.paddingSM,
          }}
        >
          {grantedChannels.map((channel) => (
            <Tooltip key={channel.id} title={getSourceLabel(channel.id)}>
              <Tag
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  maxWidth: 250,
                  marginInlineEnd: 0,
                  borderRadius: 999,
                  padding: "4px 9px",
                  background: C.white,
                  cursor: "default",
                }}
              >
                <PlatformDisplay
                  platform={channel.platformKey || channel.platform}
                  label={channel.name}
                  iconSize="chip"
                  textStyle={{ maxWidth: 190 }}
                />
              </Tag>
            </Tooltip>
          ))}
        </div>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={`No ${CHANNEL_TERMINOLOGY.lowerPlural} granted yet`}
          style={{ margin: `${T.paddingSM}px 0 0` }}
        />
      )}
    </div>
  );
};
