import { useEffect, useState } from 'react';

export const USER_MANAGEMENT_STORAGE_KEY = 'socialhub.managedUsers.v1';
export const USER_MANAGEMENT_EVENT = 'socialhub:managed-users-changed';
export const USER_MANAGEMENT_ROUTE = '/settings/system';

// Contract: all app surfaces that display or assign users/team members must derive
// from this managed user directory. Do not create feature-local team-member rosters.

export const USER_ROLE_DEFINITIONS = [
  {
    value: 'SuperAdmin',
    label: 'Super Admin',
    compactLabel: 'SuperAdmin',
    permissionGroupId: 'superadmin',
    notificationTier: 'admin',
  },
  {
    value: 'PublishingAdmin',
    label: 'Publishing Admin',
    compactLabel: 'PublishingAdmin',
    permissionGroupId: 'publishing_admin',
    notificationTier: 'admin',
  },
  {
    value: 'ContentPublisher',
    label: 'Content Publisher',
    compactLabel: 'ContentPublisher',
    permissionGroupId: 'content_publisher',
    notificationTier: 'member',
  },
  {
    value: 'ApprovalManager',
    label: 'Approval Manager',
    compactLabel: 'ApprovalManager',
    permissionGroupId: 'approval_manager',
    notificationTier: 'member',
  },
  {
    value: 'CommunityAgent',
    label: 'Community Agent',
    compactLabel: 'CommunityAgent',
    permissionGroupId: 'community_agent',
    notificationTier: 'member',
  },
  {
    value: 'MarketingAnalyst',
    label: 'Marketing Analyst',
    compactLabel: 'MarketingAnalyst',
    permissionGroupId: 'marketing_analyst',
    notificationTier: 'viewer',
  },
  {
    value: 'SettingsAdmin',
    label: 'Settings Admin',
    compactLabel: 'SettingsAdmin',
    permissionGroupId: 'settings_admin',
    notificationTier: 'admin',
  },
  {
    value: 'Viewer',
    label: 'Viewer',
    compactLabel: 'Viewer',
    permissionGroupId: 'viewer',
    notificationTier: 'viewer',
  },
];

export const USER_ROLES_OPTIONS = USER_ROLE_DEFINITIONS.map(({ value, label }) => ({
  value,
  label,
}));

export const USER_ROLE_LABEL_BY_VALUE = Object.fromEntries(
  USER_ROLE_DEFINITIONS.map((role) => [role.value, role.label]),
);

export const USER_ROLE_COMPACT_LABEL_BY_VALUE = Object.fromEntries(
  USER_ROLE_DEFINITIONS.map((role) => [role.value, role.compactLabel]),
);

export const USER_ROLE_NOTIFICATION_TIER_BY_VALUE = Object.fromEntries(
  USER_ROLE_DEFINITIONS.map((role) => [role.value, role.notificationTier]),
);

export const DEFAULT_MANAGED_USERS = [
  { id: 1, uid: 'user-tran-hai-son', email: 'haison.tran@garena.vn', name: 'Tran Hai Son', role: 'SuperAdmin', createdAt: '2022-01-15', lastLogin: '2026-04-04' },
  { id: 2, uid: 'user-pham-my-linh', email: 'mylinh.pham@garena.vn', name: 'Pham My Linh', role: 'PublishingAdmin', createdAt: '2023-06-20', lastLogin: '2026-04-03' },
  { id: 3, uid: 'user-nguyen-hoai-son', email: 'hoaison.nguyen@garena.vn', name: 'Nguyen Hoai Son', role: 'ContentPublisher', createdAt: '2023-08-10', lastLogin: '2026-04-01' },
  { id: 4, uid: 'user-nguyen-ngoc-linh', email: 'ngoclinh.nguyen@garena.vn', name: 'Nguyen Ngoc Linh', role: 'ApprovalManager', createdAt: '2023-09-05', lastLogin: '2026-03-30' },
  { id: 5, uid: 'user-tran-minh', email: 'minh.tran@garena.vn', name: 'Tran Minh', role: 'CommunityAgent', createdAt: '2024-01-12', lastLogin: '2026-03-28' },
  { id: 6, uid: 'user-pham-linh', email: 'linh.pham@garena.vn', name: 'Pham Linh', role: 'SettingsAdmin', createdAt: '2024-02-18', lastLogin: '2026-04-02' },
  { id: 7, uid: 'user-nguyen-duc', email: 'duc.nguyen@garena.vn', name: 'Nguyen Duc', role: 'MarketingAnalyst', createdAt: '2024-03-25', lastLogin: '2026-03-31' },
  { id: 8, uid: 'user-tran-hoa', email: 'hoa.tran@garena.vn', name: 'Tran Hoa', role: 'ContentPublisher', createdAt: '2024-04-10', lastLogin: '2026-03-29' },
  { id: 9, uid: 'user-le-nam', email: 'nam.le@garena.vn', name: 'Le Nam', role: 'Viewer', createdAt: '2024-05-15', lastLogin: '2026-04-04' },
  { id: 10, uid: 'user-pham-anh', email: 'anh.pham@garena.vn', name: 'Pham Anh', role: 'CommunityAgent', createdAt: '2024-06-20', lastLogin: '2026-04-03' },
];

