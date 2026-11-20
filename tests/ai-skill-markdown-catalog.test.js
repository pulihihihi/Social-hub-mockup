import { beforeEach, describe, expect, it } from 'vitest';
import { MOCK_KNOWLEDGE, MOCK_SKILLS } from '../src/data/aiSkill';
import { getNewPostAiAssetsForSections } from '../src/features/ai-assist/newPostAiCatalog';
import { resolveNewPostAiConfig } from '../src/features/ai-assist/newPostAiConfigResolver';
import { NEW_POST_AI_BUTTON_GROUPS, NEW_POST_AI_DEFAULT_SECTION_KEYS, NEW_POST_AI_SECTIONS } from '../src/features/ai-assist/newPostAiRegistry';

beforeEach(() => {
  window.localStorage.clear();
});

describe('Delta Force markdown AI catalog', () => {
  it('loads local Delta Force skills and knowledge from markdown files', () => {
    expect(MOCK_KNOWLEDGE.length).toBeGreaterThanOrEqual(26);
    expect(MOCK_SKILLS.length).toBeGreaterThanOrEqual(45);

    expect(MOCK_KNOWLEDGE.find((item) => item.id === 'delta-force-overview')).toMatchObject({
      source: 'local',
      enabled: true,
      verificationTier: 'official-public',
    });

    expect(MOCK_SKILLS.find((item) => item.id === 'delta-force-post-orchestrator')).toMatchObject({
      source: 'local',
      enabled: true,
      category: 'Planning',
    });
  });

  it('exposes the full New Post AI section registry', () => {
    expect(NEW_POST_AI_DEFAULT_SECTION_KEYS).toContain('captionBase');
    expect(NEW_POST_AI_DEFAULT_SECTION_KEYS).toContain('youtubeOptions');
    expect(NEW_POST_AI_DEFAULT_SECTION_KEYS).toContain('validation');

    const sectionLabels = NEW_POST_AI_SECTIONS.map((section) => section.label);

    expect(sectionLabels).toContain('Caption');
    expect(sectionLabels).toContain('First comment');
    expect(sectionLabels).toContain('TikTok settings');
    expect(sectionLabels).toContain('Final preview check');
  });

  it('resolves at least one real skill and one real knowledge pack for every AI section and button group', () => {
    NEW_POST_AI_SECTIONS.forEach((section) => {
      const assets = getNewPostAiAssetsForSections([section.key]);

      expect(assets.skills.length, `${section.key} should resolve at least one skill`).toBeGreaterThan(0);
      expect(assets.knowledge.length, `${section.key} should resolve at least one knowledge pack`).toBeGreaterThan(0);
    });

    Object.entries(NEW_POST_AI_BUTTON_GROUPS).forEach(([groupKey, sectionKeys]) => {
      const assets = getNewPostAiAssetsForSections(sectionKeys);

      expect(assets.skills.length, `${groupKey} button should resolve at least one skill`).toBeGreaterThan(0);
      expect(assets.knowledge.length, `${groupKey} button should resolve at least one knowledge pack`).toBeGreaterThan(0);
    });
  });

  it('builds effective config from active assets only and flags sections that need setup', () => {
    const disabledKnowledge = MOCK_KNOWLEDGE.map((item) => (
      item.id === 'delta-force-publishing-objectives'
        ? { ...item, enabled: false }
        : item
    ));
    const config = resolveNewPostAiConfig({
      knowledge: disabledKnowledge,
      sectionKeys: ['firstComment'],
      skills: MOCK_SKILLS,
    });

    expect(config.activeKnowledgeBySection.firstComment).toHaveLength(0);
    expect(config.sections[0]).toMatchObject({
      hasRequiredAssets: false,
      key: 'firstComment',
    });
    expect(config.missingRequiredAssetsBySection.firstComment).toMatchObject({
      knowledge: true,
      skills: false,
    });
  });
});
