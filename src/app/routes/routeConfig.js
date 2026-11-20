import React from 'react';
import { matchPath } from 'react-router-dom';
import {
  AlertOutlined,
  BellOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  FileTextOutlined,
  InboxOutlined,
  PlusOutlined,
  RobotOutlined,
  SettingOutlined,
  TagsOutlined,
  TeamOutlined,
  WarningOutlined,
} from '@ant-design/icons';

export const PAGE_KEYS = {
  SMART_INBOX_ALL_MESSAGES: 'smart_inbox_all_messages',
  SMART_INBOX_PRIVATE: 'smart_inbox_private',
  SMART_INBOX_COMPLETED: 'smart_inbox_completed',
  SMART_INBOX_SAVED_MESSAGES: 'smart_inbox_saved_messages',
  SMART_INBOX_REPLY_APPROVALS: 'smart_inbox_reply_approvals',
  PUBLISHING_NEW_POST: 'publishing_new_post',
  PUBLISHING_CALENDAR: 'publishing_calendar',
  PUBLISHING_DRAFTS: 'publishing_drafts',
  PUBLISHING_NEEDS_APPROVAL: 'publishing_needs_approval',
  PUBLISHING_REJECTED: 'publishing_rejected',
  PUBLISHING_FAILED_POSTS: 'publishing_failed_posts',
  PUBLISHING_DELETED_POSTS: 'publishing_deleted_posts',
  PUBLISHING_CAMPAIGNS_ACTIVE: 'publishing_campaigns_active',
  PUBLISHING_CAMPAIGNS_ARCHIVED: 'publishing_campaigns_archived',
  PUBLISHING_CAMPAIGN_CREATE: 'publishing_campaign_create',
  PUBLISHING_CAMPAIGN_PLANNER: 'publishing_campaign_planner',
  PUBLISHING_ASSET_LIBRARY: 'publishing_asset_library',
  BOTS: 'bots',
  ALERTS: 'alerts',
  CHANNELS: 'channels',
  TAG_MANAGEMENT: 'tag_management',
  APPROVAL_WORKFLOWS: 'approval_workflows',
  NOTIFICATIONS: 'notifications',
  AI_SKILL: 'ai_skill',
  SYSTEM: 'system',
};

const SmartInboxAllMessagesPage = React.lazy(() => import('../../pages/SmartInboxAllMessages'));
const SmartInboxPrivatePage = React.lazy(() => import('../../pages/SmartInboxPrivate'));
const SmartInboxCompletedPage = React.lazy(() => import('../../pages/SmartInboxCompleted'));
const SmartInboxSavedMessagesPage = React.lazy(() => import('../../pages/SmartInboxSavedMessages'));
const SmartInboxReplyApprovalsPage = React.lazy(() => import('../../pages/SmartInboxReplyApprovals'));
const PublishingNewPostPage = React.lazy(() => import('../../pages/PublishingNewPost'));
const PublishingCalendarPage = React.lazy(() => import('../../pages/PublishingCalendar'));
const PublishingDraftsPage = React.lazy(() => import('../../pages/PublishingDrafts'));
const PublishingNeedsApprovalPage = React.lazy(() => import('../../pages/PublishingNeedsApproval'));
const PublishingRejectedPage = React.lazy(() => import('../../pages/PublishingRejected'));
const PublishingFailedPostsPage = React.lazy(() => import('../../pages/PublishingFailedPosts'));
const PublishingDeletedPostsPage = React.lazy(() => import('../../pages/PublishingDeletedPosts'));
const PublishingCampaignsActivePage = React.lazy(() => import('../../pages/PublishingCampaignsActive'));
const PublishingCampaignsArchivedPage = React.lazy(() => import('../../pages/PublishingCampaignsArchived'));
const PublishingCampaignCreatePage = React.lazy(() => import('../../pages/PublishingCampaignCreate'));
const PublishingCampaignPlannerPage = React.lazy(() => import('../../pages/PublishingCampaignPlanner'));
const PublishingAssetLibraryPage = React.lazy(() => import('../../pages/PublishingAssetLibrary'));
const BotsPage = React.lazy(() => import('../../pages/Bots'));
const AlertsPage = React.lazy(() => import('../../pages/Alerts'));
const ChannelsPage = React.lazy(() => import('../../pages/Admin/ChannelsPage'));
const SettingsTagManagementPage = React.lazy(() => import('../../pages/SettingsTagManagement'));
const SettingsApprovalWorkflowsPage = React.lazy(() => import('../../pages/SettingsApprovalWorkflows'));
const NotificationsPage = React.lazy(() => import('../../pages/Notifications'));
const AiSkillPage = React.lazy(() => import('../../pages/AiSkill'));
const SystemPage = React.lazy(() => import('../../pages/System'));

