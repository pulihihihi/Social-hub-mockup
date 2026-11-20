import { describe, expect, it } from 'vitest';
import {
  getSidebarMenuTree,
  getSidebarOpenKeys,
  SIDEBAR_PARENT_KEYS,
  SIDEBAR_PUBLISHING_CHILD_KEYS,
  SIDEBAR_SMART_INBOX_CHILD_KEYS,
  SIDEBAR_SETTINGS_CHILD_KEYS,
  SIDEBAR_TOP_LEVEL_KEYS,
} from '../src/app/layout/sidebarMenu';

describe('sidebar menu tree', () => {
  it('keeps the workflow-first top-level navigation order', () => {
    const menuTree = getSidebarMenuTree();

    expect(menuTree.map((item) => item.key)).toEqual(SIDEBAR_TOP_LEVEL_KEYS);
    expect(menuTree.map((item) => item.name)).toEqual([
      'Publishing',
      'Smart Inbox',
      'Bots',
      'Alerts',
      'Settings',
    ]);
  });

  it('groups Smart Inbox pages under Smart Inbox', () => {
    const menuTree = getSidebarMenuTree();
    const smartInboxItem = menuTree.find((item) => item.key === SIDEBAR_PARENT_KEYS.SMART_INBOX);

    expect(smartInboxItem?.children?.map((item) => item.key)).toEqual(SIDEBAR_SMART_INBOX_CHILD_KEYS);
    expect(smartInboxItem?.children?.map((item) => item.name)).toEqual([
      'All Messages',
      'Private',
      'Completed',
      'Saved Messages',
      'Reply Approvals',
    ]);
  });

  it('groups publishing pages under Publishing', () => {
    const menuTree = getSidebarMenuTree();
    const publishingItem = menuTree.find((item) => item.key === SIDEBAR_PARENT_KEYS.PUBLISHING);

    expect(publishingItem?.children?.map((item) => item.key)).toEqual(SIDEBAR_PUBLISHING_CHILD_KEYS);
    expect(publishingItem?.children?.map((item) => item.name)).toEqual([
      'Calendar',
      'New Post',
      'Drafts',
      'Needs Approval',
      'Rejected',
      'Failed Posts',
      'Deleted Posts',
      'Asset Library',
    ]);
  });

  it('groups admin pages under Settings and keeps retired pages out of the sidebar', () => {
    const menuTree = getSidebarMenuTree();
    const settingsItem = menuTree.find((item) => item.key === SIDEBAR_PARENT_KEYS.SETTINGS);

    expect(settingsItem?.children?.map((item) => item.key)).toEqual(SIDEBAR_SETTINGS_CHILD_KEYS);
    expect(settingsItem?.children?.map((item) => item.name)).toEqual([
      'Channels',
      'Tag Management',
      'Approval Workflows',
      'Notifications',
      'AI Skill',
      'Access',
    ]);

    const allMenuKeys = menuTree.flatMap((item) => [item.key, ...(item.children?.map((child) => child.key) ?? [])]);
    expect(allMenuKeys).not.toContain('active_topics');
    expect(allMenuKeys).not.toContain('create_topic');
    expect(allMenuKeys).not.toContain('reports');
  });

  it('auto-opens parent groups when a child route is active', () => {
    expect(getSidebarOpenKeys('/messages/smart')).toEqual(['/messages']);
    expect(getSidebarOpenKeys('/messages/private')).toEqual(['/messages']);
    expect(getSidebarOpenKeys('/messages/completed')).toEqual(['/messages']);
    expect(getSidebarOpenKeys('/messages/saved')).toEqual(['/messages']);
    expect(getSidebarOpenKeys('/messages/reply-approvals')).toEqual(['/messages']);
    expect(getSidebarOpenKeys('/publishing/new-post')).toEqual(['/publishing']);
    expect(getSidebarOpenKeys('/publishing/calendar')).toEqual(['/publishing']);
    expect(getSidebarOpenKeys('/publishing/drafts')).toEqual(['/publishing']);
    expect(getSidebarOpenKeys('/publishing/needs-approval')).toEqual(['/publishing']);
    expect(getSidebarOpenKeys('/publishing/rejected')).toEqual(['/publishing']);
    expect(getSidebarOpenKeys('/publishing/failedposts')).toEqual(['/publishing']);
    expect(getSidebarOpenKeys('/publishing/deletedposts')).toEqual(['/publishing']);
    expect(getSidebarOpenKeys('/publishing/campaigns/active')).toEqual(['/publishing']);
    expect(getSidebarOpenKeys('/publishing/campaigns/archived')).toEqual(['/publishing']);
    expect(getSidebarOpenKeys('/publishing/campaigns/assets')).toEqual(['/publishing']);
    expect(getSidebarOpenKeys('/publishing/asset-library')).toEqual(['/publishing']);
    expect(getSidebarOpenKeys('/settings/channels')).toEqual(['/settings']);
    expect(getSidebarOpenKeys('/settings/tag-management')).toEqual(['/settings']);
    expect(getSidebarOpenKeys('/settings/approval-workflows')).toEqual(['/settings']);
    expect(getSidebarOpenKeys('/settings/system')).toEqual(['/settings']);
  });
});
