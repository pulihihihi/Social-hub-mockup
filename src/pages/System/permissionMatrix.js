import { T, C } from "../../theme";

export const MOCK_ROLES = [
  { id: "superadmin", name: "Super Admin", desc: "Full system access", color: T.colorError },
  { id: "publishing_admin", name: "Publishing Admin", desc: "Manage publishing, Tag Groups, tags, and workflows", color: C.campaign },
  { id: "content_publisher", name: "Content Publisher", desc: "Create posts, manage drafts, and use asset library items", color: T.colorPrimary },
  { id: "approval_manager", name: "Approval Manager", desc: "Review approvals, rejected posts, and approval workflows", color: C.event },
  { id: "community_agent", name: "Community Agent", desc: "Handle Smart Inbox conversations and alert follow-up", color: C.aiBlue },
  { id: "marketing_analyst", name: "Marketing Analyst", desc: "Read Tag Group, inbox, publishing, and alert data", color: C.custom },
  { id: "settings_admin", name: "Settings Admin", desc: "Manage channels, taxonomy, AI Skill, notifications, and access", color: T.colorWarning },
  { id: "viewer", name: "Viewer", desc: "Read-only access to operational surfaces", color: T.colorSuccess },
];

export const PERMISSION_FEATURES = {
  SMART_INBOX: [
    { name: "All Messages", key: "smart_inbox_all_messages" },
    { name: "Private", key: "smart_inbox_private" },
    { name: "Completed", key: "smart_inbox_completed" },
    { name: "Saved Messages", key: "smart_inbox_saved_messages" },
    { name: "Reply Approvals", key: "smart_inbox_reply_approvals" },
  ],
  PUBLISHING: [
    { name: "New Post", key: "publishing_new_post" },
    { name: "Calendar", key: "publishing_calendar" },
    { name: "Drafts", key: "publishing_drafts" },
    { name: "Needs Approval", key: "publishing_needs_approval" },
    { name: "Rejected", key: "publishing_rejected" },
    { name: "Failed Posts", key: "publishing_failed_posts" },
    { name: "Deleted Posts", key: "publishing_deleted_posts" },
    { name: "Asset Library", key: "publishing_asset_library" },
  ],
  TAG_GROUPS: [
    { name: "Tag Groups", key: "publishing_campaigns_active" },
    { name: "Archived Tag Groups", key: "publishing_campaigns_archived" },
    { name: "Tag Group Planner", key: "publishing_campaign_planner" },
  ],
  AUTOMATION: [
    { name: "Bots", key: "bots" },
    { name: "Alerts", key: "alerts" },
  ],
  SETTINGS: [
    { name: "Channels", key: "channels" },
    { name: "Channel Group", key: "channel_groups" },
    { name: "Tag Management", key: "tag_management" },
    { name: "Approval Workflows", key: "approval_workflows" },
    { name: "Notifications", key: "notifications" },
    { name: "AI Skill", key: "ai_skill" },
  ],
  ACCESS: [
    { name: "Users", key: "users" },
    { name: "Permission Group", key: "permission_groups" },
  ],
};

export const PERMISSION_CATEGORY_LABELS = {
  SMART_INBOX: "SMART INBOX",
  PUBLISHING: "PUBLISHING",
  TAG_GROUPS: "TAG GROUPS",
  AUTOMATION: "AUTOMATION",
  SETTINGS: "SETTINGS",
  ACCESS: "ACCESS",
};

const makePermission = (view = false, create = false, edit = false, deleteAccess = false) => ({
  View: view,
  Create: create,
  Edit: edit,
  Delete: deleteAccess,
});

const noAccess = () => makePermission();
const readOnly = () => makePermission(true);
const reviewOnly = () => makePermission(true, false, true, false);
const publishAccess = () => makePermission(true, true, true, false);
const fullAccess = () => makePermission(true, true, true, true);

const grantCategory = (category, permissionFactory) => (
  Object.fromEntries(PERMISSION_FEATURES[category].map(({ key }) => [key, permissionFactory()]))
);

const grantSelected = (category, featurePermissions) => (
  Object.fromEntries(PERMISSION_FEATURES[category].map(({ key }) => [
    key,
    (featurePermissions[key] || noAccess)(),
  ]))
);

const buildRolePermissions = (categoryPermissions) => (
  Object.fromEntries(
    Object.keys(PERMISSION_FEATURES).map((category) => {
      const permissionConfig = categoryPermissions[category] || noAccess;
      return [
        category,
        typeof permissionConfig === "function"
          ? grantCategory(category, permissionConfig)
          : grantSelected(category, permissionConfig),
      ];
    }),
  )
);