/**
 * @typedef {object} AppRouteMeta
 * @property {string} key
 * @property {string} path
 * @property {string} label
 * @property {string | null} breadcrumbParent
 * @property {'monitoring' | 'action' | 'settings'} sidebarSection
 * @property {boolean} showInMenu
 * @property {number} menuOrder
 * @property {React.ComponentType<any> | null} menuIcon
 * @property {React.LazyExoticComponent<React.ComponentType<any>>} component
 */

/** @type {AppRouteMeta[]} */
export const APP_ROUTE_META = [
  {
    key: PAGE_KEYS.SMART_INBOX_ALL_MESSAGES,
    path: '/messages/smart',
    label: 'All Messages',
    breadcrumbParent: 'Smart Inbox',
    sidebarSection: 'action',
    showInMenu: true,
    menuOrder: 1,
    menuIcon: InboxOutlined,
    component: SmartInboxAllMessagesPage,
  },
  {
    key: PAGE_KEYS.SMART_INBOX_PRIVATE,
    path: '/messages/private',
    label: 'Private',
    breadcrumbParent: 'Smart Inbox',
    sidebarSection: 'action',
    showInMenu: true,
    menuOrder: 2,
    menuIcon: InboxOutlined,
    component: SmartInboxPrivatePage,
  },
  {
    key: PAGE_KEYS.SMART_INBOX_COMPLETED,
    path: '/messages/completed',
    label: 'Completed',
    breadcrumbParent: 'Smart Inbox',
    sidebarSection: 'action',
    showInMenu: true,
    menuOrder: 3,
    menuIcon: InboxOutlined,
    component: SmartInboxCompletedPage,
  },
  {
    key: PAGE_KEYS.SMART_INBOX_SAVED_MESSAGES,
    path: '/messages/saved',
    label: 'Saved Messages',
    breadcrumbParent: 'Smart Inbox',
    sidebarSection: 'action',
    showInMenu: true,
    menuOrder: 4,
    menuIcon: InboxOutlined,
    component: SmartInboxSavedMessagesPage,
  },
  {
    key: PAGE_KEYS.SMART_INBOX_REPLY_APPROVALS,
    path: '/messages/reply-approvals',
    label: 'Reply Approvals',
    breadcrumbParent: 'Smart Inbox',
    sidebarSection: 'action',
    showInMenu: true,
    menuOrder: 5,
    menuIcon: InboxOutlined,
    component: SmartInboxReplyApprovalsPage,
  },
  {
    key: PAGE_KEYS.PUBLISHING_NEW_POST,
    path: '/publishing/new-post',
    label: 'New Post',
    breadcrumbParent: 'Publishing',
    sidebarSection: 'action',
    showInMenu: true,
    menuOrder: 1,
    menuIcon: PlusOutlined,
    component: PublishingNewPostPage,
  },
  {
    key: PAGE_KEYS.PUBLISHING_CALENDAR,
    path: '/publishing/calendar',
    label: 'Calendar',
    breadcrumbParent: 'Publishing',
    sidebarSection: 'action',
    showInMenu: true,
    menuOrder: 2,
    menuIcon: CalendarOutlined,
    component: PublishingCalendarPage,
  },
  {
    key: PAGE_KEYS.PUBLISHING_DRAFTS,
    path: '/publishing/drafts',
    label: 'Drafts',
    breadcrumbParent: 'Publishing',
    sidebarSection: 'action',
    showInMenu: true,
    menuOrder: 3,
    menuIcon: FileTextOutlined,
    component: PublishingDraftsPage,
  },
  {
    key: PAGE_KEYS.PUBLISHING_NEEDS_APPROVAL,
    path: '/publishing/needs-approval',
    label: 'Needs Approval',
    breadcrumbParent: 'Publishing',
    sidebarSection: 'action',
    showInMenu: true,
    menuOrder: 4,
    menuIcon: CheckCircleOutlined,
    component: PublishingNeedsApprovalPage,
  },
  {
    key: PAGE_KEYS.PUBLISHING_REJECTED,
    path: '/publishing/rejected',
    label: 'Rejected',
    breadcrumbParent: 'Publishing',
    sidebarSection: 'action',
    showInMenu: true,
    menuOrder: 5,
    menuIcon: CloseCircleOutlined,
    component: PublishingRejectedPage,
  },
  {
    key: PAGE_KEYS.PUBLISHING_FAILED_POSTS,
    path: '/publishing/failedposts',
    label: 'Failed Posts',
    breadcrumbParent: 'Publishing',
    sidebarSection: 'action',
    showInMenu: true,
    menuOrder: 6,
    menuIcon: WarningOutlined,
    component: PublishingFailedPostsPage,
  },
  {
    key: PAGE_KEYS.PUBLISHING_DELETED_POSTS,
    path: '/publishing/deletedposts',
    label: 'Deleted Posts',
    breadcrumbParent: 'Publishing',
    sidebarSection: 'action',
    showInMenu: true,
    menuOrder: 7,
    menuIcon: DeleteOutlined,
    component: PublishingDeletedPostsPage,
  },
  {
    key: PAGE_KEYS.PUBLISHING_CAMPAIGNS_ACTIVE,
    path: '/publishing/campaigns/active',
    label: 'Tag Groups',
    breadcrumbParent: 'Tag Management',
    sidebarSection: 'action',
    showInMenu: false,
    menuOrder: 8,
    menuIcon: null,
    component: PublishingCampaignsActivePage,
  },
  {
    key: PAGE_KEYS.PUBLISHING_CAMPAIGNS_ARCHIVED,
    path: '/publishing/campaigns/archived',
    label: 'Archived Tag Groups',
    breadcrumbParent: 'Tag Management',
    sidebarSection: 'action',
    showInMenu: false,
    menuOrder: 9,
    menuIcon: null,
    component: PublishingCampaignsArchivedPage,
  },
  {
    key: PAGE_KEYS.PUBLISHING_CAMPAIGN_CREATE,
    path: '/publishing/campaigns/new',
    label: 'Add Tag Group',
    breadcrumbParent: 'Tag Management',
    sidebarSection: 'action',
    showInMenu: false,
    menuOrder: 0,
    menuIcon: null,
    component: PublishingCampaignCreatePage,
  },
  {
    key: PAGE_KEYS.PUBLISHING_CAMPAIGN_PLANNER,
    path: '/publishing/campaigns/planner/:campaignId',
    label: 'Tag Group Planner',
    breadcrumbParent: 'Tag Management',
    sidebarSection: 'action',
    showInMenu: false,
    menuOrder: 0,
    menuIcon: null,
    component: PublishingCampaignPlannerPage,
  },
  {
    key: PAGE_KEYS.PUBLISHING_ASSET_LIBRARY,
    path: '/publishing/asset-library',
    label: 'Asset Library',
    breadcrumbParent: 'Publishing',
    sidebarSection: 'action',
    showInMenu: true,
    menuOrder: 10,
    menuIcon: null,
    component: PublishingAssetLibraryPage,
  },
  {
    key: PAGE_KEYS.BOTS,
    path: '/bots',
    label: 'Bots',
    breadcrumbParent: null,
    sidebarSection: 'action',
    showInMenu: true,
    menuOrder: 11,
    menuIcon: RobotOutlined,
    component: BotsPage,
  },
  {
    key: PAGE_KEYS.ALERTS,
    path: '/alerts',
    label: 'Alerts',
    breadcrumbParent: 'Settings',
    sidebarSection: 'action',
    showInMenu: true,
    menuOrder: 1,
    menuIcon: AlertOutlined,
    component: AlertsPage,
  },
  {
    key: PAGE_KEYS.CHANNELS,
    path: '/settings/channels',
    label: 'Channels',
    breadcrumbParent: 'Settings',
    sidebarSection: 'settings',
    showInMenu: true,
    menuOrder: 1,
    menuIcon: SettingOutlined,
    component: ChannelsPage,
  },
  {
    key: PAGE_KEYS.TAG_MANAGEMENT,
    path: '/settings/tag-management',
    label: 'Tag Management',
    breadcrumbParent: 'Settings',
    sidebarSection: 'settings',
    showInMenu: true,
    menuOrder: 3,
    menuIcon: TagsOutlined,
    component: SettingsTagManagementPage,
  },
  {
    key: PAGE_KEYS.APPROVAL_WORKFLOWS,
    path: '/settings/approval-workflows',
    label: 'Approval Workflows',
    breadcrumbParent: 'Settings',
    sidebarSection: 'settings',
    showInMenu: true,
    menuOrder: 4,
    menuIcon: CheckCircleOutlined,
    component: SettingsApprovalWorkflowsPage,
  },
  {
    key: PAGE_KEYS.NOTIFICATIONS,
    path: '/settings/notifications',
    label: 'Notifications',
    breadcrumbParent: 'Settings',
    sidebarSection: 'settings',
    showInMenu: true,
    menuOrder: 5,
    menuIcon: BellOutlined,
    component: NotificationsPage,
  },
  {
    key: PAGE_KEYS.AI_SKILL,
    path: '/settings/ai-skill',
    label: 'AI Skill',
    breadcrumbParent: 'Settings',
    sidebarSection: 'settings',
    showInMenu: true,
    menuOrder: 6,
    menuIcon: RobotOutlined,
    component: AiSkillPage,
  },
  {
    key: PAGE_KEYS.SYSTEM,
    path: '/settings/system',
    label: 'Access',
    breadcrumbParent: 'Settings',
    sidebarSection: 'settings',
    showInMenu: true,
    menuOrder: 7,
    menuIcon: TeamOutlined,
    component: SystemPage,
  },
];

