import { describe, expect, it } from 'vitest';
import {
  APP_ROUTE_META,
  DEFAULT_PAGE_KEY,
  DEFAULT_ROUTE_PATH,
  getRouteMetaByPath,
  PAGE_KEYS,
  ROUTE_PATH_BY_KEY,
} from '../src/app/routes';

describe('app route manifest', () => {
  it('defines the expected app routes and compatibility aliases', () => {
    expect(APP_ROUTE_META.map((route) => route.path)).toEqual([
      '/messages/smart',
      '/messages/private',
      '/messages/completed',
      '/messages/saved',
      '/messages/reply-approvals',
      '/publishing/new-post',
      '/publishing/calendar',
      '/publishing/drafts',
      '/publishing/needs-approval',
      '/publishing/rejected',
      '/publishing/failedposts',
      '/publishing/deletedposts',
      '/publishing/campaigns/active',
      '/publishing/campaigns/archived',
      '/publishing/campaigns/new',
      '/publishing/campaigns/planner/:campaignId',
      '/publishing/asset-library',
      '/bots',
      '/alerts',
      '/settings/channels',
      '/settings/tag-management',
      '/settings/approval-workflows',
      '/settings/notifications',
      '/settings/ai-skill',
      '/settings/system',
    ]);

    expect(DEFAULT_PAGE_KEY).toBe(PAGE_KEYS.PUBLISHING_CALENDAR);
    expect(DEFAULT_ROUTE_PATH).toBe('/publishing/calendar');
    expect(ROUTE_PATH_BY_KEY[PAGE_KEYS.SMART_INBOX_ALL_MESSAGES]).toBe('/messages/smart');
    expect(ROUTE_PATH_BY_KEY[PAGE_KEYS.SMART_INBOX_PRIVATE]).toBe('/messages/private');
    expect(ROUTE_PATH_BY_KEY[PAGE_KEYS.SMART_INBOX_COMPLETED]).toBe('/messages/completed');
    expect(ROUTE_PATH_BY_KEY[PAGE_KEYS.SMART_INBOX_SAVED_MESSAGES]).toBe('/messages/saved');
    expect(ROUTE_PATH_BY_KEY[PAGE_KEYS.SMART_INBOX_REPLY_APPROVALS]).toBe('/messages/reply-approvals');
    expect(ROUTE_PATH_BY_KEY[PAGE_KEYS.PUBLISHING_NEW_POST]).toBe('/publishing/new-post');
    expect(ROUTE_PATH_BY_KEY[PAGE_KEYS.PUBLISHING_CALENDAR]).toBe('/publishing/calendar');
    expect(ROUTE_PATH_BY_KEY[PAGE_KEYS.PUBLISHING_DRAFTS]).toBe('/publishing/drafts');
    expect(ROUTE_PATH_BY_KEY[PAGE_KEYS.PUBLISHING_NEEDS_APPROVAL]).toBe('/publishing/needs-approval');
    expect(ROUTE_PATH_BY_KEY[PAGE_KEYS.PUBLISHING_REJECTED]).toBe('/publishing/rejected');
    expect(ROUTE_PATH_BY_KEY[PAGE_KEYS.PUBLISHING_FAILED_POSTS]).toBe('/publishing/failedposts');
    expect(ROUTE_PATH_BY_KEY[PAGE_KEYS.PUBLISHING_DELETED_POSTS]).toBe('/publishing/deletedposts');
    expect(ROUTE_PATH_BY_KEY[PAGE_KEYS.PUBLISHING_CAMPAIGNS_ACTIVE]).toBe('/publishing/campaigns/active');
    expect(ROUTE_PATH_BY_KEY[PAGE_KEYS.PUBLISHING_CAMPAIGNS_ARCHIVED]).toBe('/publishing/campaigns/archived');
    expect(ROUTE_PATH_BY_KEY[PAGE_KEYS.PUBLISHING_CAMPAIGN_CREATE]).toBe('/publishing/campaigns/new');
    expect(ROUTE_PATH_BY_KEY[PAGE_KEYS.PUBLISHING_CAMPAIGN_PLANNER]).toBe('/publishing/campaigns/planner/:campaignId');
    expect(ROUTE_PATH_BY_KEY[PAGE_KEYS.PUBLISHING_ASSET_LIBRARY]).toBe('/publishing/asset-library');
    expect(ROUTE_PATH_BY_KEY[PAGE_KEYS.BOTS]).toBe('/bots');
    expect(ROUTE_PATH_BY_KEY[PAGE_KEYS.TAG_MANAGEMENT]).toBe('/settings/tag-management');
    expect(ROUTE_PATH_BY_KEY[PAGE_KEYS.APPROVAL_WORKFLOWS]).toBe('/settings/approval-workflows');
    expect(getRouteMetaByPath('/settings/system')?.key).toBe(PAGE_KEYS.SYSTEM);
    expect(getRouteMetaByPath('/topics/t1/edit')).toBeNull();
    expect(getRouteMetaByPath('/reports')).toBeNull();
    expect(getRouteMetaByPath('/messages')?.key).toBe(PAGE_KEYS.SMART_INBOX_ALL_MESSAGES);
    expect(getRouteMetaByPath('/smart-inbox/all-messages')?.key).toBe(PAGE_KEYS.SMART_INBOX_ALL_MESSAGES);
    expect(getRouteMetaByPath('/smart-inbox/private')?.key).toBe(PAGE_KEYS.SMART_INBOX_PRIVATE);
    expect(getRouteMetaByPath('/smart-inbox/completed')?.key).toBe(PAGE_KEYS.SMART_INBOX_COMPLETED);
    expect(getRouteMetaByPath('/smart-inbox/saved-messages')?.key).toBe(PAGE_KEYS.SMART_INBOX_SAVED_MESSAGES);
    expect(getRouteMetaByPath('/smart-inbox/reply-approvals')?.key).toBe(PAGE_KEYS.SMART_INBOX_REPLY_APPROVALS);
    expect(getRouteMetaByPath('/publishing')?.key).toBe(PAGE_KEYS.PUBLISHING_CALENDAR);
    expect(getRouteMetaByPath('/publishing/campaigns/active')?.key).toBe(PAGE_KEYS.TAG_MANAGEMENT);
    expect(getRouteMetaByPath('/publishing/campaigns/archived')?.key).toBe(PAGE_KEYS.TAG_MANAGEMENT);
    expect(getRouteMetaByPath('/publishing/campaigns/new')?.key).toBe(PAGE_KEYS.TAG_MANAGEMENT);
    expect(getRouteMetaByPath('/publishing/campaigns/planner/treasure-hunt')?.key).toBe(PAGE_KEYS.PUBLISHING_CAMPAIGN_PLANNER);
    expect(getRouteMetaByPath('/publishing/campaigns/assets')?.key).toBe(PAGE_KEYS.PUBLISHING_ASSET_LIBRARY);
    expect(getRouteMetaByPath('/publishing/asset-library')?.key).toBe(PAGE_KEYS.PUBLISHING_ASSET_LIBRARY);
    expect(getRouteMetaByPath('/publishing/failed-posts')?.key).toBe(PAGE_KEYS.PUBLISHING_FAILED_POSTS);
    expect(getRouteMetaByPath('/publishing/deleted-posts')?.key).toBe(PAGE_KEYS.PUBLISHING_DELETED_POSTS);
    expect(getRouteMetaByPath('/settings/credentials')?.key).toBe(PAGE_KEYS.CHANNELS);
  });

  it('keeps pages lazily resolved from the route manifest', () => {
    for (const route of APP_ROUTE_META) {
      expect(route.component?.$$typeof).toBe(Symbol.for('react.lazy'));
    }
  });
});
