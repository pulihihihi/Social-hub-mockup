import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '../src/app/AppProviders';
import { AppRouter } from '../src/app/AppRouter';
import { ComposerEditor } from '../src/pages/PublishingNewPost/PublishingComposerEditor';
import { VideoOptionsModal } from '../src/pages/PublishingNewPost/PublishingMediaModals';
import { PublishingOptions } from '../src/pages/PublishingNewPost/PublishingOptions';
import { NetworkPreview } from '../src/pages/PublishingNewPost/PublishingPreview';
import {
  ACTIVE_CHANNEL_GROUP_STORAGE_KEY,
  MANAGED_CHANNEL_GROUPS,
  MANAGED_CHANNELS,
} from '../src/data/channelManagement';

beforeEach(() => {
  window.localStorage.clear();
  window.localStorage.removeItem(ACTIVE_CHANNEL_GROUP_STORAGE_KEY);
});

const renderNewPost = () => render(
  <MemoryRouter initialEntries={['/publishing/new-post']}>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </MemoryRouter>,
);

const renderComposerEditor = (props = {}) => {
  const noop = vi.fn();
  const TestComposer = () => {
    const [isStory, setIsStory] = useState(false);

    return (
      <ComposerEditor
        activeNetwork="instagram"
        availableNetworkKeys={['instagram']}
        captions={{ all: '', instagram: '' }}
        canUseStory
        isDraft={false}
        isStory={isStory}
        media={[]}
        mode="all_networks"
        onAddMedia={noop}
        onAiAssist={noop}
        onCaptionChange={noop}
        onCustomize={noop}
        onDraftChange={noop}
        onNetworkChange={noop}
        onOpenSource={noop}
        onOpenVideoOptions={noop}
        onRemoveMedia={noop}
        onStoryChange={setIsStory}
        videoDetails={{ subtitles: 'not-added' }}
        youtubeTitle=""
        {...props}
      />
    );
  };

  return render(<TestComposer />);
};

const renderPublishingOptions = (props = {}) => {
  const noop = vi.fn();

  return render(
    <MemoryRouter>
      <PublishingOptions
        activeNetwork="instagram"
        approvalWorkflow={null}
        contentType="empty"
        firstComment=""
        hasVideo={false}
        isDraft={false}
        isStory={false}
        labels={[]}
        mobilePublisher={null}
        mode="all_networks"
        networkKeys={['instagram']}
        onFirstCommentChange={noop}
        onOpenResource={noop}
        scheduleByNetwork={false}
        scheduleMode="specific"
        scheduledTimes={[{ date: null, time: null }]}
        selectedChannels={[{ id: 'ig-main', platform: 'instagram' }]}
        setApprovalWorkflow={noop}
        setLabels={noop}
        setMobilePublisher={noop}
        setScheduleByNetwork={noop}
        setScheduleMode={noop}
        setScheduledTimes={noop}
        setYoutubeAudience={noop}
        setYoutubeTitle={noop}
        onVideoDetailsChange={noop}
        videoDetails={{ instagramShareToFeed: true }}
        youtubeAudience="not-made-for-kids"
        youtubeTitle=""
        {...props}
      />
    </MemoryRouter>,
  );
};

const previewMedia = Array.from({ length: 5 }, (_, index) => ({
  id: `image-${index + 1}`,
  type: 'image',
  label: `Image ${index + 1}`,
}));

const previewVideoMedia = [{
  id: 'video-1',
  type: 'video',
  label: 'Video 1',
  duration: '0:15',
  aspectRatio: '9:16',
  format: 'MP4',
}];

const multiVideoValidationMedia = [
  {
    id: 'uploaded-long-video',
    type: 'video',
    label: 'Uploaded long video',
    duration: '4:46',
    width: 1920,
    isLocalUpload: true,
  },
  {
    id: 'uploaded-wide-portrait-video',
    type: 'video',
    label: 'Uploaded wide portrait video',
    duration: '0:15',
    width: 2160,
    isLocalUpload: true,
  },
  {
    id: 'uploaded-third-video',
    type: 'video',
    label: 'Uploaded third video',
    duration: '0:30',
    width: 1280,
    isLocalUpload: true,
  },
];

const renderNetworkPreview = (props = {}) => render(
  <NetworkPreview
    activeNetwork="instagram"
    captions={{ all: 'Preview caption', instagram: '', threads: '', facebook: '' }}
    firstComment=""
    media={previewMedia}
    mode="all_networks"
    networkKeys={['instagram']}
    selectedChannels={[{ id: 'ig-main', platform: 'instagram', name: 'lienquanche', handle: '@lienquanche' }]}
    videoDetails={{ facebookPlacement: 'feed', instagramShareToFeed: true }}
    youtubeTitle=""
    {...props}
  />,
);

const renderVideoOptionsModal = (props = {}) => {
  const noop = vi.fn();

  return render(
    <VideoOptionsModal
      open
      onCancel={noop}
      onSave={noop}
      onVideoDetailsChange={noop}
      setYoutubeTitle={noop}
      videoDetails={{ subtitles: 'not-added' }}
      youtubeTitle=""
      {...props}
    />,
  );
};

const openUploadMediaMenu = async () => {
  fireEvent.click(screen.getAllByRole('button', { name: 'Upload Media' })[0]);
  await waitFor(() => {
    expect(document.querySelector('.publishing-new-post-upload-menu')).toBeTruthy();
  });

  const uploadImageOption = Array.from(
    document.querySelectorAll('.publishing-new-post-upload-option'),
  ).find((option) => option.textContent.includes('Upload Image(s)'));

  expect(uploadImageOption).toBeTruthy();
  return uploadImageOption;
};

const getUploadMenuOption = (label) => {
  const menu = document.querySelector('.publishing-new-post-upload-menu');
  expect(menu).toBeTruthy();

  const option = Array.from(
    menu.querySelectorAll('.publishing-new-post-upload-option'),
  ).find((item) => item.textContent.includes(label));

  expect(option).toBeTruthy();
  return option;
};

