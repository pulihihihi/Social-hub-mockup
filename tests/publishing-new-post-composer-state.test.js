import { describe, expect, it } from 'vitest';
import dayjs from 'dayjs';
import {
  appendMediaItem,
  collapsePerNetworkMedia,
  collapsePerNetworkCaptions,
  createMediaItem,
  fillPerNetworkMedia,
  fillPerNetworkCaptions,
  hasComposerChanges,
  MAX_MEDIA_ITEMS,
  removeMediaItem,
  reorderMediaItem,
} from '../src/pages/PublishingNewPost/composerState';
import {
  canUseFirstCommentForNetworks,
  canUseInstagramStory,
  getActiveScheduledTimes,
  getCaptionForNetwork,
  getMediaContentType,
  getScheduleActionState,
} from '../src/pages/PublishingNewPost/publishingComposerUtils';
import {
  applyOptimalTimeToDate,
  canUseOptimalTimes,
} from '../src/pages/PublishingNewPost/publishingScheduleUtils';

const defaultVideoDetails = {
  facebookPlacement: 'standard',
  youtubePrivacy: 'public',
};

const cleanComposerState = {
  approvalWorkflow: null,
  captions: { all: '', facebook: '', instagram: '' },
  defaultVideoDetails,
  firstComment: '',
  isDraft: false,
  isStory: false,
  labels: [],
  media: [],
  mobilePublisher: null,
  mode: 'all_networks',
  networkOrder: ['facebook', 'instagram'],
  scheduleByNetwork: false,
  scheduleMode: 'specific',
  scheduledTimes: [{ date: null, time: null }],
  videoDetails: defaultVideoDetails,
  youtubeAudience: 'not-made-for-kids',
  youtubeTitle: '',
};