const ROLE_PERMISSIONS = {
  superadmin: buildRolePermissions({
    SMART_INBOX: fullAccess,
    PUBLISHING: fullAccess,
    TAG_GROUPS: fullAccess,
    AUTOMATION: fullAccess,
    SETTINGS: fullAccess,
    ACCESS: fullAccess,
  }),
  publishing_admin: buildRolePermissions({
    SMART_INBOX: readOnly,
    PUBLISHING: fullAccess,
    TAG_GROUPS: fullAccess,
    AUTOMATION: {
      bots: readOnly,
      alerts: publishAccess,
    },
    SETTINGS: {
      channels: readOnly,
      channel_groups: readOnly,
      tag_management: fullAccess,
      approval_workflows: fullAccess,
      notifications: readOnly,
      ai_skill: publishAccess,
    },
    ACCESS: readOnly,
  }),
  content_publisher: buildRolePermissions({
    SMART_INBOX: readOnly,
    PUBLISHING: {
      publishing_new_post: publishAccess,
      publishing_calendar: reviewOnly,
      publishing_drafts: publishAccess,
      publishing_needs_approval: readOnly,
      publishing_rejected: reviewOnly,
      publishing_failed_posts: readOnly,
      publishing_deleted_posts: readOnly,
      publishing_asset_library: publishAccess,
    },
    TAG_GROUPS: {
      publishing_campaigns_active: readOnly,
      publishing_campaigns_archived: readOnly,
      publishing_campaign_planner: reviewOnly,
    },
    AUTOMATION: {
      alerts: readOnly,
    },
    SETTINGS: {
      tag_management: readOnly,
      approval_workflows: readOnly,
      ai_skill: readOnly,
    },
  }),
  approval_manager: buildRolePermissions({
    SMART_INBOX: {
      smart_inbox_reply_approvals: reviewOnly,
    },
    PUBLISHING: {
      publishing_new_post: readOnly,
      publishing_calendar: readOnly,
      publishing_drafts: reviewOnly,
      publishing_needs_approval: fullAccess,
      publishing_rejected: fullAccess,
      publishing_failed_posts: reviewOnly,
      publishing_deleted_posts: readOnly,
      publishing_asset_library: readOnly,
    },
    TAG_GROUPS: readOnly,
    AUTOMATION: {
      alerts: reviewOnly,
    },
    SETTINGS: {
      approval_workflows: publishAccess,
      notifications: readOnly,
    },
  }),
  community_agent: buildRolePermissions({
    SMART_INBOX: fullAccess,
    PUBLISHING: {
      publishing_calendar: readOnly,
      publishing_needs_approval: readOnly,
      publishing_failed_posts: readOnly,
    },
    AUTOMATION: {
      bots: reviewOnly,
      alerts: publishAccess,
    },
    SETTINGS: {
      channels: readOnly,
      channel_groups: readOnly,
      notifications: readOnly,
    },
  }),
  marketing_analyst: buildRolePermissions({
    SMART_INBOX: readOnly,
    PUBLISHING: readOnly,
    TAG_GROUPS: readOnly,
    AUTOMATION: readOnly,
    SETTINGS: {
      channels: readOnly,
      channel_groups: readOnly,
      tag_management: readOnly,
      approval_workflows: readOnly,
      ai_skill: readOnly,
    },
  }),
  settings_admin: buildRolePermissions({
    SMART_INBOX: readOnly,
    PUBLISHING: readOnly,
    TAG_GROUPS: readOnly,
    AUTOMATION: {
      bots: publishAccess,
      alerts: publishAccess,
    },
    SETTINGS: fullAccess,
    ACCESS: fullAccess,
  }),
  viewer: buildRolePermissions({
    SMART_INBOX: readOnly,
    PUBLISHING: readOnly,
    TAG_GROUPS: readOnly,
    AUTOMATION: readOnly,
    SETTINGS: {
      channels: readOnly,
      channel_groups: readOnly,
      tag_management: readOnly,
      approval_workflows: readOnly,
      ai_skill: readOnly,
    },
  }),
};


export const createEmptyPermissionMatrix = () => (
  Object.fromEntries(
    Object.entries(PERMISSION_FEATURES).map(([category, features]) => [
      category,
      Object.fromEntries(
        features.map(feature => [
          feature.key,
          { View: false, Create: false, Edit: false, Delete: false },
        ]),
      ),
    ]),
  )
);

export const clonePermissionMatrix = (matrix) => (
  Object.fromEntries(
    Object.entries(PERMISSION_FEATURES).map(([category, features]) => [
      category,
      Object.fromEntries(
        features.map(feature => {
          const source = matrix?.[category]?.[feature.key] || {};
          return [
            feature.key,
            {
              View: !!source.View,
              Create: !!source.Create,
              Edit: !!source.Edit,
              Delete: !!source.Delete,
            },
          ];
        }),
      ),
    ]),
  )
);

export const cloneRolePermissionStore = (rolePermissions) => (
  Object.fromEntries(
    Object.entries(rolePermissions).map(([roleId, matrix]) => [roleId, clonePermissionMatrix(matrix)]),
  )
);

const normalizeRolePermissions = (rolePermissions) => (
  Object.fromEntries(
    Object.entries(rolePermissions).map(([roleId, categoryPermissions]) => [
      roleId,
      Object.fromEntries(
        Object.entries(PERMISSION_FEATURES).map(([category, features]) => [
          category,
          Object.fromEntries(
            features.map(feature => {
              const featurePermissions = categoryPermissions?.[category]?.[feature.key];
              const legacyCategoryPermissions = categoryPermissions?.[category] || {};
              return [
                feature.key,
                {
                  View: featurePermissions?.View ?? !!legacyCategoryPermissions.View,
                  Create: featurePermissions?.Create ?? !!legacyCategoryPermissions.Create,
                  Edit: featurePermissions?.Edit ?? !!legacyCategoryPermissions.Edit,
                  Delete: featurePermissions?.Delete ?? !!legacyCategoryPermissions.Delete,
                },
              ];
            }),
          ),
        ]),
      ),
    ]),
  )
);

export const INITIAL_ROLE_PERMISSIONS = normalizeRolePermissions(ROLE_PERMISSIONS);

export const buildRoleId = (name, existingRoles) => {
  const baseId = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "custom_role";
  let roleId = baseId;
  let suffix = 2;
  while (existingRoles.some(role => role.id === roleId)) {
    roleId = `${baseId}_${suffix}`;
    suffix += 1;
  }
  return roleId;
};
