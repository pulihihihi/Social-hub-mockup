import {
  getItemSharedTags,
  getSkillCategoryLabel,
  normalizeAssetTags,
  sanitizeFileName,
} from "../../features/ai-assets/assetFilters";
import { buildAssetMarkdown } from "./components/assetPageHelpers";

const getDateStamp = (now = () => new Date()) => now().toISOString().slice(0, 10);

export const createLocalAssetCopyDraft = ({ item, type = "skill", now } = {}) => {
  const dateStamp = getDateStamp(now);
  const draft = normalizeAssetTags({
    ...item,
    name: `${item.name} (Copy)`,
    enabled: false,
    source: "local",
    createdAt: dateStamp,
    updatedAt: dateStamp,
    id: undefined,
  });

  return type === "knowledge" ? { ...draft, type: "knowledge" } : draft;
};

export const createMarketplaceSkillCopyDraft = ({ item, skillCategories = [] }) => {
  const sharedTags = getItemSharedTags(item);

  return normalizeAssetTags({
    name: `${item.name} (Copy)`,
    description: item.description,
    category: item.category || skillCategories[0]?.value,
    trigger: item.trigger || "manual",
    instructions: item.instructions || "",
    sharedTags,
    games: sharedTags.game,
    isTemplate: true,
    source: "local",
    linkedTopics: [],
    linkedKnowledge: [],
  });
};

export const createApprovedMarketplaceAsset = ({ item, now } = {}) => {
  const dateStamp = getDateStamp(now);

  return normalizeAssetTags({
    ...item,
    source: "marketplace",
    installs: item.usageCount || 0,
    rating: item.rating || 0,
    reviewCount: item.reviewCount || 0,
    publishedAt: dateStamp,
    updatedAt: dateStamp,
  });
};

export const buildAssetDownload = ({ item, skillCategories, skillTriggers, knowledge }) => {
  const categoryLabel = item.type === "knowledge" ? item.category : getSkillCategoryLabel(skillCategories, item.category);
  const linkedKnowledgeNames =
    item.type === "skill"
      ? knowledge.filter((entry) => item.linkedKnowledge?.includes(entry.id)).map((entry) => entry.name)
      : [];

  return {
    fileName: `${sanitizeFileName(item.name)}.md`,
    markdownValue: buildAssetMarkdown({
      item,
      categoryLabel,
      triggerLabel: item.type === "knowledge" ? null : skillTriggers.find((trigger) => trigger.value === item.trigger)?.label || item.trigger,
      linkedKnowledgeNames,
    }),
  };
};

export const syncSkillKnowledgeLinks = ({ knowledge, skillId, nextLinkedKnowledge = [], previousLinkedKnowledge = [] }) =>
  knowledge.map((item) => {
    const wasLinked = previousLinkedKnowledge.includes(item.id);
    const isLinked = nextLinkedKnowledge.includes(item.id);

    if (isLinked && !wasLinked) return { ...item, linkedSkills: [...(item.linkedSkills || []), skillId] };
    if (!isLinked && wasLinked) return { ...item, linkedSkills: (item.linkedSkills || []).filter((id) => id !== skillId) };
    return item;
  });