describe('PublishingNewPost composer state helpers', () => {
  it('creates image and video media records with stable mock metadata', () => {
    expect(createMediaItem({ createId: () => 'media-1', type: 'image' })).toMatchObject({
      id: 'media-1',
      type: 'image',
      label: 'Image',
      sourceName: 'pexels-edward-jenner-4249592.jpg',
      src: '/assets/mock-media/pexels-edward-jenner-4249592.jpg',
    });

    expect(createMediaItem({ createId: () => 'media-2', type: 'video' })).toMatchObject({
      id: 'media-2',
      type: 'video',
      label: 'Video',
      sourceName: 'thang diien.mp4',
      src: '/assets/mock-media/thang diien.mp4',
      duration: '4:46',
      aspectRatio: '16:9',
      format: 'MP4',
    });
  });

  it('preserves direct upload metadata on created media records', () => {
    expect(createMediaItem({
      asset: {
        id: 'local-video-upload',
        type: 'video',
        name: 'uploaded-clip.mp4',
        src: 'blob:uploaded-clip',
        duration: '0:42',
        aspectRatio: '16:9',
        format: 'MP4',
        height: 1080,
        isLocalUpload: true,
        poster: 'blob:uploaded-poster',
        sizeLabel: '8 MB',
        width: 1920,
      },
      createId: () => 'media-upload',
      label: 'uploaded-clip.mp4',
      type: 'video',
    })).toMatchObject({
      id: 'media-upload',
      type: 'video',
      label: 'uploaded-clip.mp4',
      sourceName: 'uploaded-clip.mp4',
      src: 'blob:uploaded-clip',
      duration: '0:42',
      aspectRatio: '16:9',
      format: 'MP4',
      isLocalUpload: true,
      poster: 'blob:uploaded-poster',
      sizeLabel: '8 MB',
      width: 1920,
      height: 1080,
    });
  });

  it('blocks media additions after the composer limit', () => {
    const media = Array.from({ length: MAX_MEDIA_ITEMS }, (_, index) => ({
      id: `media-${index}`,
      type: 'image',
      label: 'Image',
    }));

    const result = appendMediaItem(media, { createId: () => 'media-overflow' });

    expect(result.rejected).toBe(true);
    expect(result.media).toBe(media);
  });

  it('uses immutable add/remove updates for media', () => {
    const first = appendMediaItem([], { createId: () => 'media-1', type: 'image' });
    const second = appendMediaItem(first.media, { createId: () => 'media-2', type: 'video' });

    expect(first.media).toHaveLength(1);
    expect(second.media).toHaveLength(2);
    expect(removeMediaItem(second.media, 'media-1')).toEqual([second.media[1]]);
  });

  it('reorders media by dragging one item to another item position', () => {
    const media = [
      { id: 'image-1', type: 'image' },
      { id: 'image-2', type: 'image' },
      { id: 'image-3', type: 'image' },
    ];

    expect(reorderMediaItem(media, 'image-1', 'image-3').map((item) => item.id)).toEqual([
      'image-2',
      'image-3',
      'image-1',
    ]);
    expect(reorderMediaItem(media, 'missing', 'image-3')).toBe(media);
  });

  it('seeds independent media copies for per-network editing', () => {
    const sharedMedia = [
      { id: 'image-1', type: 'image', label: 'Image 1' },
      { id: 'image-2', type: 'image', label: 'Image 2' },
    ];

    const mediaByNetwork = fillPerNetworkMedia({
      networkKeys: ['facebook', 'instagram'],
      sharedMedia,
    });

    expect(mediaByNetwork.facebook.map((item) => item.id)).toEqual([
      'facebook-image-1-0',
      'facebook-image-2-1',
    ]);
    expect(mediaByNetwork.instagram.map((item) => item.id)).toEqual([
      'instagram-image-1-0',
      'instagram-image-2-1',
    ]);
    expect(mediaByNetwork.facebook[0]).toMatchObject({
      label: 'Image 1',
      sourceMediaId: 'image-1',
    });
    expect(collapsePerNetworkMedia({
      activeNetwork: 'instagram',
      mediaByNetwork,
      sharedMedia,
    })).toBe(mediaByNetwork.instagram);
  });

  it('preserves all shared videos when seeding per-network media', () => {
    const sharedMedia = [
      { id: 'video-1', type: 'video', label: 'Video 1' },
      { id: 'video-2', type: 'video', label: 'Video 2' },
    ];

    const mediaByNetwork = fillPerNetworkMedia({
      networkKeys: ['facebook', 'instagram'],
      sharedMedia,
    });

    expect(mediaByNetwork.facebook).toHaveLength(2);
    expect(mediaByNetwork.instagram).toHaveLength(2);
    expect(mediaByNetwork.facebook.map((item) => item.sourceMediaId)).toEqual(['video-1', 'video-2']);
    expect(mediaByNetwork.instagram.map((item) => item.sourceMediaId)).toEqual(['video-1', 'video-2']);
  });

  it('hydrates per-network captions from the all-networks caption', () => {
    const captions = fillPerNetworkCaptions({
      captions: { all: 'Launch today', facebook: '', instagram: 'IG copy' },
      networkKeys: ['facebook', 'instagram'],
    });

    expect(captions.facebook).toBe('Launch today');
    expect(captions.instagram).toBe('IG copy');
  });

  it('collapses per-network captions back to all-networks copy', () => {
    expect(collapsePerNetworkCaptions({
      activeNetwork: 'instagram',
      captions: { all: 'Base copy', instagram: 'IG copy' },
    })).toMatchObject({
      all: 'IG copy',
      instagram: 'IG copy',
    });
  });

  it('resolves caption text for all-network and per-network modes', () => {
    const captions = { all: 'Base copy', facebook: '', instagram: 'IG copy' };

    expect(getCaptionForNetwork({
      activeNetwork: 'instagram',
      captions,
      mode: 'all_networks',
    })).toBe('Base copy');
    expect(getCaptionForNetwork({
      activeNetwork: 'instagram',
      captions,
      mode: 'per_network',
    })).toBe('IG copy');
    expect(getCaptionForNetwork({
      activeNetwork: 'facebook',
      captions,
      mode: 'per_network',
    })).toBe('');
  });

  it('classifies mixed, image-only, video-only, and empty media sets', () => {
    expect(getMediaContentType([])).toBe('empty');
    expect(getMediaContentType([{ type: 'image' }])).toBe('image');
    expect(getMediaContentType([{ type: 'video' }])).toBe('video');
    expect(getMediaContentType([{ type: 'image' }, { type: 'video' }])).toBe('mixed');
  });

  it('allows stories only for one selected Instagram profile', () => {
    expect(canUseInstagramStory({
      networkKeys: ['instagram'],
      selectedChannels: [{ id: 'ig-main', platform: 'instagram' }],
    })).toBe(true);

    expect(canUseInstagramStory({
      networkKeys: ['instagram'],
      selectedChannels: [
        { id: 'ig-main', platform: 'instagram' },
        { id: 'ig-alt', platform: 'instagram' },
      ],
    })).toBe(false);

    expect(canUseInstagramStory({
      networkKeys: ['instagram', 'youtube'],
      selectedChannels: [
        { id: 'ig-main', platform: 'instagram' },
        { id: 'yt-main', platform: 'youtube' },
      ],
    })).toBe(false);
  });

  it('allows first comments only for supported social networks', () => {
    expect(canUseFirstCommentForNetworks(['facebook'])).toBe(true);
    expect(canUseFirstCommentForNetworks(['instagram'])).toBe(true);
    expect(canUseFirstCommentForNetworks(['threads', 'youtube', 'tiktok'])).toBe(false);
    expect(canUseFirstCommentForNetworks(['threads', 'facebook'])).toBe(true);
  });

  it('checks per-network schedule rows when schedule by network is enabled', () => {
    const scheduledTimes = [
      { date: '2026-05-08', time: '09:30' },
      { date: null, time: '13:15' },
      { date: '2026-05-09', time: '20:00' },
    ];

    expect(getActiveScheduledTimes({
      mode: 'per_network',
      networkKeys: ['facebook', 'instagram'],
      scheduleByNetwork: true,
      scheduledTimes,
    })).toEqual(scheduledTimes.slice(0, 2));
    expect(getScheduleActionState({
      isDraft: false,
      mode: 'per_network',
      networkKeys: ['facebook', 'instagram'],
      scheduleByNetwork: true,
      scheduleMode: 'specific',
      scheduledTimes,
    })).toMatchObject({
      scheduleLabel: 'Schedule all',
      scheduleNeedsTime: true,
    });
  });

  it('does not block draft saves when a scheduled time is incomplete', () => {
    expect(getScheduleActionState({
      isDraft: true,
      mode: 'all_networks',
      networkKeys: ['facebook'],
      scheduleByNetwork: false,
      scheduleMode: 'specific',
      scheduledTimes: [{ date: null, time: null }],
    })).toMatchObject({
      scheduleLabel: 'Save',
      scheduleNeedsTime: false,
    });
  });

  it('keeps the close confirmation clean for a pristine composer', () => {
    expect(hasComposerChanges(cleanComposerState)).toBe(false);
  });

  it('marks schedule and publishing option edits as unsaved changes', () => {
    expect(hasComposerChanges({
      ...cleanComposerState,
      isStory: true,
    })).toBe(true);

    expect(hasComposerChanges({
      ...cleanComposerState,
      scheduledTimes: [{ date: '2026-05-08', time: null }],
    })).toBe(true);

    expect(hasComposerChanges({
      ...cleanComposerState,
      labels: ['Launch'],
    })).toBe(true);

    expect(hasComposerChanges({
      ...cleanComposerState,
      videoDetails: { ...defaultVideoDetails, youtubePrivacy: 'private' },
    })).toBe(true);
  });

  it('requires a schedule date before applying optimal times', () => {
    expect(canUseOptimalTimes({ date: null, time: null })).toBe(false);

    const selectedDate = dayjs('2026-05-08T00:00:00');
    const optimalTime = applyOptimalTimeToDate(selectedDate, '13:15');

    expect(canUseOptimalTimes({ date: selectedDate, time: null })).toBe(true);
    expect(optimalTime.format('YYYY-MM-DD HH:mm')).toBe('2026-05-08 13:15');
  });
});
