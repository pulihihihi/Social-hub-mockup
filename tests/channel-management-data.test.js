import { describe, expect, it } from 'vitest';
import {
  MANAGED_CHANNEL_GROUPS,
  MANAGED_CHANNELS,
  getDisconnectedManagedChannelCount,
  getChannelGroupColorMeta,
  getManagedChannelGroupNames,
  isManagedChannelDisconnected,
} from '../src/data/channelManagement';

describe('channel management data', () => {
  it('counts the disconnected channels shown by Settings > Channels', () => {
    expect(getDisconnectedManagedChannelCount(MANAGED_CHANNELS)).toBe(3);
  });

  it('treats disabled or disconnected health channels as disconnected', () => {
    expect(isManagedChannelDisconnected({ disabled: true, health: 'CONNECTED' })).toBe(true);
    expect(isManagedChannelDisconnected({ disabled: false, health: 'DISCONNECTED' })).toBe(true);
    expect(isManagedChannelDisconnected({ disabled: false, health: 'CONNECTED' })).toBe(false);
  });

  it('allows one channel to belong to multiple channel groups', () => {
    const deltaFacebook = MANAGED_CHANNELS.find((channel) => channel.id === 'fb-delta-main');

    expect(getManagedChannelGroupNames(deltaFacebook)).toEqual([
      'Garena Delta Force VN',
      'Delta Force Launch',
    ]);
  });

  it('assigns ant design preset colors to the managed channel groups', () => {
    expect(MANAGED_CHANNEL_GROUPS.map((group) => group.color)).toEqual([
      'volcano',
      'blue',
      'gold',
    ]);
    expect(getChannelGroupColorMeta(MANAGED_CHANNEL_GROUPS[0].color, MANAGED_CHANNEL_GROUPS[0].name).solid).toBe('#fa541c');
  });
});
