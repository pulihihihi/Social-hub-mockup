import {
  getSharedTagValues,
  normalizeSharedTags,
} from "./taxonomy";

export const LOCAL_PAGE_SIZE = 9;
export const KNOWLEDGE_PAGE_SIZE = 9;
export const MP_PAGE_SIZE = 9;
export const APPROVAL_PAGE_SIZE = 9;

export const getCardColumns = (viewportWidth) => {
  if (viewportWidth >= 1280) return 3;
  if (viewportWidth >= 768) return 2;
  return 1;
};

export const getSkillCategoryLabel = (categories, category) =>
  categories.find((item) => item.value === category)?.label || category;

export const getTriggerLabel = (triggers, trigger) =>
  triggers.find((item) => item.value === trigger)?.label || trigger;

export const hasSelectedValues = (values) => Array.isArray(values) && values.length > 0;

export const matchesSelectedValues = (candidate, values) => !hasSelectedValues(values) || values.includes(candidate);

export const matchesArrayValues = (candidateValues = [], values) =>
  !hasSelectedValues(values) || candidateValues.some((value) => values.includes(value));

export const getItemSharedTags = (item) => normalizeSharedTags(item?.sharedTags, item?.games);

export const normalizeAssetTags = (item) => {
  const sharedTags = getItemSharedTags(item);
  return {
    ...item,
    sharedTags,
    games: [...sharedTags.game],
  };
};

export const matchesItemSearch = (item, query) => {
  const normalizedQuery = query.toLowerCase();
  const searchableValues = [
    item.name,
    item.description,
    item.category,
    ...(item.tags || []),
    ...getSharedTagValues(item.sharedTags, item.games),
  ];

  return searchableValues.some((value) => String(value || "").toLowerCase().includes(normalizedQuery));
};

export const sanitizeFileName = (value) =>
  String(value || "asset")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "asset";
