import { describe, expect, it } from 'vitest';
import {
  ASSET_RULE_MESSAGES,
  getMediaAssetGuidanceItems,
  getPublishingAssetValidationItems,
} from '../src/pages/PublishingNewPost/publishingAssetRules';

const mixedMedia = [
  { id: 'image-1', type: 'image' },
  { id: 'video-1', type: 'video', width: 2160 },
];

describe('publishing asset rules', () => {
  it('centralizes mixed-media and Instagram creative errors for the footer', () => {
    const items = getPublishingAssetValidationItems({
      contentType: 'mixed',
      hasVideo: true,
      media: mixedMedia,
      networkKeys: ['facebook', 'instagram', 'threads'],
    });

    expect(items.map((item) => item.key)).toEqual([
      'facebook-mixed-media',
      'instagram-video-width',
      'instagram-image-aspect',
      'threads-mixed-media',
    ]);
    expect(items.find((item) => item.key === 'facebook-mixed-media')).toMatchObject({
      message: 'Facebook',
      description: ASSET_RULE_MESSAGES.mixedMedia,
    });
  });

  it('returns per-creative guidance used by media thumbnail tooltips', () => {
    expect(getMediaAssetGuidanceItems({
      media: mixedMedia,
      mediaItem: mixedMedia[0],
      networkKeys: ['instagram', 'threads'],
    })[0]).toMatchObject({
      message: 'Instagram',
      description: ASSET_RULE_MESSAGES.instagramImageAspect,
    });

    expect(getMediaAssetGuidanceItems({
      media: mixedMedia,
      mediaItem: mixedMedia[1],
      networkKeys: ['instagram'],
    })[0]).toMatchObject({
      message: 'Instagram',
      description: ASSET_RULE_MESSAGES.instagramVideoWidth,
    });
  });
});
