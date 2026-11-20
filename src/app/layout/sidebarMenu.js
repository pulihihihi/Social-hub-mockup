import { EditOutlined, InboxOutlined, SettingOutlined } from '@ant-design/icons';
import { APP_ROUTE_META, PAGE_KEYS } from '../routes';

const ROUTE_BY_KEY = Object.fromEntries(APP_ROUTE_META.map((route) => [route.key, route]));

export const SIDEBAR_PARENT_KEYS = {
  SMART_INBOX: 'smart_inbox',
  PUBLISHING: 'publishing',
  SETTINGS: 'settings',
};

export const SIDEBAR_TOP_LEVEL_KEYS = [
  SIDEBAR_PARENT_KEYS.PUBLISHING,
  SIDEBAR_PARENT_KEYS.SMART_INBOX,
  PAGE_KEYS.BOTS,
  PAGE_KEYS.ALERTS,
  SIDEBAR_PARENT_KEYS.SETTINGS,
];

export const SIDEBAR_SMART_INBOX_CHILD_KEYS = [
  PAGE_KEYS.SMART_INBOX_ALL_MESSAGES,
  PAGE_KEYS.SMART_INBOX_PRIVATE,
  PAGE_KEYS.SMART_INBOX_COMPLETED,
  PAGE_KEYS.SMART_INBOX_SAVED_MESSAGES,
  PAGE_KEYS.SMART_INBOX_REPLY_APPROVALS,
];

export const SIDEBAR_PUBLISHING_CHILD_KEYS = [
  PAGE_KEYS.PUBLISHING_CALENDAR,
  PAGE_KEYS.PUBLISHING_NEW_POST,
  PAGE_KEYS.PUBLISHING_DRAFTS,
  PAGE_KEYS.PUBLISHING_NEEDS_APPROVAL,
  PAGE_KEYS.PUBLISHING_REJECTED,
  PAGE_KEYS.PUBLISHING_FAILED_POSTS,
  PAGE_KEYS.PUBLISHING_DELETED_POSTS,
  PAGE_KEYS.PUBLISHING_ASSET_LIBRARY,
];

export const SIDEBAR_SETTINGS_CHILD_KEYS = [
  PAGE_KEYS.CHANNELS,
  PAGE_KEYS.TAG_MANAGEMENT,
  PAGE_KEYS.APPROVAL_WORKFLOWS,
  PAGE_KEYS.NOTIFICATIONS,
  PAGE_KEYS.AI_SKILL,
  PAGE_KEYS.SYSTEM,
];

const getRouteByKey = (key) => {
  const route = ROUTE_BY_KEY[key];

  if (!route) {
    throw new Error(`Unknown sidebar route key: ${key}`);
  }

  return route;
};

const toMenuNode = (route) => ({
  key: route.key,
  path: route.path,
  name: route.label,
  icon: route.menuIcon,
});

export const getSidebarMenuTree = () => [
  {
    key: SIDEBAR_PARENT_KEYS.PUBLISHING,
    path: '/publishing',
    name: 'Publishing',
    icon: EditOutlined,
    children: SIDEBAR_PUBLISHING_CHILD_KEYS.map((key) => toMenuNode(getRouteByKey(key))),
  },
  {
    key: SIDEBAR_PARENT_KEYS.SMART_INBOX,
    path: '/messages',
    name: 'Smart Inbox',
    icon: InboxOutlined,
    children: SIDEBAR_SMART_INBOX_CHILD_KEYS.map((key) => toMenuNode(getRouteByKey(key))),
  },
  toMenuNode(getRouteByKey(PAGE_KEYS.BOTS)),
  toMenuNode(getRouteByKey(PAGE_KEYS.ALERTS)),
  {
    key: SIDEBAR_PARENT_KEYS.SETTINGS,
    path: '/settings',
    name: 'Settings',
    icon: SettingOutlined,
    children: SIDEBAR_SETTINGS_CHILD_KEYS.map((key) => toMenuNode(getRouteByKey(key))),
  },
];

export const getSidebarOpenKeys = (pathname) => {
  return [
    pathname.startsWith('/messages/') ? '/messages' : null,
    pathname.startsWith('/publishing/') ? '/publishing' : null,
    pathname.startsWith('/settings/') ? '/settings' : null,
  ].filter(Boolean);
};
