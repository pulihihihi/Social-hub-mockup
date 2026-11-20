import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '../src/app/AppProviders';
import { AppRouter } from '../src/app/AppRouter';
import { MOCK_KNOWLEDGE, MOCK_SKILLS } from '../src/data/aiSkill';
import { resolveNewPostAiConfig } from '../src/features/ai-assist/newPostAiConfigResolver';
import { runNewPostAiAssist } from '../src/features/ai-assist/newPostAiRunner';

const renderNewPost = () => render(
  <MemoryRouter initialEntries={['/publishing/new-post']}>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </MemoryRouter>,
);

beforeEach(() => {
  window.localStorage.clear();
});

const openUploadMediaMenu = async () => {
  fireEvent.click(screen.getAllByRole('button', { name: 'Upload Media' })[0]);
  await waitFor(() => {
    expect(document.querySelector('.publishing-new-post-upload-menu')).toBeTruthy();
  });
};

const openAiTab = () => {
  const segmentedItems = document.querySelectorAll('.publishing-new-post-right-tabs-segmented .ant-segmented-item');
  expect(segmentedItems[1]).toBeTruthy();
  fireEvent.click(segmentedItems[1]);
};

const findClosestContainerWithSwitch = (node) => {
  let currentNode = node?.parentElement || null;

  while (currentNode) {
    if (currentNode.querySelector('[role="switch"]')) {
      return currentNode;
    }

    currentNode = currentNode.parentElement;
  }

  return null;
};