export const ROUTE_ALIASES = {
  '/messages': '/messages/smart',
  '/smart-inbox/all-messages': '/messages/smart',
  '/smart-inbox/private': '/messages/private',
  '/smart-inbox/completed': '/messages/completed',
  '/smart-inbox/saved-messages': '/messages/saved',
  '/smart-inbox/reply-approvals': '/messages/reply-approvals',
  '/publishing': '/publishing/calendar',
  '/publishing/campaigns/active': '/settings/tag-management?tab=groups&status=active',
  '/publishing/campaigns/archived': '/settings/tag-management?tab=groups&status=archived',
  '/publishing/campaigns/new': '/settings/tag-management?tab=groups&action=add',
  '/publishing/campaigns/assets': '/publishing/asset-library',
  '/publishing/failed-posts': '/publishing/failedposts',
  '/publishing/deleted-posts': '/publishing/deletedposts',
  '/settings/credentials': '/settings/channels',
};

export const ROUTE_PATH_BY_KEY = Object.fromEntries(APP_ROUTE_META.map((route) => [route.key, route.path]));
export const ROUTE_META_BY_KEY = Object.fromEntries(APP_ROUTE_META.map((route) => [route.key, route]));
export const ROUTE_META_BY_PATH = Object.fromEntries(APP_ROUTE_META.map((route) => [route.path, route]));

export const DEFAULT_PAGE_KEY = PAGE_KEYS.PUBLISHING_CALENDAR;
export const DEFAULT_ROUTE_PATH = ROUTE_PATH_BY_KEY[DEFAULT_PAGE_KEY];

const stripRouteSearch = (path = '') => path.split(/[?#]/)[0];

export const getRouteMetaByKey = (key) => ROUTE_META_BY_KEY[key] || ROUTE_META_BY_KEY[DEFAULT_PAGE_KEY];
export const getRouteMetaByPath = (pathname) => {
  const resolvedPath = stripRouteSearch(ROUTE_ALIASES[pathname] || pathname);

  return (
    ROUTE_META_BY_PATH[resolvedPath]
    || APP_ROUTE_META.find((route) => matchPath({ path: route.path, end: true }, resolvedPath))
    || null
  );
};
