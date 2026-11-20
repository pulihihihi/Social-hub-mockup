import { PlatformTag } from "../../../components/SharedBadges";
import {
  ChannelGroupBadge,
  ChannelGroupBadgeList,
  ChannelGroupColorChip,
} from "../../../components/ChannelGroupBadge";
import { T } from "../../../theme";
import {
  normalizeChannelApiStatus,
} from "./config";
import { TeamMemberCell } from "./TeamMemberCell";
import {
  getChannelGroupDisplay,
  getChannelGroupNames,
  getChannelGroupValue,
} from "./pageUtils";

const renderChannelGroupTags = (groups) => {
  return <ChannelGroupBadgeList groups={groups} maxWidth={190} size="sm" />;
};

export const getChannelColumns = ({
  channelGroupOptions,
  channelGroups,
  getChannelTeamMembers,
  managedUserMap,
  renderChannelLinkCell,
  renderConnectionStatusCell,
  renderEditableSelectCell,
  updateChannelField,
}) => [
  {
    title: "ID",
    dataIndex: "id",
    width: 70,
    sorter: (a, b) => a.id - b.id,
    render: (id) => <span style={{ fontSize: T.fontSizeSM }}>{id || "--"}</span>,
  },
  {
    title: "Channel Name",
    dataIndex: "name",
    sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
    render: (name) => <span style={{ fontSize: T.fontSizeMD, fontWeight: T.fontWeightStrong }}>{name || "--"}</span>,
  },
  {
    title: "Platform",
    dataIndex: "platform",
    width: 150,
    sorter: (a, b) => (a.platform || "").localeCompare(b.platform || ""),
    render: (platform) => platform ? <PlatformTag platform={platform} /> : "--",
  },
  {
    title: "Channel ID",
    dataIndex: "channelId",
    sorter: (a, b) => (a.channelId || "").localeCompare(b.channelId || ""),
    render: (cid) => <span style={{ fontSize: T.fontSizeXS, color: T.colorTextSecondary }}>{cid || "--"}</span>,
  },
  {
    title: "Channel Link",
    dataIndex: "channelLink",
    width: 190,
    sorter: (a, b) => (a.channelLink || "").localeCompare(b.channelLink || ""),
    render: renderChannelLinkCell,
  },
  {
    title: "Channel Group",
    dataIndex: "channelGroups",
    sorter: (a, b) => getChannelGroupNames(a).join(", ").localeCompare(getChannelGroupNames(b).join(", ")),
    render: (channelGroupsValue, record) => {
      const displayGroups = getChannelGroupDisplay(channelGroupsValue, channelGroups);

      return renderEditableSelectCell({
        record,
        field: "channelGroups",
        options: channelGroupOptions,
        selectMode: "multiple",
        selectValue: getChannelGroupValue(channelGroupsValue, channelGroups),
        displayNode: renderChannelGroupTags(displayGroups),
        minWidth: 220,
        ariaLabel: `Edit channel group for ${record.name}`,
        onChange: (value) => updateChannelField(
          record.id,
          "channelGroups",
          value || [],
          value?.length ? "Channel group updated" : "Channel group cleared",
        ),
        mutedWhenEmpty: true,
      });
    },
  },
  {
    title: "Team Member",
    dataIndex: "teamMemberIds",
    width: 180,
    sorter: (a, b) => getChannelTeamMembers(a).length - getChannelTeamMembers(b).length,
    render: (_teamMemberIds, record) => (
      <TeamMemberCell members={getChannelTeamMembers(record)} maxVisible={3} />
    ),
  },
  {
    title: "Connection Status",
    dataIndex: "health",
    width: 190,
    sorter: (a, b) => normalizeChannelApiStatus(a.health).localeCompare(normalizeChannelApiStatus(b.health)),
    render: renderConnectionStatusCell,
  },
  {
    title: "Modified by",
    dataIndex: "editedByUid",
    width: 100,
    render: (uid, channel) => {
      const user = managedUserMap.get(uid || channel.addedByUid);

      return <span style={{ fontSize: T.fontSizeSM }}>{user?.name || "--"}</span>;
    },
  },
];

export const getChannelGroupColumns = ({ getGroupTeamMembers, onEditGroup }) => [
  {
    title: "ID",
    dataIndex: "id",
    width: 80,
    sorter: (a, b) => a.id - b.id,
    render: (id) => <span style={{ fontSize: T.fontSizeSM }}>{id || "--"}</span>,
  },
  {
    title: "Group Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (_name, record) => <ChannelGroupBadge group={record} maxWidth={260} />,
  },
  {
    title: "Color",
    dataIndex: "color",
    width: 160,
    sorter: (a, b) => (a.color || "").localeCompare(b.color || ""),
    render: (color, record) => (
      <button
        type="button"
        onClick={() => onEditGroup?.(record)}
        aria-label={`Edit color for ${record.name}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          minHeight: 30,
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: onEditGroup ? "pointer" : "default",
          textAlign: "left",
        }}
      >
        <ChannelGroupColorChip color={color} groupName={record.name} />
      </button>
    ),
  },
  {
    title: "Team Member",
    dataIndex: "teamMemberIds",
    width: 280,
    sorter: (a, b) => getGroupTeamMembers(a).length - getGroupTeamMembers(b).length,
    render: (_teamMemberIds, record) => <TeamMemberCell members={getGroupTeamMembers(record)} />,
  },
  {
    title: "Channels",
    dataIndex: "channelCount",
    width: 140,
    sorter: (a, b) => a.channelCount - b.channelCount,
    render: (channelCount) => <span style={{ fontSize: T.fontSizeSM }}>{channelCount}</span>,
  },
];
