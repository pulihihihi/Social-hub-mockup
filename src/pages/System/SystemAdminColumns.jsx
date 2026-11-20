import { T } from "../../theme";
import { CHANNEL_TERMINOLOGY } from "../../data/channelManagement";
import { compareRecordIdsAscending } from "../../utils/idSort";
import { AccessListCell } from "./SystemAccessCells";

export const getSystemAdminColumns = ({
  getUserChannelGroups,
  getUserChannels,
  renderEditableUserRoleCell,
}) => [
  {
    title: "ID",
    dataIndex: "id",
    width: 88,
    defaultSortOrder: "descend",
    sorter: compareRecordIdsAscending,
    render: (id) => <span style={{ fontSize: T.fontSizeSM, fontWeight: T.fontWeightStrong }}>{id}</span>,
  },
  {
    title: "Email",
    dataIndex: "email",
    sorter: (a, b) => (a.email || "").localeCompare(b.email || ""),
    render: (email) => <span style={{ fontSize: T.fontSizeSM }}>{email || "--"}</span>,
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
    render: (name) => <span style={{ fontSize: T.fontSizeMD, fontWeight: T.fontWeightStrong }}>{name || "--"}</span>,
  },
  {
    title: CHANNEL_TERMINOLOGY.singular,
    dataIndex: "channelIds",
    width: 300,
    sorter: (a, b) => (a.channelIds?.length || 0) - (b.channelIds?.length || 0),
    render: (_channelIds, user) => (
      <AccessListCell items={getUserChannels(user)} type="channel" />
    ),
  },
  {
    title: CHANNEL_TERMINOLOGY.groupSingular,
    dataIndex: "channelGroupIds",
    width: 240,
    sorter: (a, b) => (a.channelGroupIds?.length || 0) - (b.channelGroupIds?.length || 0),
    render: (_channelGroupIds, user) => (
      <AccessListCell items={getUserChannelGroups(user)} type="group" />
    ),
  },
  {
    title: "Role",
    dataIndex: "role",
    width: 140,
    sorter: (a, b) => (a.role || "").localeCompare(b.role || ""),
    render: (_, user) => renderEditableUserRoleCell(user),
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    width: 120,
    sorter: (a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""),
    render: (value) => <span style={{ fontSize: T.fontSizeSM }}>{value || "--"}</span>,
  },
  {
    title: "Last Login",
    dataIndex: "lastLogin",
    width: 120,
    sorter: (a, b) => (a.lastLogin || "").localeCompare(b.lastLogin || ""),
    render: (value) => <span style={{ fontSize: T.fontSizeSM }}>{value || "--"}</span>,
  },
];