const DEFAULT_USER_ACCESS_BY_UID = {
  'user-tran-hai-son': {
    channelIds: ['fb-delta-main', 'fb-warrior', 'ig-warrior', 'ig-delta', 'ig-alt', 'threads-delta', 'threads-warrior', 'yt-warrior', 'yt-delta', 'tt-warrior', 'tt-delta'],
    channelGroupIds: [1, 2, 3],
  },
  'user-pham-my-linh': {
    channelIds: ['fb-delta-main', 'ig-delta', 'yt-delta', 'tt-delta'],
    channelGroupIds: [2, 3],
  },
  'user-nguyen-hoai-son': {
    channelIds: ['fb-warrior', 'ig-warrior', 'yt-warrior', 'tt-warrior'],
    channelGroupIds: [1],
  },
  'user-nguyen-ngoc-linh': {
    channelIds: ['fb-delta-main', 'fb-warrior', 'yt-delta'],
    channelGroupIds: [1, 2, 3],
  },
  'user-tran-minh': {
    channelIds: ['fb-delta-main', 'threads-delta', 'tt-delta'],
    channelGroupIds: [2],
  },
  'user-pham-linh': {
    channelIds: ['fb-delta-main', 'fb-warrior', 'ig-warrior', 'ig-delta', 'yt-warrior', 'yt-delta', 'tt-warrior', 'tt-delta'],
    channelGroupIds: [1, 2, 3],
  },
  'user-nguyen-duc': {
    channelIds: ['fb-delta-main', 'ig-alt', 'threads-delta'],
    channelGroupIds: [2],
  },
  'user-tran-hoa': {
    channelIds: ['ig-warrior', 'yt-warrior', 'tt-warrior'],
    channelGroupIds: [1],
  },
  'user-le-nam': {
    channelIds: ['fb-delta-main'],
    channelGroupIds: [2],
  },
  'user-pham-anh': {
    channelIds: ['threads-warrior', 'threads-delta', 'tt-warrior'],
    channelGroupIds: [1],
  },
};

const DEFAULT_USER_ACCESS_BY_ROLE = {
  SuperAdmin: DEFAULT_USER_ACCESS_BY_UID['user-tran-hai-son'],
  PublishingAdmin: DEFAULT_USER_ACCESS_BY_UID['user-pham-my-linh'],
  ContentPublisher: DEFAULT_USER_ACCESS_BY_UID['user-nguyen-hoai-son'],
  ApprovalManager: DEFAULT_USER_ACCESS_BY_UID['user-nguyen-ngoc-linh'],
  CommunityAgent: DEFAULT_USER_ACCESS_BY_UID['user-tran-minh'],
  SettingsAdmin: DEFAULT_USER_ACCESS_BY_UID['user-pham-linh'],
  MarketingAnalyst: DEFAULT_USER_ACCESS_BY_UID['user-nguyen-duc'],
  Viewer: DEFAULT_USER_ACCESS_BY_UID['user-le-nam'],
};

const PUBLISHING_USER_ROLES = new Set(['SuperAdmin', 'PublishingAdmin', 'ContentPublisher']);

const slugify = (value) => (
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
);

const getBaseUserUid = (user, index) => {
  if (user.uid) {
    return slugify(user.uid);
  }

  const fromEmail = user.email ? user.email.split('@')[0] : '';
  const fromName = user.name || '';
  return `user-${slugify(fromEmail || fromName || `member-${index + 1}`)}`;
};

