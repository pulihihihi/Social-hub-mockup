import { C } from '../theme';

export const PLATFORM_ICON_CONTRACT = {
  defaultSize: 18,
  sizes: {
    compact: 16,
    inline: 18,
    chip: 18,
    row: 18,
    preview: 18,
    tab: 20,
  },
  colors: {
    facebook: C.facebook,
    fbGroup: C.fbGroup,
    instagram: C.instagram,
    threads: C.threads,
    tiktok: C.tiktok,
    youtube: C.youtube,
  },
};

export const getPlatformIconSize = (size = PLATFORM_ICON_CONTRACT.defaultSize) => (
  typeof size === 'number'
    ? size
    : PLATFORM_ICON_CONTRACT.sizes[size] || PLATFORM_ICON_CONTRACT.defaultSize
);
