import { describe, expect, it } from 'vitest';
import {
  buildAssetDownload,
  createApprovedMarketplaceAsset,
  createLocalAssetCopyDraft,
  createMarketplaceSkillCopyDraft,
  syncSkillKnowledgeLinks,
} from '../src/pages/AiSkill/aiSkillPageActions';
import { installMarketplaceAsset } from '../src/features/ai-assets/assetInstallers';

const fixedNow = () => new Date('2026-05-08T00:00:00.000Z');

describe('AI Skill page action helpers', () => {
  it('creates deterministic local copy drafts without mutating the source id', () => {
    const draft = createLocalAssetCopyDraft({
      item: {
        id: 'sk_1',
        name: 'Moderation Skill',
        category: 'moderation',
        games: ['FF'],
        enabled: true,
      },
      now: fixedNow,
    });

    expect(draft).toMatchObject({
      id: undefined,
      name: 'Moderation Skill (Copy)',
      enabled: false,
      source: 'local',
      createdAt: '2026-05-08',
      updatedAt: '2026-05-08',
      games: ['FF'],
    });
  });

  it('promotes approval submissions into marketplace assets with stable publish metadata', () => {
    const approved = createApprovedMarketplaceAsset({
      item: {
        id: 'sub_1',
        name: 'Campaign Knowledge',
        type: 'knowledge',
        category: 'Campaign',
        usageCount: 12,
      },
      now: fixedNow,
    });

    expect(approved).toMatchObject({
      id: 'sub_1',
      source: 'marketplace',
      installs: 12,
      rating: 0,
      reviewCount: 0,
      publishedAt: '2026-05-08',
      updatedAt: '2026-05-08',
    });
  });

  it('builds marketplace copy drafts and markdown downloads through pure helpers', () => {
    const copied = createMarketplaceSkillCopyDraft({
      item: {
        name: 'Launch Planner',
        description: 'Plans launches',
        category: 'publishing',
        sharedTags: { game: ['DF'] },
      },
      skillCategories: [{ value: 'publishing', label: 'Publishing' }],
    });

    expect(copied).toMatchObject({
      name: 'Launch Planner (Copy)',
      source: 'local',
      linkedKnowledge: [],
      games: ['DF'],
    });

    const download = buildAssetDownload({
      item: {
        ...copied,
        name: 'Launch Planner v2',
        type: 'skill',
        linkedKnowledge: ['kn_1'],
      },
      skillCategories: [{ value: 'publishing', label: 'Publishing' }],
      skillTriggers: [{ value: 'manual', label: 'Manual' }],
      knowledge: [{ id: 'kn_1', name: 'Launch Knowledge' }],
    });

    expect(download.fileName).toBe('launch-planner-v2.md');
    expect(download.markdownValue).toContain('Linked knowledge: Launch Knowledge');
  });

  it('syncs linked knowledge when a skill save changes relationships', () => {
    const nextKnowledge = syncSkillKnowledgeLinks({
      knowledge: [
        { id: 'kn_1', linkedSkills: ['sk_1'] },
        { id: 'kn_2', linkedSkills: [] },
      ],
      skillId: 'sk_1',
      previousLinkedKnowledge: ['kn_1'],
      nextLinkedKnowledge: ['kn_2'],
    });

    expect(nextKnowledge).toEqual([
      { id: 'kn_1', linkedSkills: [] },
      { id: 'kn_2', linkedSkills: ['sk_1'] },
    ]);
  });

  it('allows marketplace installer ids and dates to be injected in tests', () => {
    const nextState = installMarketplaceAsset({
      item: { id: 'mp_1', type: 'skill', name: 'Marketplace Skill' },
      installedIds: [],
      skills: [],
      knowledge: [],
      createId: (prefix) => `${prefix}_stable`,
      now: fixedNow,
    });

    expect(nextState.skills[0]).toMatchObject({
      id: 'sk_mp_stable',
      createdAt: '2026-05-08',
      updatedAt: '2026-05-08',
    });
  });
});