describe('PublishingNewPost interactions', () => {
  it('shows discard confirmation after editing the composer and closing it', async () => {
    renderNewPost();

    const caption = await screen.findByPlaceholderText('Start writing your post...', {}, { timeout: 5000 });
    fireEvent.change(caption, { target: { value: 'Smoke test caption' } });
    fireEvent.click(screen.getByRole('button', { name: 'Close composer' }));

    expect(await screen.findByText('Discard post?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Keep editing' })).toBeInTheDocument();
  }, 30000);

  it('keeps AI Assist disabled until media is attached', () => {
    const { rerender } = renderComposerEditor();

    const aiAssistButton = screen.getByRole('button', { name: 'Send to AI Assist' });
    expect(aiAssistButton).toBeDisabled();

    rerender(
      <ComposerEditor
        activeNetwork="instagram"
        availableNetworkKeys={['instagram']}
        captions={{ all: '', instagram: '' }}
        canUseStory
        isDraft={false}
        isStory={false}
        media={[previewMedia[0]]}
        mode="all_networks"
        onAddMedia={vi.fn()}
        onAiAssist={vi.fn()}
        onCaptionChange={vi.fn()}
        onCustomize={vi.fn()}
        onDraftChange={vi.fn()}
        onNetworkChange={vi.fn()}
        onOpenSource={vi.fn()}
        onOpenVideoOptions={vi.fn()}
        onRemoveMedia={vi.fn()}
        onStoryChange={vi.fn()}
        videoDetails={{ subtitles: 'not-added' }}
        youtubeTitle=""
      />,
    );

    expect(screen.getByRole('button', { name: 'Send to AI Assist' })).not.toBeDisabled();
  });

  it('confirms before switching to per-network customization', async () => {
    renderNewPost();

    const customizeButton = (await screen.findByText('Customize post per network', {}, { timeout: 5000 }))
      .closest('button');
    fireEvent.click(customizeButton);

    expect(await screen.findByText('Customize post per network?')).toBeInTheDocument();
    expect(screen.getByText(/Switching to per-network editing can reset shared configuration/i)).toBeInTheDocument();
    expect(screen.queryByRole('tablist', { name: 'Customize post per network' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(screen.queryByText('Customize post per network?')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Customize post per network').closest('button'));
    fireEvent.click(await screen.findByRole('button', { name: 'Continue' }));

    await waitFor(() => {
      expect(screen.getByRole('tablist', { name: 'Customize post per network' })).toBeInTheDocument();
    });
    const useSamePostButton = screen.getByText('Use same post across networks').closest('button');
    expect(useSamePostButton).toBeInTheDocument();

    fireEvent.click(useSamePostButton);

    expect(await screen.findByText('Use same post across networks?')).toBeInTheDocument();
    expect(screen.getByText(/Switching back to one shared post can reset per-network configuration/i)).toBeInTheDocument();
    expect(screen.getByRole('tablist', { name: 'Customize post per network' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(screen.queryByText('Use same post across networks?')).not.toBeInTheDocument();
    });
    expect(screen.getByRole('tablist', { name: 'Customize post per network' })).toBeInTheDocument();

    fireEvent.click(screen.getByText('Use same post across networks').closest('button'));
    fireEvent.click(await screen.findByRole('button', { name: 'Continue' }));

    await waitFor(() => {
      expect(screen.queryByRole('tablist', { name: 'Customize post per network' })).not.toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'All Networks' })).toBeInTheDocument();
  }, 60000);

  it('disables story mode for the default mixed-platform selection', async () => {
    renderNewPost();

    const storySwitch = await screen.findByRole('switch', { name: 'This is a story' }, { timeout: 5000 });

    expect(storySwitch).toBeDisabled();
    expect(storySwitch).toHaveAttribute('aria-checked', 'false');
  }, 30000);

  it('allows story mode for one Instagram profile and locks network customization while active', () => {
    renderComposerEditor();

    const storySwitch = screen.getByRole('switch', { name: 'This is a story' });
    expect(storySwitch).not.toBeDisabled();

    fireEvent.click(storySwitch);

    expect(storySwitch).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('button', { name: /Customize post per network/ })).toBeDisabled();
    expect(screen.queryByPlaceholderText('Start writing your post...')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Send to AI Assist' })).not.toBeInTheDocument();
  });

  it('hides story mode while customizing one network', () => {
    renderComposerEditor({
      activeNetwork: 'youtube',
      availableNetworkKeys: ['youtube'],
      mode: 'per_network',
    });

    expect(screen.queryByRole('switch', { name: 'This is a story' })).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('Start writing your post...')).toBeInTheDocument();
  });

  it('shows shared validation issue tooltips on per-network tabs', async () => {
    const networkKeys = ['facebook', 'instagram', 'threads', 'youtube', 'tiktok'];
    const mediaByNetwork = networkKeys.reduce((accumulator, networkKey) => {
      accumulator[networkKey] = multiVideoValidationMedia;
      return accumulator;
    }, {});

    renderComposerEditor({
      activeNetwork: 'instagram',
      availableNetworkKeys: networkKeys,
      media: multiVideoValidationMedia,
      mediaByNetwork,
      mode: 'per_network',
      youtubeAudience: '',
      youtubeTitle: '',
    });

    const instagramTab = screen.getByRole('tab', { name: 'Customize post for Instagram' });
    const youtubeTab = screen.getByRole('tab', { name: 'Customize post for YouTube' });

    expect(instagramTab).toHaveAttribute('title', 'Instagram');
    expect(youtubeTab).toHaveAttribute('title', 'YouTube');
    expect(instagramTab.querySelector('.publishing-new-post-network-tab-dot')).toBeTruthy();
    expect(youtubeTab.querySelector('.publishing-new-post-network-tab-dot')).toBeTruthy();

    fireEvent.mouseEnter(instagramTab);
    expect(await screen.findByText('Instagram videos within a carousel post cannot be longer than 1 minute.')).toBeInTheDocument();

    fireEvent.mouseEnter(youtubeTab);
    expect(await screen.findByText('1 video allowed for selected network.')).toBeInTheDocument();
  }, 30000);

  it('uses story-specific option sections and validation copy', () => {
    renderPublishingOptions({ isStory: true });

    expect(screen.queryByText('Instagram Options')).not.toBeInTheDocument();
    expect(screen.getByText('Publishing Workflows')).toBeInTheDocument();
    expect(screen.getByText('Editing this story post on your Sprout mobile app requires a mobile publisher.')).toBeInTheDocument();
    expect(screen.getByText(/to post story via the mobile app/i)).toBeInTheDocument();
  });

  it('keeps taxonomy focused on tags without a separate campaign picker', () => {
    renderPublishingOptions();

    expect(screen.getAllByText('Tags').length).toBeGreaterThan(0);
    expect(screen.getByText('Use tags to organize, filter and report on your content.')).toBeInTheDocument();
    expect(screen.queryByText('Campaign')).not.toBeInTheDocument();
    expect(screen.queryByText('Campaigns')).not.toBeInTheDocument();
  });

  it('uses the Book icon for Tag Group rows in the tags picker', async () => {
    renderPublishingOptions();

    fireEvent.click(screen.getByRole('button', { name: /Add tags/i }));

    await waitFor(() => {
      expect(document.querySelector('.publishing-new-post-taxonomy-row.is-category [data-icon="book"]')).toBeTruthy();
    });
  }, 30000);

  it('keeps image upload enabled for Facebook, Instagram, and Threads selections', async () => {
    renderComposerEditor({
      activeNetwork: 'facebook',
      availableNetworkKeys: ['facebook', 'instagram', 'threads'],
    });

    expect(await openUploadMediaMenu()).not.toBeDisabled();
  });

  it('disables image upload when all-networks selection includes unsupported platforms', async () => {
    renderComposerEditor({
      availableNetworkKeys: ['instagram', 'threads', 'youtube', 'tiktok'],
    });

    expect(await openUploadMediaMenu()).toBeDisabled();
  });

  it('checks image upload support against the active customized network', async () => {
    renderComposerEditor({
      activeNetwork: 'instagram',
      availableNetworkKeys: ['instagram', 'youtube'],
      mode: 'per_network',
    });

    expect(await openUploadMediaMenu()).not.toBeDisabled();
  });

  it('disables image upload on unsupported customized networks', async () => {
    renderComposerEditor({
      activeNetwork: 'youtube',
      availableNetworkKeys: ['instagram', 'youtube'],
      mode: 'per_network',
    });

    expect(await openUploadMediaMenu()).toBeDisabled();
  });

  it('opens the existing Asset Library picker from the upload menu', async () => {
    renderNewPost();

    await screen.findByPlaceholderText('Start writing your post...', {}, { timeout: 5000 });
    await openUploadMediaMenu();

    fireEvent.click(getUploadMenuOption('Asset Library'));

    expect(await screen.findByText('Choose From Asset Library')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search all assets for...')).toBeInTheDocument();
    expect(screen.getByText('Folders (4)')).toBeInTheDocument();
    expect(screen.getByText(/^Assets \(\d+\)$/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Attach' })).toBeDisabled();
  }, 30000);

  it('opens the native file picker and loads direct upload files into media assets', async () => {
    const onAddMedia = vi.fn();

    renderComposerEditor({
      availableNetworkKeys: ['facebook', 'instagram', 'threads'],
      onAddMedia,
    });

    await openUploadMediaMenu();

    const imageInput = screen.getByLabelText('Choose image file');
    const imageClickSpy = vi.spyOn(imageInput, 'click');

    fireEvent.click(getUploadMenuOption('Upload Image(s)'));

    expect(imageClickSpy).toHaveBeenCalledTimes(1);
    expect(onAddMedia).not.toHaveBeenCalled();

    fireEvent.change(imageInput, {
      target: { files: [new File(['image'], 'thumbnail.jpg', { type: 'image/jpeg' })] },
    });

    await waitFor(() => {
      expect(onAddMedia).toHaveBeenCalledWith(
        'image',
        'thumbnail.jpg',
        expect.objectContaining({
          isLocalUpload: true,
          name: 'thumbnail.jpg',
          src: expect.stringMatching(/^(blob:|mock-upload:\/\/)/),
          type: 'image',
        }),
      );
    });
    imageClickSpy.mockRestore();

    await openUploadMediaMenu();

    const videoInput = screen.getByLabelText('Choose video file');
    const videoClickSpy = vi.spyOn(videoInput, 'click');

    fireEvent.click(getUploadMenuOption('Upload Video'));

    expect(videoInput).toHaveAttribute('multiple');
    expect(videoClickSpy).toHaveBeenCalledTimes(1);

    fireEvent.change(videoInput, {
      target: {
        files: [
          new File(['video'], 'clip.mp4', { type: 'video/mp4' }),
          new File(['video-two'], 'clip-2.mp4', { type: 'video/mp4' }),
        ],
      },
    });

    await waitFor(() => {
      expect(onAddMedia).toHaveBeenCalledTimes(3);
    });
    expect(onAddMedia).toHaveBeenNthCalledWith(
      2,
      'video',
      'clip.mp4',
      expect.objectContaining({
        format: 'MP4',
        isLocalUpload: true,
        name: 'clip.mp4',
        src: expect.stringMatching(/^(blob:|mock-upload:\/\/)/),
        type: 'video',
      }),
    );
    expect(onAddMedia).toHaveBeenNthCalledWith(
      3,
      'video',
      'clip-2.mp4',
      expect.objectContaining({
        format: 'MP4',
        isLocalUpload: true,
        name: 'clip-2.mp4',
        src: expect.stringMatching(/^(blob:|mock-upload:\/\/)/),
        type: 'video',
      }),
    );
    videoClickSpy.mockRestore();
  }, 30000);

  it.each(['facebook', 'youtube', 'threads', 'tiktok'])(
    'blocks adding a second video in the %s-specific composer',
    async (activeNetwork) => {
      const { container } = renderComposerEditor({
        activeNetwork,
        availableNetworkKeys: [activeNetwork],
        media: previewVideoMedia,
        mode: 'per_network',
      });

      expect(container.querySelector('.publishing-new-post-media-add')).toBeNull();

      await openUploadMediaMenu();

      expect(getUploadMenuOption('Upload Video')).toBeDisabled();
      expect(screen.getByLabelText('Choose video file')).not.toHaveAttribute('multiple');
    },
  );

  it('keeps multi-video upload available for the Instagram-specific composer', async () => {
    const { container } = renderComposerEditor({
      activeNetwork: 'instagram',
      availableNetworkKeys: ['instagram'],
      media: previewVideoMedia,
      mode: 'per_network',
    });

    expect(container.querySelector('.publishing-new-post-media-add')).toBeTruthy();

    await openUploadMediaMenu();

    expect(getUploadMenuOption('Upload Video')).not.toBeDisabled();
    expect(screen.getByLabelText('Choose video file')).toHaveAttribute('multiple');
  });

  it('keeps shared multi-video previews when switching into per-network mode', () => {
    const landscapeVideo = {
      id: 'uploaded-video-1',
      type: 'video',
      label: 'Uploaded video 1',
      src: 'blob:http://localhost/uploaded-video-1',
      poster: 'blob:http://localhost/uploaded-video-poster-1',
      width: 1920,
      height: 1080,
      aspectRatio: '16:9',
    };
    const portraitVideo = {
      id: 'uploaded-video-2',
      type: 'video',
      label: 'Uploaded video 2',
      src: 'blob:http://localhost/uploaded-video-2',
      poster: 'blob:http://localhost/uploaded-video-poster-2',
      width: 1080,
      height: 1920,
      aspectRatio: '9:16',
    };
    const mediaByNetwork = {
      facebook: [landscapeVideo, portraitVideo],
      instagram: [landscapeVideo, portraitVideo],
    };
    const selectedChannels = [
      { id: 'fb-main', platform: 'facebook', name: 'Facebook Page', handle: '@facebook' },
      { id: 'ig-main', platform: 'instagram', name: 'Instagram Channel', handle: '@instagram' },
    ];

    const { unmount } = renderNetworkPreview({
      activeNetwork: 'facebook',
      media: [],
      mediaByNetwork,
      mode: 'per_network',
      networkKeys: ['facebook', 'instagram'],
      selectedChannels,
    });

    expect(screen.getByLabelText('Facebook preview video 1 of 1')).toHaveAttribute('poster', landscapeVideo.poster);
    expect(screen.queryByLabelText('Facebook preview video 2 of 2')).not.toBeInTheDocument();

    unmount();

    renderNetworkPreview({
      activeNetwork: 'instagram',
      media: [],
      mediaByNetwork,
      mode: 'per_network',
      networkKeys: ['facebook', 'instagram'],
      selectedChannels,
    });

    expect(screen.getByLabelText('Instagram preview video 1 of 2')).toHaveAttribute('poster', landscapeVideo.poster);
    fireEvent.click(screen.getByRole('button', { name: 'Next Instagram media item' }));
    expect(screen.getByLabelText('Instagram preview video 2 of 2')).toHaveAttribute('poster', portraitVideo.poster);
  });

  it('keeps single-video upload for non-Instagram network-specific empty composers', async () => {
    const onAddMedia = vi.fn();

    renderComposerEditor({
      activeNetwork: 'facebook',
      availableNetworkKeys: ['facebook'],
      media: [],
      mode: 'per_network',
      onAddMedia,
    });

    await openUploadMediaMenu();

    const videoInput = screen.getByLabelText('Choose video file');

    expect(getUploadMenuOption('Upload Video')).not.toBeDisabled();
    expect(videoInput).not.toHaveAttribute('multiple');

    fireEvent.change(videoInput, {
      target: {
        files: [
          new File(['video'], 'first.mp4', { type: 'video/mp4' }),
          new File(['video-two'], 'ignored.mp4', { type: 'video/mp4' }),
        ],
      },
    });

    await waitFor(() => {
      expect(onAddMedia).toHaveBeenCalledTimes(1);
    });
    expect(onAddMedia).toHaveBeenCalledWith(
      'video',
      'first.mp4',
      expect.objectContaining({
        format: 'MP4',
        isLocalUpload: true,
        name: 'first.mp4',
        type: 'video',
      }),
    );
  }, 30000);

  it('keeps uploaded media independent while customizing per network', async () => {
    renderNewPost();

    const customizeButton = (await screen.findByText('Customize post per network', {}, { timeout: 5000 }))
      .closest('button');
    fireEvent.click(customizeButton);
    fireEvent.click(await screen.findByRole('button', { name: 'Continue' }));

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Customize post for Facebook' })).toHaveAttribute('aria-selected', 'true');
    });

    await openUploadMediaMenu();
    fireEvent.change(screen.getByLabelText('Choose image file'), {
      target: { files: [new File(['facebook'], 'facebook-only.jpg', { type: 'image/jpeg' })] },
    });

    expect(await screen.findByAltText('facebook-only.jpg')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Customize post for YouTube' }));

    await waitFor(() => {
      expect(screen.queryByAltText('facebook-only.jpg')).not.toBeInTheDocument();
    });
    expect(screen.queryByText(/Alt text is missing/i)).not.toBeInTheDocument();

    await openUploadMediaMenu();
    fireEvent.change(screen.getByLabelText('Choose video file'), {
      target: { files: [new File(['youtube'], 'youtube-only.mp4', { type: 'video/mp4' })] },
    });

    expect(await screen.findByText('youtube-only.mp4')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Customize post for Facebook' }));

    expect(await screen.findByAltText('facebook-only.jpg')).toBeInTheDocument();
    expect(screen.queryByText('youtube-only.mp4')).not.toBeInTheDocument();
  }, 60000);

  it('opens a two-action image menu for uploaded image thumbnails', () => {
    const removeMedia = vi.fn();

    renderComposerEditor({
      media: previewMedia.slice(0, 2),
      onRemoveMedia: removeMedia,
    });

    expect(screen.getByRole('button', { name: 'Edit image 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit image 2' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Remove media' })).not.toBeInTheDocument();
    expect(screen.getByText('Alt text is missing for 2 out of 2 images')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Edit image 1' }));

    expect(screen.getByRole('button', { name: 'Add Alt Text' })).toHaveClass('publishing-new-post-popover-action');
    expect(screen.getByRole('button', { name: 'Remove Image' })).toHaveClass('publishing-new-post-popover-action');
    expect(screen.queryByText('Crop & Edit Image')).not.toBeInTheDocument();
    expect(screen.queryByText('Tag People and Products')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Remove Image' }));

    expect(removeMedia).toHaveBeenCalledWith('image-1');
  }, 30000);

  it('shows move handles and requests media reorder on drop', () => {
    const reorderMedia = vi.fn();
    const dataTransfer = {
      dropEffect: '',
      effectAllowed: '',
      store: {},
      getData(key) {
        return this.store[key] || '';
      },
      setData(key, value) {
        this.store[key] = value;
      },
    };

    renderComposerEditor({
      media: previewMedia.slice(0, 3),
      onReorderMedia: reorderMedia,
    });

    const firstMoveHandle = screen.getByRole('button', { name: 'Move image 1' });
    const thirdMediaTile = screen.getByRole('listitem', { name: 'Image 3 media item 3' });

    expect(firstMoveHandle).toHaveClass('publishing-new-post-media-move');

    fireEvent.dragStart(firstMoveHandle, { dataTransfer });
    fireEvent.dragOver(thirdMediaTile, { dataTransfer });
    fireEvent.drop(thirdMediaTile, { dataTransfer });

    expect(reorderMedia).toHaveBeenCalledWith('image-1', 'image-3');
  });

  it('opens the alt-text editor from the image menu', () => {
    renderComposerEditor({
      availableNetworkKeys: ['facebook', 'instagram', 'threads'],
      media: previewMedia.slice(0, 2),
    });

    fireEvent.click(screen.getByRole('button', { name: 'Edit image 2' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add Alt Text' }));

    expect(screen.getByText('Edit Alt Text for Instagram, Threads, and Facebook')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Describe this image for accessibility')).toBeInTheDocument();
    expect(screen.getByText('pexels-karola-g... (2/2)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous image preview' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next image preview' })).toBeInTheDocument();
    expect(screen.queryByText('Previous image')).not.toBeInTheDocument();
    expect(screen.queryByText('Next image')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Previous image preview' }));

    expect(screen.getByText('pexels-karola-g... (1/2)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save All' })).toBeInTheDocument();
  }, 30000);

  it('runs AI alt-text generation with approve, regenerate, and translate actions', async () => {
    renderComposerEditor({
      availableNetworkKeys: ['facebook', 'instagram', 'threads'],
      media: previewMedia.slice(0, 2),
    });

    fireEvent.click(screen.getByRole('button', { name: 'Edit image 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add Alt Text' }));

    const altTextField = screen.getByPlaceholderText('Describe this image for accessibility');
    expect(screen.queryByRole('button', { name: 'Approve' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Generate by AI Assist' }));

    expect(screen.getByLabelText('Generating alt text')).toBeInTheDocument();
    const firstSuggestion = await screen.findByText(/A hand holds a light blue rectangular color swatch/i);

    expect(screen.getByRole('button', { name: 'Approve' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Regenerate' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Translate' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
    expect(altTextField).toHaveValue(firstSuggestion.textContent);

    fireEvent.click(screen.getByRole('button', { name: 'Regenerate' }));
    expect(screen.getByLabelText('Generating alt text')).toBeInTheDocument();
    expect(await screen.findByText(/Neutral creative materials are arranged/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Translate' }));
    const spanishOption = await screen.findByRole('button', { name: 'Spanish' });
    expect(spanishOption).toHaveClass('publishing-new-post-popover-action');

    fireEvent.click(spanishOption);

    expect(await screen.findByText(/Materiales creativos neutros estan organizados/i)).toBeInTheDocument();
  }, 30000);

  it('opens the supported video action menu for uploaded video thumbnails', () => {
    const openVideoOptions = vi.fn();
    const openSource = vi.fn();
    const removeMedia = vi.fn();

    renderComposerEditor({
      activeNetwork: 'facebook',
      availableNetworkKeys: ['facebook'],
      media: previewVideoMedia,
      onOpenSource: openSource,
      onOpenVideoOptions: openVideoOptions,
      onRemoveMedia: removeMedia,
    });

    expect(screen.getByText('Add video subtitles')).toBeInTheDocument();
    expect(screen.getByText('Subtitles are missing for your video.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Remove media' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Edit video 1' }));

    expect(screen.getByRole('button', { name: 'Add video title' })).toHaveClass('publishing-new-post-popover-action');
    expect(screen.getByRole('button', { name: 'Upload thumbnail' })).toHaveClass('publishing-new-post-popover-action');
    expect(screen.getByRole('button', { name: 'Add thumbnail from Asset Library' })).toHaveClass('publishing-new-post-popover-action');
    expect(screen.getByRole('button', { name: 'Choose a new thumbnail frame' })).toHaveClass('publishing-new-post-popover-action');
    expect(screen.getByRole('button', { name: 'Add subtitles to video' })).toHaveClass('publishing-new-post-popover-action');
    expect(screen.getByRole('button', { name: 'Remove video' })).toHaveClass('publishing-new-post-popover-action');
    expect(screen.queryByText('Crop & Edit Video')).not.toBeInTheDocument();
    expect(screen.queryByText('Tag People and Products')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Add video title' }));
    expect(openVideoOptions).toHaveBeenCalledWith('video-1');
  });

  it.each(['instagram', 'threads', 'tiktok'])(
    'hides video subtitle actions for %s uploads',
    (activeNetwork) => {
      renderComposerEditor({
        activeNetwork,
        availableNetworkKeys: [activeNetwork],
        media: previewVideoMedia,
      });

      expect(screen.queryByText('Add video subtitles')).not.toBeInTheDocument();
      expect(screen.queryByText('Subtitles are missing for your video.')).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Edit video 1' }));

      expect(screen.queryByRole('button', { name: 'Add subtitles to video' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add video title' })).toBeInTheDocument();
    },
  );

  it('routes video thumbnail library and removal actions', () => {
    const openSource = vi.fn();
    const removeMedia = vi.fn();

    renderComposerEditor({
      activeNetwork: 'facebook',
      availableNetworkKeys: ['facebook'],
      media: previewVideoMedia,
      onOpenSource: openSource,
      onRemoveMedia: removeMedia,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Edit video 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add thumbnail from Asset Library' }));
    expect(openSource).toHaveBeenCalledWith('assetLibrary');

    fireEvent.click(screen.getByRole('button', { name: 'Edit video 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove video' }));
    expect(removeMedia).toHaveBeenCalledWith('video-1');
  }, 30000);

  it('opens the native file picker when uploading a video thumbnail', () => {
    const openVideoOptions = vi.fn();

    renderComposerEditor({
      activeNetwork: 'facebook',
      availableNetworkKeys: ['facebook'],
      media: previewVideoMedia,
      onOpenVideoOptions: openVideoOptions,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Edit video 1' }));

    const thumbnailInput = screen.getByLabelText('Choose video thumbnail file');
    const thumbnailClickSpy = vi.spyOn(thumbnailInput, 'click');

    fireEvent.click(screen.getByRole('button', { name: 'Upload thumbnail' }));

    expect(thumbnailClickSpy).toHaveBeenCalledTimes(1);
    expect(openVideoOptions).not.toHaveBeenCalled();

    fireEvent.change(thumbnailInput, {
      target: { files: [new File(['image'], 'video-thumbnail.png', { type: 'image/png' })] },
    });

    thumbnailClickSpy.mockRestore();
  });

  it('shows tooltips for video option metadata controls', async () => {
    renderVideoOptionsModal();

    fireEvent.mouseEnter(screen.getByLabelText('Thumbnail frame support information'));
    expect(await screen.findByText('Choosing a thumbnail frame is not supported by Threads.')).toBeInTheDocument();

    fireEvent.mouseEnter(screen.getByLabelText('Subtitle file upload information'));
    expect(await screen.findByText('Subtitle file upload supported for X, Facebook, LinkedIn, LinkedIn Company, and YouTube only.')).toBeInTheDocument();

    expect(screen.getByLabelText('Video title information')).toBeInTheDocument();
  }, 30000);

  it('lets users scrub generated video frames and opens the subtitle file picker', () => {
    const onVideoDetailsChange = vi.fn();
    renderVideoOptionsModal({ onVideoDetailsChange });

    const frameSlider = screen.getByLabelText('Select generated video thumbnail frame');
    expect(frameSlider).toHaveAttribute('max', '20');
    expect(screen.getByText('1 / 20')).toBeInTheDocument();

    fireEvent.change(frameSlider, { target: { value: '5' } });
    expect(screen.getByText('5 / 20')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Previous generated video frame' }));
    expect(screen.getByText('4 / 20')).toBeInTheDocument();

    const subtitleInput = screen.getByLabelText('Choose subtitle file');
    const clickSpy = vi.spyOn(subtitleInput, 'click');
    fireEvent.click(screen.getByRole('button', { name: 'Upload subtitle file' }));

    expect(clickSpy).toHaveBeenCalledTimes(1);

    const subtitleFile = new File(['WEBVTT'], 'captions.vtt', { type: 'text/vtt' });
    fireEvent.change(subtitleInput, { target: { files: [subtitleFile] } });

    expect(screen.getByText('Edit captions.vtt')).toBeInTheDocument();
    expect(onVideoDetailsChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Save subtitle review' }));

    expect(onVideoDetailsChange).toHaveBeenCalledWith(expect.objectContaining({
      subtitleFileName: 'captions.vtt',
      subtitles: 'uploaded',
    }));

    clickSpy.mockRestore();
  }, 30000);

  it('seeks the selected uploaded video while scrubbing generated thumbnail frames', async () => {
    renderVideoOptionsModal({
      video: {
        id: 'uploaded-video',
        label: 'Uploaded test video',
        src: 'blob:uploaded-test-video',
      },
    });

    const previewVideo = screen.getByLabelText('Uploaded test video');
    Object.defineProperty(previewVideo, 'duration', {
      configurable: true,
      value: 100,
    });
    const pauseSpy = vi.spyOn(previewVideo, 'pause').mockImplementation(() => {});

    fireEvent.loadedMetadata(previewVideo);
    fireEvent.change(screen.getByLabelText('Select generated video thumbnail frame'), {
      target: { value: '11' },
    });

    await waitFor(() => {
      expect(previewVideo.currentTime).toBeGreaterThan(50);
    });

    pauseSpy.mockRestore();
  }, 30000);

  it('generates AI subtitles from the selected mock video audio and opens the review editor', async () => {
    const onVideoDetailsChange = vi.fn();

    renderVideoOptionsModal({
      onVideoDetailsChange,
      video: {
        id: 'mock-video-thang-diien',
        label: 'Thang Diien Gameplay Audio',
        src: '/assets/mock-media/thang diien.mp4',
      },
    });

    expect(screen.getByLabelText('Thang Diien Gameplay Audio')).toHaveAttribute('src', '/assets/mock-media/thang diien.mp4');

    fireEvent.click(screen.getByRole('button', { name: 'Generate by AI Assist' }));

    expect(screen.getByText('Edit generated-caption.srt')).toBeInTheDocument();
    expect(screen.getByLabelText('Subtitle file content').value).toContain('00:00:00,000');
    expect(screen.getByText('Video Preview')).toBeInTheDocument();
    expect(onVideoDetailsChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel subtitle review' }));

    await waitFor(() => {
      expect(screen.queryByText('Edit generated-caption.srt')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Subtitles are missing for your video.')).toBeInTheDocument();
    expect(onVideoDetailsChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Generate by AI Assist' }));

    fireEvent.click(screen.getByRole('button', { name: 'Save subtitle review' }));

    expect(onVideoDetailsChange).toHaveBeenLastCalledWith(expect.objectContaining({
      subtitleFileName: 'generated-caption.srt',
      subtitles: 'auto',
    }));
    expect(screen.getByRole('button', { name: 'Generate by AI Assist' })).toBeDisabled();
  }, 30000);

  it('opens the inline subtitle translation flow after AI subtitles are ready', async () => {
    const onVideoDetailsChange = vi.fn();

    renderVideoOptionsModal({
      onVideoDetailsChange,
      videoDetails: {
        subtitleFileName: 'generated-caption.srt',
        subtitleLanguage: 'English (United States)',
        subtitleText: '1\n00:00:00,000 --> 00:00:02,000\nCaption',
        subtitles: 'auto',
      },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Translate subtitle file' }));

    expect(screen.getByText('Select translation language')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Translate' })).toBeDisabled();

    fireEvent.mouseDown(screen.getByLabelText('Select subtitle translation language'));
    fireEvent.click(await screen.findByTitle('Spanish (Mexico)'));
    fireEvent.click(screen.getByRole('button', { name: 'Translate' }));

    expect(onVideoDetailsChange).toHaveBeenCalledWith(expect.objectContaining({
      subtitleLanguage: 'Spanish (Mexico)',
      subtitles: 'translated',
    }));
  }, 30000);

  it('advances the Instagram preview image when clicking the carousel control', () => {
    renderNetworkPreview();

    expect(screen.getByLabelText('Instagram preview image 1 of 5')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Next Instagram media item' }));

    expect(screen.getByLabelText('Instagram preview image 2 of 5')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Previous Instagram media item' }));

    expect(screen.getByLabelText('Instagram preview image 1 of 5')).toBeInTheDocument();
  });

  it('collapses and expands individual network preview sections', () => {
    renderNetworkPreview({
      networkKeys: ['facebook', 'instagram'],
      selectedChannels: [
        { id: 'fb-main', platform: 'facebook', name: 'Facebook Page', handle: '@facebook' },
        { id: 'ig-main', platform: 'instagram', name: 'Instagram Channel', handle: '@instagram' },
      ],
    });

    expect(screen.getByLabelText('Facebook preview image 1 of 5')).toBeInTheDocument();
    expect(screen.getByLabelText('Instagram preview image 1 of 5')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Collapse Facebook preview' }));

    expect(screen.getByRole('button', { name: 'Expand Facebook preview' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByLabelText('Facebook preview image 1 of 5')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Instagram preview image 1 of 5')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Expand Facebook preview' }));

    expect(screen.getByRole('button', { name: 'Collapse Facebook preview' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByLabelText('Facebook preview image 1 of 5')).toBeInTheDocument();
  });

  it('uses active network media for customized network preview', () => {
    renderNetworkPreview({
      activeNetwork: 'instagram',
      captions: { all: '', facebook: '', instagram: '', threads: '' },
      media: [],
      mediaByNetwork: {
        facebook: previewMedia.slice(0, 2),
        instagram: previewMedia.slice(0, 3),
        threads: previewMedia.slice(0, 4),
      },
      mode: 'per_network',
      networkKeys: ['facebook', 'instagram', 'threads'],
      selectedChannels: [
        { id: 'fb-main', platform: 'facebook', name: 'Facebook Page', handle: '@facebook' },
        { id: 'ig-main', platform: 'instagram', name: 'Instagram Channel', handle: '@instagram' },
        { id: 'threads-main', platform: 'threads', name: 'Threads Channel', handle: '@threads' },
      ],
    });

    expect(screen.getByLabelText('Instagram preview image 1 of 3')).toBeInTheDocument();
    expect(screen.queryByLabelText('Facebook preview image 1 of 2')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Threads preview image 1 of 4')).not.toBeInTheDocument();
  });

  it('uses uploaded media dimensions to size network preview frames', () => {
    const uploadedImage = {
      id: 'uploaded-image',
      type: 'image',
      label: 'Uploaded image',
      src: 'blob:http://localhost/uploaded-image',
      width: 1080,
      height: 1350,
      aspectRatio: '4:5',
    };

    renderNetworkPreview({
      media: [uploadedImage],
      networkKeys: ['facebook', 'instagram', 'threads'],
      selectedChannels: [
        { id: 'fb-main', platform: 'facebook', name: 'Facebook Page', handle: '@facebook' },
        { id: 'ig-main', platform: 'instagram', name: 'Instagram Channel', handle: '@instagram' },
        { id: 'threads-main', platform: 'threads', name: 'Threads Channel', handle: '@threads' },
      ],
    });

    const facebookGrid = screen
      .getByAltText('Facebook preview image 1 of 1')
      .closest('.publishing-new-post-preview-media-grid');
    const instagramCell = screen
      .getByAltText('Instagram preview image 1 of 1')
      .closest('.publishing-new-post-preview-media-cell');
    const threadsItem = screen
      .getByAltText('Threads preview image 1 of 1')
      .closest('.publishing-new-post-threads-media-frame');

    expect(facebookGrid?.style.getPropertyValue('--preview-media-aspect-ratio')).toBe('1080 / 1350');
    expect(instagramCell?.style.getPropertyValue('--preview-media-aspect-ratio')).toBe('1080 / 1350');
    expect(threadsItem?.style.getPropertyValue('--preview-media-aspect-ratio')).toBe('1080 / 1350');
  });

  it('uses platform-specific layouts for multi-image previews', () => {
    const multiImageMedia = [
      { id: 'portrait-1', type: 'image', label: 'Portrait 1', src: '/assets/mock-media/portrait-1.jpg', width: 1080, height: 1920 },
      { id: 'portrait-2', type: 'image', label: 'Portrait 2', src: '/assets/mock-media/portrait-2.jpg', width: 1080, height: 1350 },
      { id: 'landscape-1', type: 'image', label: 'Landscape 1', src: '/assets/mock-media/landscape-1.jpg', width: 1920, height: 1080 },
      { id: 'square-1', type: 'image', label: 'Square 1', src: '/assets/mock-media/square-1.jpg', width: 1200, height: 1200 },
      { id: 'portrait-3', type: 'image', label: 'Portrait 3', src: '/assets/mock-media/portrait-3.jpg', width: 900, height: 1200 },
    ];

    renderNetworkPreview({
      media: multiImageMedia,
      networkKeys: ['facebook', 'instagram', 'threads'],
      selectedChannels: [
        { id: 'fb-main', platform: 'facebook', name: 'Facebook Page', handle: '@facebook' },
        { id: 'ig-main', platform: 'instagram', name: 'Instagram Channel', handle: '@instagram' },
        { id: 'threads-main', platform: 'threads', name: 'Threads Channel', handle: '@threads' },
      ],
    });

    const facebookAlbum = screen
      .getByAltText('Facebook preview image 1 of 5')
      .closest('.publishing-new-post-preview-media-grid');
    const instagramCell = screen
      .getByAltText('Instagram preview image 1 of 5')
      .closest('.publishing-new-post-preview-media-cell');
    const firstThreadsItem = screen
      .getByAltText('Threads preview image 1 of 1')
      .closest('.publishing-new-post-threads-media-frame');

    expect(facebookAlbum).toHaveClass('is-facebook-album-count-5');
    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(screen.queryByAltText('Facebook preview image 5 of 5')).not.toBeInTheDocument();
    expect(instagramCell?.style.getPropertyValue('--preview-media-aspect-ratio')).toBe('0.75 / 1');
    expect(firstThreadsItem?.style.getPropertyValue('--threads-post-media-width')).toBe('204px');
    expect(screen.getByLabelText('Threads post actions')).toBeInTheDocument();
    expect(screen.queryByAltText('Threads preview image 2 of 5')).not.toBeInTheDocument();
  });

  it('uses compact Facebook album layouts for two and three images', () => {
    const facebookChannel = [{ id: 'fb-main', platform: 'facebook', name: 'Facebook Page', handle: '@facebook' }];
    const firstImage = { id: 'image-a', type: 'image', label: 'Image A', src: '/assets/mock-media/image-a.jpg' };
    const secondImage = { id: 'image-b', type: 'image', label: 'Image B', src: '/assets/mock-media/image-b.jpg' };
    const thirdImage = { id: 'image-c', type: 'image', label: 'Image C', src: '/assets/mock-media/image-c.jpg' };

    const { rerender } = render(
      <NetworkPreview
        activeNetwork="facebook"
        captions={{ all: 'Preview caption', facebook: '' }}
        media={[firstImage, secondImage]}
        mode="all_networks"
        networkKeys={['facebook']}
        selectedChannels={facebookChannel}
        videoDetails={{ facebookPlacement: 'feed' }}
        youtubeTitle=""
      />,
    );

    expect(screen.getByAltText('Facebook preview image 1 of 2').closest('.publishing-new-post-preview-media-grid'))
      .toHaveClass('is-facebook-album-count-2');

    rerender(
      <NetworkPreview
        activeNetwork="facebook"
        captions={{ all: 'Preview caption', facebook: '' }}
        media={[firstImage, secondImage, thirdImage]}
        mode="all_networks"
        networkKeys={['facebook']}
        selectedChannels={facebookChannel}
        videoDetails={{ facebookPlacement: 'feed' }}
        youtubeTitle=""
      />,
    );

    expect(screen.getByAltText('Facebook preview image 1 of 3').closest('.publishing-new-post-preview-media-grid'))
      .toHaveClass('is-facebook-album-count-3');
  });

  it('renders video previews with platform-specific video frames', () => {
    const landscapeVideo = {
      id: 'uploaded-video',
      type: 'video',
      label: 'Uploaded video',
      src: 'blob:http://localhost/uploaded-video',
      poster: 'blob:http://localhost/uploaded-video-poster',
      width: 1920,
      height: 1080,
      aspectRatio: '16:9',
    };

    renderNetworkPreview({
      media: [landscapeVideo],
      networkKeys: ['facebook', 'instagram', 'threads', 'youtube', 'tiktok'],
      selectedChannels: [
        { id: 'fb-main', platform: 'facebook', name: 'Facebook Page', handle: '@facebook' },
        { id: 'ig-main', platform: 'instagram', name: 'Instagram Channel', handle: '@instagram' },
        { id: 'threads-main', platform: 'threads', name: 'Threads Channel', handle: '@threads' },
        { id: 'yt-main', platform: 'youtube', name: 'YouTube Channel', handle: '@youtube' },
        { id: 'tt-main', platform: 'tiktok', name: 'TikTok Channel', handle: '@tiktok' },
      ],
    });

    const instagramVideoCell = screen
      .getByLabelText('Instagram preview video 1 of 1')
      .closest('.publishing-new-post-preview-media-cell');

    expect(screen.getByLabelText('Facebook preview video 1 of 1')).toHaveAttribute('poster', landscapeVideo.poster);
    expect(screen.getByLabelText('Instagram preview video 1 of 1').closest('.publishing-new-post-instagram-card')).toBeTruthy();
    expect(screen.getByLabelText('Instagram preview video 1 of 1').closest('.publishing-new-post-instagram-reel-card')).toBeNull();
    expect(instagramVideoCell?.style.getPropertyValue('--preview-media-aspect-ratio')).toBe('16 / 9');
    expect(screen.getByLabelText('Threads preview video 1 of 1').closest('.publishing-new-post-threads-media-frame')).toBeTruthy();
    expect(screen.getByLabelText('YouTube preview video 1 of 1').closest('.publishing-new-post-youtube-card')).toHaveClass('is-standard');
    expect(screen.getByLabelText('TikTok preview video 1 of 1').closest('.publishing-new-post-tiktok-card')).toBeTruthy();
  });

  it('renders Instagram-only reel preview when feed sharing is disabled', () => {
    const portraitVideo = {
      id: 'uploaded-instagram-reel-video',
      type: 'video',
      label: 'Uploaded Instagram Reel video',
      src: 'blob:http://localhost/uploaded-instagram-reel-video',
      poster: 'blob:http://localhost/uploaded-instagram-reel-video-poster',
      width: 1080,
      height: 1920,
      aspectRatio: '9:16',
    };

    renderNetworkPreview({
      media: [portraitVideo],
      networkKeys: ['instagram'],
      selectedChannels: [
        { id: 'ig-main', platform: 'instagram', name: 'Instagram Channel', handle: '@instagram' },
      ],
      videoDetails: { instagramShareToFeed: false },
    });

    expect(screen.getByLabelText('Instagram preview video 1 of 1').closest('.publishing-new-post-instagram-reel-card')).toBeTruthy();
  });

  it('renders TikTok preview with a portrait video rail and username overlay', () => {
    const portraitVideo = {
      id: 'uploaded-tiktok-portrait-video',
      type: 'video',
      label: 'Uploaded TikTok portrait video',
      src: 'blob:http://localhost/uploaded-tiktok-portrait-video',
      poster: 'blob:http://localhost/uploaded-tiktok-portrait-video-poster',
      width: 1080,
      height: 1920,
      aspectRatio: '9:16',
    };

    const { container } = renderNetworkPreview({
      captions: { all: '', instagram: '', threads: '', facebook: '', tiktok: '' },
      media: [portraitVideo],
      networkKeys: ['tiktok'],
      selectedChannels: [
        {
          id: 'tt-main',
          platform: 'tiktok',
          name: 'Tran Trung Kien',
          handle: '@trantrungkien2788',
          channelId: 'trantrungkien2788',
        },
      ],
      videoDetails: { tiktokPrivacy: 'private' },
    });

    expect(screen.getByLabelText('TikTok preview video 1 of 1').closest('.publishing-new-post-tiktok-card')).toBeTruthy();
    expect(screen.getByText('trantrungkien2788')).toBeInTheDocument();
    expect(screen.getByLabelText('TikTok post actions').querySelector('.anticon-heart')).toBeTruthy();
    expect(screen.getByLabelText('TikTok post actions').querySelector('.anticon-comment')).toBeTruthy();
    expect(screen.getByLabelText('TikTok post actions').querySelector('.anticon-send')).toBeTruthy();
    expect(container.querySelectorAll('.publishing-new-post-tiktok-rail .publishing-new-post-preview-avatar')).toHaveLength(2);
    expect(screen.queryByText('Like')).not.toBeInTheDocument();
    expect(screen.queryByText('Comment')).not.toBeInTheDocument();
    expect(screen.queryByText('Share')).not.toBeInTheDocument();
    expect(screen.queryByText('Limited audience video')).not.toBeInTheDocument();
  });

  it('renders YouTube preview as the standard letterboxed card for portrait videos', () => {
    const portraitVideo = {
      id: 'uploaded-youtube-portrait-video',
      type: 'video',
      label: 'Uploaded YouTube portrait video',
      src: 'blob:http://localhost/uploaded-youtube-portrait-video',
      poster: 'blob:http://localhost/uploaded-youtube-portrait-video-poster',
      width: 1080,
      height: 1920,
      aspectRatio: '9:16',
    };

    const { container } = renderNetworkPreview({
      captions: { all: 'Video caption', instagram: '', threads: '', facebook: '', youtube: '' },
      media: [portraitVideo],
      networkKeys: ['youtube'],
      selectedChannels: [
        { id: 'yt-main', platform: 'youtube', name: 'Hoc Vien Lien Quan Official', handle: '@hocvienlienquan' },
      ],
    });

    const card = screen.getByLabelText('YouTube preview video 1 of 1').closest('.publishing-new-post-youtube-card');
    const mediaFrame = screen.getByLabelText('YouTube preview video 1 of 1').closest('.publishing-new-post-preview-media');

    expect(card).toHaveClass('is-standard');
    expect(card).not.toHaveClass('is-short');
    expect(mediaFrame?.style.getPropertyValue('--preview-media-aspect-ratio')).toBe('');
    expect(screen.getByText('Hoc Vien Lien Quan Official')).toBeInTheDocument();
    expect(container.querySelector('.publishing-new-post-youtube-standard-title')).toHaveTextContent('Video caption');
    expect(container.querySelector('.publishing-new-post-youtube-rail')).toBeNull();
    expect(container.querySelector('.publishing-new-post-preview-play')).toBeNull();
  });

  it('renders Facebook first comment and uses the real play overlay icon in preview', () => {
    const landscapeVideo = {
      id: 'uploaded-video',
      type: 'video',
      label: 'Uploaded video',
      src: 'blob:http://localhost/uploaded-video',
      poster: 'blob:http://localhost/uploaded-video-poster',
      width: 1920,
      height: 1080,
      aspectRatio: '16:9',
    };

    const { container } = renderNetworkPreview({
      firstComment: 'Pinned launch note',
      media: [landscapeVideo],
      networkKeys: ['facebook'],
      selectedChannels: [
        {
          id: 'fb-main',
          platform: 'facebook',
          name: 'Facebook Page',
          handle: '@facebook',
          avatarUrl: '/assets/mock-media/profile.jpg',
        },
      ],
    });

    expect(screen.getByLabelText('Facebook first comment preview')).toHaveTextContent('Pinned launch note');
    expect(screen.getByLabelText('Facebook first comment preview')).toHaveTextContent('Facebook Page');
    expect(container.querySelector('.publishing-new-post-preview-play .anticon-caret-right')).toBeTruthy();
    expect(container.querySelector('.publishing-new-post-preview-avatar img')).toHaveAttribute('src', '/assets/mock-media/profile.jpg');
  });

  it('renders Instagram feed footer with action icons and profile metadata', () => {
    const { container } = renderNetworkPreview({
      captions: { all: 'Launch caption', instagram: '', threads: '', facebook: '' },
      firstComment: 'Pinned launch note',
      media: [previewMedia[0]],
      networkKeys: ['instagram'],
      selectedChannels: [
        { id: 'ig-main', platform: 'instagram', name: 'lienquanche', handle: '@lienquanche' },
      ],
    });

    const instagramActions = screen.getByLabelText('Instagram post actions');
    expect(instagramActions.querySelector('.anticon-heart')).toBeTruthy();
    expect(instagramActions.querySelector('.anticon-comment')).toBeTruthy();
    expect(container.querySelector('.publishing-new-post-instagram-caption-line')).toHaveTextContent('lienquanche');
    expect(container.querySelector('.publishing-new-post-instagram-caption-line')).toHaveTextContent('Launch caption');
    expect(container.querySelector('.publishing-new-post-instagram-meta')).toHaveTextContent('lienquanche');
    expect(container.querySelector('.publishing-new-post-instagram-meta')).toHaveTextContent('Launch caption');
    expect(screen.getByLabelText('Instagram first comment preview')).toHaveTextContent('Pinned launch note');
    expect(screen.queryByText('Like')).not.toBeInTheDocument();
    expect(screen.queryByText('Comment')).not.toBeInTheDocument();
  });

  it('uses the explicit YouTube title before falling back to the caption in preview metadata', () => {
    const portraitVideo = {
      id: 'uploaded-youtube-title-video',
      type: 'video',
      label: 'Uploaded YouTube title video',
      src: 'blob:http://localhost/uploaded-youtube-title-video',
      poster: 'blob:http://localhost/uploaded-youtube-title-video-poster',
      width: 1080,
      height: 1920,
      aspectRatio: '9:16',
    };

    const { container } = renderNetworkPreview({
      captions: { all: 'Fallback caption', instagram: '', threads: '', facebook: '', youtube: '' },
      media: [portraitVideo],
      networkKeys: ['youtube'],
      selectedChannels: [
        { id: 'yt-main', platform: 'youtube', name: 'Hoc Vien Lien Quan Official', handle: '@hocvienlienquan' },
      ],
      youtubeTitle: 'Explicit video title',
    });

    expect(container.querySelector('.publishing-new-post-youtube-standard-title')).toHaveTextContent('Explicit video title');
    expect(container.querySelector('.publishing-new-post-youtube-standard-title')).not.toHaveTextContent('Fallback caption');
    expect(screen.getByText('Hoc Vien Lien Quan Official')).toBeInTheDocument();
  });

  it('limits multi-video previews to Instagram carousel only', () => {
    const landscapeVideo = {
      id: 'uploaded-video-1',
      type: 'video',
      label: 'Uploaded video 1',
      src: 'blob:http://localhost/uploaded-video-1',
      poster: 'blob:http://localhost/uploaded-video-poster-1',
      width: 1920,
      height: 1080,
      aspectRatio: '16:9',
    };
    const portraitVideo = {
      id: 'uploaded-video-2',
      type: 'video',
      label: 'Uploaded video 2',
      src: 'blob:http://localhost/uploaded-video-2',
      poster: 'blob:http://localhost/uploaded-video-poster-2',
      width: 1080,
      height: 1920,
      aspectRatio: '9:16',
    };

    renderNetworkPreview({
      media: [landscapeVideo, portraitVideo],
      networkKeys: ['facebook', 'instagram', 'threads', 'youtube', 'tiktok'],
      selectedChannels: [
        { id: 'fb-main', platform: 'facebook', name: 'Facebook Page', handle: '@facebook' },
        { id: 'ig-main', platform: 'instagram', name: 'Instagram Channel', handle: '@instagram' },
        { id: 'threads-main', platform: 'threads', name: 'Threads Channel', handle: '@threads' },
        { id: 'yt-main', platform: 'youtube', name: 'YouTube Channel', handle: '@youtube' },
        { id: 'tt-main', platform: 'tiktok', name: 'TikTok Channel', handle: '@tiktok' },
      ],
    });

    expect(screen.getByLabelText('Instagram preview video 1 of 2').closest('.publishing-new-post-instagram-card')).toBeTruthy();
    expect(screen.getByLabelText('Instagram preview video 1 of 2').closest('.publishing-new-post-instagram-reel-card')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Next Instagram media item' }));
    expect(screen.getByLabelText('Instagram preview video 2 of 2')).toHaveAttribute('poster', portraitVideo.poster);
    expect(
      screen
        .getByLabelText('Instagram preview video 2 of 2')
        .closest('.publishing-new-post-preview-media-cell')
        ?.style.getPropertyValue('--preview-media-aspect-ratio'),
    ).toBe('16 / 9');

    expect(screen.getByLabelText('Facebook preview video 1 of 1')).toHaveAttribute('poster', landscapeVideo.poster);
    expect(screen.getByLabelText('Threads preview video 1 of 1')).toHaveAttribute('poster', landscapeVideo.poster);
    expect(screen.getByLabelText('YouTube preview video 1 of 1')).toHaveAttribute('poster', landscapeVideo.poster);
    expect(screen.getByLabelText('TikTok preview video 1 of 1')).toHaveAttribute('poster', landscapeVideo.poster);
    expect(screen.queryByLabelText('Threads preview video 2 of 2')).not.toBeInTheDocument();
  });

  it('keeps each network preview aligned to its platform media rules', () => {
    const mixedMedia = [
      ...previewMedia.slice(0, 2),
      ...previewVideoMedia,
    ];

    renderNetworkPreview({
      media: mixedMedia,
      networkKeys: ['facebook', 'instagram', 'threads', 'youtube', 'tiktok'],
      selectedChannels: [
        { id: 'fb-main', platform: 'facebook', name: 'Facebook Page', handle: '@facebook' },
        { id: 'ig-main', platform: 'instagram', name: 'Instagram Channel', handle: '@instagram' },
        { id: 'threads-main', platform: 'threads', name: 'Threads Channel', handle: '@threads' },
        { id: 'yt-main', platform: 'youtube', name: 'YouTube Channel', handle: '@youtube' },
        { id: 'tt-main', platform: 'tiktok', name: 'TikTok Channel', handle: '@tiktok' },
      ],
    });

    expect(screen.queryByText('Images and videos can not be combined. Please remove either the image(s) or video(s).')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Facebook preview video 1 of 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Instagram preview image 1 of 3')).toBeInTheDocument();
    expect(screen.getByLabelText('Threads preview video 1 of 1')).toBeInTheDocument();
    expect(screen.queryByLabelText('Threads preview image 1 of 3')).not.toBeInTheDocument();
    expect(screen.getByLabelText('YouTube preview video 1 of 1')).toBeInTheDocument();
    expect(screen.getByLabelText('TikTok preview video 1 of 1')).toBeInTheDocument();
  });

  it('renders Threads preview as a single post with icon actions', () => {
    renderNetworkPreview({
      activeNetwork: 'threads',
      networkKeys: ['threads'],
      selectedChannels: [{
        id: 'threads-main',
        platform: 'threads',
        name: 'Garena Delta Force VN',
        handle: 'Threads Channel',
        channelId: 'garenadeltaforcevn',
      }],
    });

    expect(screen.getByText('garenadeltaforcevn')).toBeInTheDocument();
    expect(screen.getByLabelText('Threads preview image 1 of 1').closest('.publishing-new-post-threads-media-frame')).toBeTruthy();
    expect(screen.getByLabelText('Threads post actions').querySelectorAll('.anticon')).toHaveLength(4);
    expect(screen.queryByText('Threads Channel')).not.toBeInTheDocument();
    expect(screen.queryByText('Reply')).not.toBeInTheDocument();
    expect(screen.queryByText('Repost')).not.toBeInTheDocument();
    expect(screen.queryByText('Share')).not.toBeInTheDocument();
  });

  it('shows Threads video options for Threads video uploads', () => {
    const onVideoDetailsChange = vi.fn();

    renderPublishingOptions({
      activeNetwork: 'threads',
      contentType: 'video',
      hasVideo: false,
      media: [{ id: 'threads-video-1', type: 'video' }],
      mode: 'per_network',
      networkKeys: ['threads'],
      onVideoDetailsChange,
      selectedChannels: [{ id: 'threads-main', platform: 'threads' }],
      videoDetails: {
        threadsReplyControl: 'anyone',
        threadsAltText: '',
      },
    });

    expect(screen.getByText('Threads Video Options')).toBeInTheDocument();
    expect(screen.getByText('Who can reply')).toBeInTheDocument();
    expect(screen.getByText('Anyone')).toBeInTheDocument();

    const altTextInput = screen.getByPlaceholderText('Describe this video for accessibility');
    fireEvent.change(altTextInput, { target: { value: 'Accessible Threads video description' } });

    expect(onVideoDetailsChange).toHaveBeenCalledWith({
      threadsAltText: 'Accessible Threads video description',
    });
    expect(screen.getByText('Publishing Workflows')).toBeInTheDocument();
  });

  it('shows the Instagram image aspect warning for uploaded images', () => {
    renderPublishingOptions({
      contentType: 'image',
      scheduleMode: 'queue',
    });

    expect(screen.getByText(/not within the 3:4 to 1.91:1 aspect ratio/i)).toBeInTheDocument();
  });

  it('renders shared video validation issues in the footer validation panel', () => {
    renderPublishingOptions({
      contentType: 'video',
      hasVideo: true,
      media: multiVideoValidationMedia,
      networkKeys: ['facebook', 'instagram', 'threads', 'youtube', 'tiktok'],
      selectedChannels: [
        { id: 'fb-main', platform: 'facebook' },
        { id: 'ig-main', platform: 'instagram' },
        { id: 'threads-main', platform: 'threads' },
        { id: 'yt-main', platform: 'youtube' },
        { id: 'tt-main', platform: 'tiktok' },
      ],
      youtubeAudience: '',
      youtubeTitle: '',
    });

    expect(screen.getByText('14 errors and 1 warning')).toBeInTheDocument();
    expect(screen.getAllByText('1 video allowed for selected network.')).toHaveLength(4);
    expect(screen.getByText('Instagram videos within a carousel post cannot be longer than 1 minute.')).toBeInTheDocument();
    expect(screen.getByText('Please make sure your video width is 1920 pixels or less.')).toBeInTheDocument();
    expect(screen.getAllByText('Video is still uploading. Please wait.')).toHaveLength(5);
    expect(screen.getByText('Audience selection is required when posting to YouTube')).toBeInTheDocument();
    expect(screen.getByText('Please choose a day or time to schedule this post.')).toBeInTheDocument();
  });

  it('keeps YouTube image-only posts out of the video options UI', () => {
    renderPublishingOptions({
      activeNetwork: 'youtube',
      contentType: 'image',
      hasVideo: false,
      mode: 'per_network',
      networkKeys: ['youtube'],
      selectedChannels: [{ id: 'yt-main', platform: 'youtube' }],
    });

    expect(screen.queryByText('YouTube Video Options')).not.toBeInTheDocument();
    expect(screen.queryByText('A video is required for YouTube.')).not.toBeInTheDocument();
    expect(screen.getByText('Publishing Workflows')).toBeInTheDocument();
    expect(screen.getByText('YouTube')).toBeInTheDocument();
    expect(screen.getByText('Video is required when posting to YouTube. Save post as a draft to add media later.')).toBeInTheDocument();
  });

  it('shows YouTube video options only for video uploads', () => {
    renderPublishingOptions({
      activeNetwork: 'youtube',
      contentType: 'video',
      hasVideo: true,
      mode: 'per_network',
      networkKeys: ['youtube'],
      selectedChannels: [{ id: 'yt-main', platform: 'youtube' }],
      videoDetails: { youtubePrivacy: 'public', youtubeCategory: 'People & Blogs' },
    });

    expect(screen.getByText('YouTube Video Options')).toBeInTheDocument();
    const shortNoticeText = screen.getByText(/automatically be posted as a Short/i);
    expect(shortNoticeText).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Learn more about posting to YouTube' })).toHaveAttribute(
      'href',
      'https://support.sproutsocial.com/hc/en-us/articles/360024633771-How-do-I-publish-videos-to-YouTube',
    );
    expect(shortNoticeText.closest('.publishing-new-post-youtube-short-alert')).toBeInTheDocument();
  });

  it('renders the selected YouTube made-for-kids audience state', () => {
    renderPublishingOptions({
      activeNetwork: 'youtube',
      contentType: 'video',
      hasVideo: true,
      mode: 'per_network',
      networkKeys: ['youtube'],
      selectedChannels: [{ id: 'yt-main', platform: 'youtube' }],
      videoDetails: { youtubePrivacy: 'public', youtubeCategory: 'People & Blogs' },
      youtubeAudience: 'made-for-kids',
    });

    const madeForKids = screen.getByRole('radio', { name: "Yes, it's made for kids" });
    const notMadeForKids = screen.getByRole('radio', { name: "No, it's not made for kids" });

    expect(madeForKids).toBeChecked();
    expect(madeForKids.closest('.ant-radio-wrapper')).toHaveClass('ant-radio-wrapper-checked');
    expect(notMadeForKids).not.toBeChecked();
  });

  it('turns YouTube video tags into chips when Enter is pressed', async () => {
    const noop = vi.fn();
    const StatefulYouTubeOptions = () => {
      const [videoDetails, setVideoDetails] = useState({
        youtubeCategory: 'People & Blogs',
        youtubePrivacy: 'public',
        youtubeTags: [],
      });

      return (
        <MemoryRouter>
          <PublishingOptions
            activeNetwork="youtube"
            approvalWorkflow={null}
            contentType="video"
            firstComment=""
            hasVideo
            isDraft={false}
            isStory={false}
            labels={[]}
            mobilePublisher={null}
            mode="per_network"
            networkKeys={['youtube']}
            onFirstCommentChange={noop}
            onOpenResource={noop}
            onVideoDetailsChange={(patch) => setVideoDetails((current) => ({ ...current, ...patch }))}
            scheduleByNetwork={false}
            scheduleMode="specific"
            scheduledTimes={[{ date: null, time: null }]}
            selectedChannels={[{ id: 'yt-main', platform: 'youtube' }]}
            setApprovalWorkflow={noop}
            setLabels={noop}
            setMobilePublisher={noop}
            setScheduleByNetwork={noop}
            setScheduleMode={noop}
            setScheduledTimes={noop}
            setYoutubeAudience={noop}
            setYoutubeTitle={noop}
            videoDetails={videoDetails}
            youtubeAudience="not-made-for-kids"
            youtubeTitle=""
          />
        </MemoryRouter>
      );
    };

    render(<StatefulYouTubeOptions />);

    const tagGroup = screen.getByRole('group', { name: 'YouTube Video Tags' });

    fireEvent.change(screen.getByLabelText('Enter YouTube video tag'), { target: { value: 'test 1' } });
    fireEvent.keyDown(screen.getByLabelText('Enter YouTube video tag'), { key: 'Enter' });

    await waitFor(() => {
      expect(within(tagGroup).getByText('test 1')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Enter YouTube video tag'), { target: { value: 'test 2, test 3' } });
    fireEvent.keyDown(screen.getByLabelText('Enter YouTube video tag'), { key: 'Enter' });

    await waitFor(() => {
      expect(within(tagGroup).getByText('test 2')).toBeInTheDocument();
      expect(within(tagGroup).getByText('test 3')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Enter YouTube video tag')).toHaveAttribute('placeholder', 'Enter comma-separated values');

    fireEvent.click(screen.getByRole('button', { name: 'Remove YouTube tag test 2' }));

    await waitFor(() => {
      expect(screen.queryByText('test 2')).not.toBeInTheDocument();
    });
  }, 30000);

  it('renders Instagram reel options for video posts', () => {
    const onVideoDetailsChange = vi.fn();

    renderPublishingOptions({
      contentType: 'video',
      hasVideo: true,
      networkKeys: ['instagram', 'facebook', 'youtube'],
      onVideoDetailsChange,
      videoDetails: {
        instagramShareToFeed: true,
        instagramTrialReel: true,
        instagramTrialReelAutoPublish: false,
      },
    });

    expect(screen.getByText('Instagram Options')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Trial Reel/i })).toBeChecked();
    expect(screen.getByText('Test content with non-followers before sharing widely.')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Publish automatically to everyone based on 72 hour performance/i })).not.toBeChecked();
    expect(screen.getByText(/Your followers won't see your video in feed or Reels/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Share Reel to your profile feed \(if trial is published to everyone\)/i })).toBeChecked();

    fireEvent.click(screen.getByRole('checkbox', { name: /Publish automatically to everyone/i }));

    expect(onVideoDetailsChange).toHaveBeenCalledWith({ instagramTrialReelAutoPublish: true });
  });

  it('uses the draft top bar treatment when draft mode is enabled', async () => {
    renderNewPost();

    const title = await screen.findByRole('heading', { name: 'New Post' }, { timeout: 5000 });
    const topbar = title.closest('.publishing-new-post-topbar');

    expect(topbar).not.toHaveClass('is-draft');
    expect(screen.getByText('When to post')).toBeInTheDocument();
    expect(screen.getByText('Specific Days & Times')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('This is a Draft'));

    expect(await screen.findByRole('heading', { name: 'New Draft' })).toBeInTheDocument();
    expect(topbar).toHaveClass('is-draft');
    expect(screen.getByText('Show draft on calendar (optional)')).toBeInTheDocument();
    expect(screen.queryByText('Specific Days & Times')).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('D/M/YYYY')).toBeInTheDocument();
  }, 30000);

  it('removes required media errors while saving as a draft', async () => {
    renderNewPost();

    expect(await screen.findByText('Video is required when posting to YouTube. Save post as a draft to add media later.')).toBeInTheDocument();
    expect(screen.getByText('Video is required when posting to TikTok. Save post as a draft to add media later.')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('This is a Draft'));

    expect(screen.queryByText('Image or video required when posting to Instagram. Save post as a draft to add media later.')).not.toBeInTheDocument();
    expect(screen.queryByText('Video is required when posting to YouTube. Save post as a draft to add media later.')).not.toBeInTheDocument();
    expect(screen.queryByText('Video is required when posting to TikTok. Save post as a draft to add media later.')).not.toBeInTheDocument();
  }, 30000);

  it('edits first comment through an accessible composer field', async () => {
    renderNewPost();

    const firstComment = await screen.findByLabelText('First Comment', {}, { timeout: 5000 });
    fireEvent.change(firstComment, { target: { value: 'Pinned launch note' } });

    expect(firstComment).toHaveValue('Pinned launch note');
  }, 30000);

  it('opens Add Asset from the Facebook First Comment asset action', async () => {
    renderNewPost();

    const customizeButton = (await screen.findByText('Customize post per network', {}, { timeout: 5000 }))
      .closest('button');
    fireEvent.click(customizeButton);
    fireEvent.click(await screen.findByRole('button', { name: 'Continue' }));

    const firstComment = await screen.findByLabelText('Facebook First Comment', {}, { timeout: 5000 });
    fireEvent.change(firstComment, { target: { value: 'tessss' } });

    const saveToAssetLibrary = screen.getByRole('button', { name: 'Save to Asset Library' });
    expect(saveToAssetLibrary).toBeInTheDocument();

    fireEvent.click(saveToAssetLibrary);

    expect(await screen.findByRole('heading', { name: 'Add Asset' })).toBeInTheDocument();
    expect(screen.getByLabelText('Asset Text')).toHaveValue('tessss');
    expect(screen.getByRole('button', { name: 'Add Asset' })).toBeDisabled();

    fireEvent.change(screen.getByLabelText('Asset Title'), { target: { value: 'Facebook first comment' } });
    expect(screen.getByRole('button', { name: 'Add Asset' })).not.toBeDisabled();

    fireEvent.mouseDown(screen.getByLabelText('Asset context'));
    expect(await screen.findByTitle('Reply')).toBeInTheDocument();
    expect(screen.getByTitle('Both Compose and Reply')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Add Asset' })).not.toBeInTheDocument();
    });
    expect(screen.getByLabelText('Facebook First Comment')).toHaveValue('tessss');
  }, 60000);

  it('hides First Comment when the selected platform does not support it', async () => {
    renderNewPost();

    expect(await screen.findByLabelText('First Comment', {}, { timeout: 5000 })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Channel selection' }));
    const channelMenu = document.querySelector('.publishing-new-post-channel-menu');
    expect(channelMenu).toBeTruthy();

    fireEvent.click(within(channelMenu).getByRole('button', { name: 'Clear All' }));

    await waitFor(() => {
      expect(screen.queryByLabelText('First Comment')).not.toBeInTheDocument();
    });

    const refreshedChannelMenu = document.querySelector('.publishing-new-post-channel-menu');
    expect(refreshedChannelMenu).toBeTruthy();
    fireEvent.click(within(refreshedChannelMenu).getByRole('button', { name: 'All YouTube' }));

    await waitFor(() => {
      expect(screen.queryByLabelText('First Comment')).not.toBeInTheDocument();
    });
  }, 30000);

  it('persists TikTok option toggles in composer state', async () => {
    renderNewPost();

    const allowComments = await screen.findByRole('checkbox', { name: 'Allow comments' }, { timeout: 5000 });
    expect(allowComments).toBeChecked();

    fireEvent.click(allowComments);
    expect(allowComments).not.toBeChecked();

    fireEvent.click(allowComments);
    expect(allowComments).toBeChecked();
  }, 30000);

  it('removes a selected channel from the selector trigger chips', async () => {
    renderNewPost();

    await screen.findByPlaceholderText('Start writing your post...', {}, { timeout: 5000 });
    const removeChannel = screen.getByLabelText('Remove Garena Delta Force (VN - Vietnamese)');
    fireEvent.click(removeChannel);

    expect(screen.queryByLabelText('Remove Garena Delta Force (VN - Vietnamese)')).not.toBeInTheDocument();
  }, 30000);

  it('limits channel selector options to the active global channel group', async () => {
    renderNewPost();

    await screen.findByPlaceholderText('Start writing your post...', {}, { timeout: 5000 });
    fireEvent.click(screen.getByRole('button', { name: 'Channel selection' }));

    expect(await screen.findByText('Select all channels in this group')).toBeInTheDocument();
    expect(screen.getAllByText('Garena Delta Force VN').length).toBeGreaterThan(0);
    expect(screen.queryByText('Chien Than Delta Force')).not.toBeInTheDocument();
    expect(screen.queryByText('@chienthandf')).not.toBeInTheDocument();
  }, 30000);

  it('defaults New Post to all connected channels in the active group', async () => {
    window.localStorage.setItem(ACTIVE_CHANNEL_GROUP_STORAGE_KEY, '2');
    const activeGroup = MANAGED_CHANNEL_GROUPS.find((group) => String(group.id) === '2');
    const connectedChannelCount = MANAGED_CHANNELS.filter((channel) => (
      activeGroup.channelIds.includes(channel.id) && !channel.disabled
    )).length;

    renderNewPost();

    await screen.findByPlaceholderText('Start writing your post...', {}, { timeout: 5000 });
    fireEvent.click(screen.getByRole('button', { name: 'Channel selection' }));

    expect(await screen.findByText(`Channels (${connectedChannelCount})`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Garena Delta Force VN .*Channels/i })).toHaveClass('is-selected');
  }, 30000);

  it('opens the Instagram collaborators picker from Instagram Options', async () => {
    renderPublishingOptions({
      activeNetwork: 'instagram',
      networkKeys: ['instagram'],
      selectedChannels: [{ id: 'ig-main', platform: 'instagram' }],
    });

    const inviteCollaborators = await screen.findByRole('button', { name: 'Invite Collaborators' }, { timeout: 5000 });
    fireEvent.click(inviteCollaborators);

    expect(await screen.findByPlaceholderText('Add an Instagram profile...')).toBeInTheDocument();
    expect(screen.getByText('Add up to 3 profiles.')).toBeInTheDocument();
    expect(screen.getByText(/If the collaborators accept/i)).toBeInTheDocument();
  }, 30000);
});
