import {
  Avatar,
  Button,
  Popover,
  Tooltip,
} from "antd";
import { T } from "../../../theme";
import { getUserInitials } from "../../../data/userManagement";

const TEAM_MEMBER_AVATAR_COLORS = [
  T.colorPrimary,
  T.colorError,
  T.colorWarning,
  T.colorSuccess,
  T.colorInfo,
  "#8c8c8c",
];

const getStableAvatarColor = (user) => {
  const source = user.uid || user.email || user.name || "";
  const hash = source.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return TEAM_MEMBER_AVATAR_COLORS[hash % TEAM_MEMBER_AVATAR_COLORS.length];
};

const TeamMemberAvatar = ({ user, size = 24 }) => (
  <Avatar
    size={size}
    style={{
      backgroundColor: getStableAvatarColor(user),
      color: "#fff",
      fontSize: size <= 24 ? T.fontSizeXS : T.fontSizeSM,
      fontWeight: T.fontWeightStrong,
    }}
  >
    {getUserInitials(user.name || user.email)}
  </Avatar>
);

export const TeamMemberCell = ({ members = [], maxVisible = 5 }) => {
  const resolvedMembers = members
    .filter(Boolean)
    .slice()
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  const visibleMembers = resolvedMembers.slice(0, maxVisible);
  const hiddenCount = Math.max(resolvedMembers.length - visibleMembers.length, 0);

  if (!resolvedMembers.length) {
    return <span style={{ color: T.colorTextTertiary, fontSize: T.fontSizeSM }}>-</span>;
  }

  const memberList = (
    <div style={{ display: "grid", gap: 12, minWidth: 210, padding: 4 }}>
      {resolvedMembers.map((member) => (
        <div key={member.uid || member.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <TeamMemberAvatar user={member} />
          <span style={{ display: "grid", minWidth: 0 }}>
            <span style={{ color: T.colorTextBase, fontWeight: T.fontWeightStrong }}>{member.name}</span>
            <span style={{ color: T.colorTextSecondary, fontSize: T.fontSizeXS }}>{member.email}</span>
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, minWidth: 0 }}>
      {visibleMembers.map((member) => (
        <Tooltip key={member.uid || member.id} title={`${member.name} (${member.email})`}>
          <span style={{ display: "inline-flex" }}>
            <TeamMemberAvatar user={member} />
          </span>
        </Tooltip>
      ))}
      {hiddenCount > 0 ? (
        <Popover content={memberList} trigger="click" placement="rightTop">
          <Button type="link" size="small" style={{ height: 24, paddingInline: 6, fontWeight: T.fontWeightStrong }}>
            +{hiddenCount} more
          </Button>
        </Popover>
      ) : null}
    </span>
  );
};
