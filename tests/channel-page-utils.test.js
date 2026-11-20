import { describe, expect, it } from 'vitest';
import {
  buildChannelCountMap,
  getChannelGroupDisplay,
  getChannelGroupNames,
  getChannelGroupValue,
  getChannelLinkLabel,
  getFilteredChannelGroupRows,
  matchesChannelGroupFilter,
  removeChannelGroupValues,
  renameChannelGroupFilterValue,
  renameChannelGroupValues,
  resolveChannelsInitialTab,
} from '../src/pages/Admin/channels/pageUtils';

describe('channel page utilities', () => {
  it('resolves the channels and groups tab from URL search', () => {
    expect(resolveChannelsInitialTab('?tab=groups', 'channels')).toBe('groups');
    expect(resolveChannelsInitialTab('?tab=unknown', 'channels')).toBe('channels');
  });

  it('counts channels by group and builds sorted group rows', () => {
    const channelCountMap = buildChannelCountMap([
      { channelGroup: 'VN' },
      { channelGroups: ['VN', 'Launch'] },
      { channelGroup: 'SG' },
      { channelGroup: '' },
    ]);

    expect(channelCountMap).toEqual({ VN: 2, Launch: 1, SG: 1 });
    expect(getFilteredChannelGroupRows({
      channelCountMap,
      channelGroups: [{ id: 3, name: 'Launch' }, { id: 2, name: 'VN' }, { id: 1, name: 'SG' }],
      query: '',
    })).toEqual([
      { id: 3, name: 'Launch', channelCount: 1 },
      { id: 1, name: 'SG', channelCount: 1 },
      { id: 2, name: 'VN', channelCount: 2 },
    ]);
  });

  it('normalizes missing channel groups for inline edit cells', () => {
    const groups = [{ name: 'VN', color: 'blue' }];

    expect(getChannelGroupNames({ channelGroups: ['VN', 'VN', ''] })).toEqual(['VN']);
    expect(getChannelGroupValue(['VN', 'Missing'], groups)).toEqual(['VN']);
    expect(getChannelGroupValue('Missing', groups)).toEqual([]);
    expect(getChannelGroupDisplay('Missing', groups)).toEqual([]);
    expect(getChannelGroupDisplay(['VN'], groups)).toEqual([{ name: 'VN', color: 'blue' }]);
  });

  it('matches, renames, and removes multi-group channel memberships', () => {
    const channel = { channelGroups: ['VN', 'Launch'] };

    expect(matchesChannelGroupFilter(channel, ['Launch'])).toBe(true);
    expect(matchesChannelGroupFilter(channel, ['SG'])).toBe(false);
    expect(matchesChannelGroupFilter(channel, [])).toBe(true);
    expect(renameChannelGroupValues(channel, 'Launch', 'Campaign')).toEqual(['VN', 'Campaign']);
    expect(removeChannelGroupValues(channel, new Set(['VN']))).toEqual(['Launch']);
  });

  it('formats channel links without changing invalid text', () => {
    expect(getChannelLinkLabel('https://www.facebook.com/garena/')).toBe('facebook.com/garena');
    expect(getChannelLinkLabel('not a url')).toBe('not a url');
  });

  it('renames active channel group filters when a group is renamed', () => {
    expect(renameChannelGroupFilterValue(['Owned', 'Community'], 'Owned', 'Official')).toEqual(['Official', 'Community']);
  });
});