describe('Publishing New Post AI Assist', () => {
  it('builds Delta Force section results from the shared runner', () => {
    const result = runNewPostAiAssist({
      context: {
        activeNetwork: 'facebook',
        approvalWorkflow: null,
        captions: { all: '', facebook: '', instagram: '', youtube: '' },
        firstComment: '',
        isDraft: false,
        labels: [],
        media: [{ id: 'video-1', type: 'video', label: 'Operator gameplay clip' }],
        mobilePublisher: null,
        mode: 'all_networks',
        publisherOptions: [{ value: 'user-tran-hai-son', label: 'Tran Hai Son' }],
        scheduleByNetwork: false,
        scheduleMode: 'specific',
        scheduledTimes: [{ date: null, time: null }],
        selectedChannels: [],
        selectedNetworks: ['facebook', 'youtube', 'tiktok'],
        tagCollections: [{ id: 'df', tags: ['Delta Force VN', 'Video', 'Campaign'] }],
        videoDetails: {
          youtubeTags: [],
          youtubeCategory: 'People & Blogs',
          youtubeAgeRestriction: 'not-restricted',
          youtubeLicense: 'standard',
          youtubeEmbedding: true,
          youtubeNotifySubscribers: true,
          tiktokAllowComments: true,
          tiktokAllowDuets: true,
          tiktokAllowStitches: true,
        },
        workflowOptions: [{ value: 'marketing-review', label: 'Marketing Review' }],
        youtubeAudience: 'not-made-for-kids',
        youtubeTitle: '',
      },
      selectedSectionKeys: ['captionBase', 'youtubeTitle', 'youtubeTags', 'tiktokOptions'],
    });

    expect(result.sections.find((section) => section.key === 'captionBase')).toMatchObject({
      status: 'applied',
    });
    expect(result.sections.find((section) => section.key === 'youtubeTitle')?.preview).toContain('Delta Force');
    expect(result.sections.find((section) => section.key === 'youtubeTags')?.preview).toContain('Delta Force');
    expect(result.sections.find((section) => section.key === 'tiktokOptions')?.preview).toContain('Allow comments');
  });

  it('returns a needs-setup result when the effective config has no active knowledge for a selected section', () => {
    const resolvedConfig = resolveNewPostAiConfig({
      knowledge: MOCK_KNOWLEDGE.map((item) => (
        item.id === 'delta-force-publishing-objectives'
          ? { ...item, enabled: false }
          : item
      )),
      sectionKeys: ['firstComment'],
      skills: MOCK_SKILLS,
    });
    const result = runNewPostAiAssist({
      context: {
        activeNetwork: 'facebook',
        approvalWorkflow: null,
        captions: { all: '', facebook: '' },
        firstComment: '',
        isDraft: false,
        labels: [],
        media: [{ id: 'image-1', type: 'image', label: 'Delta Force operator still' }],
        mobilePublisher: null,
        mode: 'all_networks',
        publisherOptions: [],
        scheduleByNetwork: false,
        scheduleMode: 'specific',
        scheduledTimes: [{ date: null, time: null }],
        selectedChannels: [],
        selectedNetworks: ['facebook'],
        tagCollections: [],
        videoDetails: {},
        workflowOptions: [],
        youtubeAudience: '',
        youtubeTitle: '',
      },
      resolvedConfig,
      selectedSectionKeys: ['firstComment'],
    });

    expect(result.sections[0]).toMatchObject({
      key: 'firstComment',
      status: 'needs-setup',
    });
    expect(result.sections[0].activeKnowledge).toHaveLength(0);
    expect(result.sections[0].warnings[0]).toContain('No active knowledge packs are enabled');
  });

  it('marks only relevant tasks for the current post context', () => {
    const resolvedConfig = resolveNewPostAiConfig({
      context: {
        hasImage: true,
        hasVideo: false,
        selectedNetworks: ['facebook'],
        supportsStandaloneFirstComment: true,
      },
      knowledge: MOCK_KNOWLEDGE,
      sectionKeys: ['captionBase', 'firstComment', 'imageAltText', 'subtitles', 'youtubeTitle', 'tiktokOptions'],
      skills: MOCK_SKILLS,
    });

    expect(resolvedConfig.sections.find((section) => section.key === 'captionBase')?.isRelevant).toBe(true);
    expect(resolvedConfig.sections.find((section) => section.key === 'firstComment')?.isRelevant).toBe(true);
    expect(resolvedConfig.sections.find((section) => section.key === 'imageAltText')?.isRelevant).toBe(true);
    expect(resolvedConfig.sections.find((section) => section.key === 'subtitles')?.isRelevant).toBe(false);
    expect(resolvedConfig.sections.find((section) => section.key === 'youtubeTitle')?.isRelevant).toBe(false);
    expect(resolvedConfig.sections.find((section) => section.key === 'tiktokOptions')?.isRelevant).toBe(false);
  });

  it('gates the panel on uploaded media and autofills caption after running AI', async () => {
    renderNewPost();

    await screen.findByPlaceholderText('Start writing your post...', {}, { timeout: 5000 });
    openAiTab();

    expect(await screen.findByText('Upload creative to start')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Generate with AI' })).toBeDisabled();

    await openUploadMediaMenu();
    fireEvent.change(screen.getByLabelText('Choose image file'), {
      target: { files: [new File(['image'], 'delta-force.jpg', { type: 'image/jpeg' })] },
    });

    const aiPanel = document.querySelector('.publishing-new-post-ai-panel');
    expect(aiPanel).toBeTruthy();

    await waitFor(() => {
      expect(within(aiPanel).queryByText('Upload creative to start')).not.toBeInTheDocument();
      expect(within(aiPanel).getByRole('button', { name: 'Generate with AI' })).not.toBeDisabled();
    });

    openAiTab();

    expect(within(aiPanel).getByRole('button', { name: /AI will help with/i })).toBeInTheDocument();
    fireEvent.click(within(aiPanel).getByRole('button', { name: 'Generate with AI' }));

    await waitFor(() => {
      expect(screen.getByDisplayValue(/Delta Force is live/i)).toBeInTheDocument();
    });

    const captionResult = within(aiPanel).getAllByText('Caption')[0].closest('.publishing-new-post-ai-result-card');
    expect(captionResult).toBeTruthy();
    fireEvent.click(within(captionResult).getByRole('button', { name: 'Open' }));
    expect(within(captionResult).getByText(/Prepared caption/i)).toBeInTheDocument();
  }, 30000);

  it('shows linked skills and knowledge for a section AI button', async () => {
    renderNewPost();

    await screen.findByPlaceholderText('Start writing your post...', {}, { timeout: 5000 });
    fireEvent.click(screen.getByRole('button', { name: 'Open AI configuration for Caption' }));

    expect(await screen.findByText('AI Configuration')).toBeInTheDocument();
    expect(screen.getByText(/My Skills \(/)).toBeInTheDocument();
    expect(screen.getByText('Caption Writer').closest('a')).toHaveAttribute(
      'href',
      expect.stringContaining('/settings/ai-skill?tab=skills&detailType=skill&detailId=caption-writer'),
    );

    fireEvent.click(screen.getByRole('radio', { name: /My Knowledge/i }));

    const knowledgeLink = await screen.findByText('Delta Force Overview');
    expect(knowledgeLink.closest('a')).toHaveAttribute(
      'href',
      expect.stringContaining('/settings/ai-skill?tab=knowledge&detailType=knowledge&detailId=delta-force-overview'),
    );
  }, 30000);

  it('uses AI Skill toggles as the source of truth for Image Alt Text AI configuration', async () => {
    const aiSkillPage = render(
      <MemoryRouter initialEntries={['/settings/ai-skill']}>
        <AppProviders>
          <AppRouter />
        </AppProviders>
      </MemoryRouter>,
    );

    fireEvent.click(await screen.findByRole('tab', { name: /My Knowledge/i }));
    const knowledgeCard = findClosestContainerWithSwitch(await screen.findByText('Alt Text Guidelines'));
    expect(knowledgeCard).toBeTruthy();
    fireEvent.click(within(knowledgeCard).getByRole('switch'));
    aiSkillPage.unmount();

    renderNewPost();
    await screen.findByPlaceholderText('Start writing your post...', {}, { timeout: 5000 });
    await openUploadMediaMenu();
    fireEvent.change(screen.getByLabelText('Choose image file'), {
      target: { files: [new File(['image'], 'delta-force.jpg', { type: 'image/jpeg' })] },
    });

    openAiTab();
    const aiPanel = document.querySelector('.publishing-new-post-ai-panel');
    expect(aiPanel).toBeTruthy();
    await waitFor(() => {
      expect(within(aiPanel).queryByText('Upload creative to start')).not.toBeInTheDocument();
    });

    fireEvent.click(within(aiPanel).getByRole('button', { name: /AI will help with/i }));

    expect(within(aiPanel).getByText('Prepare media')).toBeInTheDocument();
    expect(await within(aiPanel).findByText(/No active knowledge packs are enabled for Describe images for accessibility\./i)).toBeInTheDocument();
    expect(within(aiPanel).getByText('Setup needed')).toBeInTheDocument();
  }, 30000);

  it('opens the AI Skill detail view from route query parameters', async () => {
    render(
      <MemoryRouter initialEntries={['/settings/ai-skill?tab=knowledge&detailType=knowledge&detailId=alt-text-guidelines&sourceKind=local&originTab=knowledge']}>
        <AppProviders>
          <AppRouter />
        </AppProviders>
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: 'Alt Text Guidelines' }, { timeout: 5000 })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Back to My Knowledge/i }));
    expect(await screen.findByRole('tab', { name: /My Knowledge/i })).toBeInTheDocument();
  }, 30000);
});
