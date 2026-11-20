export const MOCK_MEDIA_PUBLIC_PATH = '/assets/mock-media';

const withPath = (fileName) => `${MOCK_MEDIA_PUBLIC_PATH}/${fileName}`;

export const MOCK_MEDIA_IMAGES = [
  {
    id: 'mock-image-edward-jenner-4249592',
    type: 'image',
    name: 'pexels-edward-jenner-4249592.jpg',
    title: 'Workspace Color Layout',
    src: withPath('pexels-edward-jenner-4249592.jpg'),
    alt: 'Overhead layout of light color swatches on a desk.',
    meta: 'JPG image',
    aspectRatio: '4:5',
    sizeLabel: '4.1 MB',
  },
  {
    id: 'mock-image-karola-g-4968693',
    type: 'image',
    name: 'pexels-karola-g-4968693.jpg',
    title: 'Neutral Swatch Hand',
    src: withPath('pexels-karola-g-4968693.jpg'),
    alt: 'A hand holding neutral paper swatches on a marble desk.',
    meta: 'JPG image',
    aspectRatio: '4:5',
    sizeLabel: '1.2 MB',
  },
  {
    id: 'mock-image-karola-g-4968698',
    type: 'image',
    name: 'pexels-karola-g-4968698.jpg',
    title: 'Paper Texture Stack',
    src: withPath('pexels-karola-g-4968698.jpg'),
    alt: 'Neutral paper textures arranged on a marble surface.',
    meta: 'JPG image',
    aspectRatio: '4:5',
    sizeLabel: '1.6 MB',
  },
  {
    id: 'mock-image-kienvirak-36928656',
    type: 'image',
    name: 'pexels-kienvirak-36928656.jpg',
    title: 'Mountain Landscape',
    src: withPath('pexels-kienvirak-36928656.jpg'),
    alt: 'Mountain landscape with blue sky and green valley.',
    meta: 'JPG image',
    aspectRatio: '16:9',
    sizeLabel: '768 KB',
  },
  {
    id: 'mock-image-tima-miroshnichenko-6474454',
    type: 'image',
    name: 'pexels-tima-miroshnichenko-6474454.jpg',
    title: 'Fan Creative',
    src: withPath('pexels-tima-miroshnichenko-6474454.jpg'),
    alt: 'A hand holding a fan-shaped object in soft light.',
    meta: 'JPG image',
    aspectRatio: '4:5',
    sizeLabel: '2.5 MB',
  },
];

export const MOCK_MEDIA_VIDEOS = [
  {
    id: 'mock-video-thang-diien',
    type: 'video',
    name: 'thang diien.mp4',
    title: 'Thang Diien Gameplay Audio',
    src: withPath('thang diien.mp4'),
    meta: '1920 x 1080 MP4 with audio',
    duration: '4:46',
    aspectRatio: '16:9',
    format: 'MP4',
    width: 1920,
    height: 1080,
    sizeLabel: '13.6 MB',
    hasAudio: true,
  },
  {
    id: 'mock-video-10202814',
    type: 'video',
    name: '10202814-uhd_2160_4096_25fps.mp4',
    title: 'Portrait Product Motion',
    src: withPath('10202814-uhd_2160_4096_25fps.mp4'),
    meta: '2160 x 4096 MP4',
    duration: '0:15',
    aspectRatio: '9:16',
    format: 'MP4',
    width: 2160,
    height: 4096,
    sizeLabel: '44.3 MB',
  },
];

export const MOCK_MEDIA_ASSETS = [
  ...MOCK_MEDIA_IMAGES,
  ...MOCK_MEDIA_VIDEOS,
];

export const getMockMediaAsset = (type = 'image', index = 0) => {
  const list = type === 'video' ? MOCK_MEDIA_VIDEOS : MOCK_MEDIA_IMAGES;
  const safeIndex = Math.abs(index) % list.length;

  return list[safeIndex];
};

export const MOCK_MEDIA_ASSET_LIBRARY_ITEMS = MOCK_MEDIA_ASSETS.map((asset, index) => ({
  id: `asset-${asset.id}`,
  name: asset.name,
  type: asset.type,
  context: ['compose'],
  tags: ['Mock Media', asset.type === 'video' ? 'Video' : 'Image'],
  content: `${asset.title}, ${asset.meta}`,
  date: `${9 - Math.min(index, 8)} May 2026`,
  author: 'MXT',
  src: asset.src,
  mediaAsset: asset,
  tone: asset.type === 'video' ? 'blue' : 'green',
}));