const normalizeUsers = (users) => {
  const usedUids = new Set();

  return users.map((user, index) => {
    const baseUid = getBaseUserUid(user, index) || `user-member-${index + 1}`;
    let uid = baseUid;
    let suffix = 2;

    while (usedUids.has(uid)) {
      uid = `${baseUid}-${suffix}`;
      suffix += 1;
    }

    usedUids.add(uid);

    const role = USER_ROLE_LABEL_BY_VALUE[user.role] ? user.role : 'Viewer';
    const defaultAccess = DEFAULT_USER_ACCESS_BY_UID[uid] || DEFAULT_USER_ACCESS_BY_ROLE[role] || {};

    return {
      id: user.id ?? index + 1,
      uid,
      email: user.email || '',
      name: user.name || user.email || `User ${index + 1}`,
      role,
      channelIds: Array.isArray(user.channelIds) ? [...new Set(user.channelIds)] : [...(defaultAccess.channelIds || [])],
      channelGroupIds: Array.isArray(user.channelGroupIds) ? [...new Set(user.channelGroupIds)] : [...(defaultAccess.channelGroupIds || [])],
      createdAt: user.createdAt || '',
      lastLogin: user.lastLogin || '',
    };
  });
};

const cloneUsers = (users) => normalizeUsers(users).map((user) => ({ ...user }));

export const getManagedUsers = () => {
  if (typeof window === 'undefined') {
    return cloneUsers(DEFAULT_MANAGED_USERS);
  }

  try {
    const storedUsers = window.localStorage.getItem(USER_MANAGEMENT_STORAGE_KEY);
    if (!storedUsers) {
      return cloneUsers(DEFAULT_MANAGED_USERS);
    }

    const parsedUsers = JSON.parse(storedUsers);
    return Array.isArray(parsedUsers)
      ? cloneUsers(parsedUsers)
      : cloneUsers(DEFAULT_MANAGED_USERS);
  } catch {
    return cloneUsers(DEFAULT_MANAGED_USERS);
  }
};

export const setManagedUsers = (users) => {
  const nextUsers = cloneUsers(users);

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(USER_MANAGEMENT_STORAGE_KEY, JSON.stringify(nextUsers));
    window.dispatchEvent(new CustomEvent(USER_MANAGEMENT_EVENT, {
      detail: { users: nextUsers },
    }));
  }

  return nextUsers;
};

export const createManagedUser = (values, existingUsers) => {
  const today = new Date().toISOString().split('T')[0];
  const maxId = Math.max(...existingUsers.map((user) => Number(user.id) || 0), 0);

  return normalizeUsers([
    ...existingUsers,
    {
      id: maxId + 1,
      ...values,
      createdAt: today,
      lastLogin: today,
    },
  ]).at(-1);
};

export const getUserRoleLabel = (role) => USER_ROLE_LABEL_BY_VALUE[role] || role || 'Viewer';

export const getUserRoleCompactLabel = (role) => USER_ROLE_COMPACT_LABEL_BY_VALUE[role] || role || 'Viewer';

export const getUserInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) {
    return 'U';
  }

  return parts.length === 1
    ? parts[0].slice(0, 2).toUpperCase()
    : `${parts[0][0]}${parts.at(-1)[0]}`.toUpperCase();
};

export const getUserOption = (user) => ({
  value: user.uid,
  label: user.name,
  email: user.email,
  role: user.role,
  initials: getUserInitials(user.name),
});

export const getUserFilterOptions = (users = getManagedUsers()) => (
  cloneUsers(users).map(getUserOption)
);

export const getWorkflowApproverOptions = (users = getManagedUsers()) => (
  cloneUsers(users).map((user) => ({
    ...getUserOption(user),
    label: `${user.name} (${getUserRoleLabel(user.role)})`,
  }))
);

export const getMobilePublisherOptions = (users = getManagedUsers()) => (
  cloneUsers(users)
    .filter((user) => PUBLISHING_USER_ROLES.has(user.role))
    .map((user) => ({
      ...getUserOption(user),
      label: `${user.name} (${getUserRoleLabel(user.role)})`,
    }))
);

export const useManagedUsers = () => {
  const [users, setUsersState] = useState(getManagedUsers);

  useEffect(() => {
    const syncUsers = (event) => {
      if (event.type === 'storage' && event.key !== USER_MANAGEMENT_STORAGE_KEY) {
        return;
      }

      setUsersState(
        event.detail?.users
          ? cloneUsers(event.detail.users)
          : getManagedUsers(),
      );
    };

    window.addEventListener(USER_MANAGEMENT_EVENT, syncUsers);
    window.addEventListener('storage', syncUsers);

    return () => {
      window.removeEventListener(USER_MANAGEMENT_EVENT, syncUsers);
      window.removeEventListener('storage', syncUsers);
    };
  }, []);

  const setUsers = (updater) => {
    setUsersState((currentUsers) => {
      const nextUsers = typeof updater === 'function'
        ? updater(cloneUsers(currentUsers))
        : updater;

      return setManagedUsers(nextUsers);
    });
  };

  return [users, setUsers];
};
