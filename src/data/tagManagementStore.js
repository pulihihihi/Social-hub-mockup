import { useEffect, useState } from 'react';
import { SYSTEM_TAGS } from './tagManagement';
import {
  buildTagTaxonomyFromLegacy,
  collectionsToTagTaxonomy,
  normalizeTagTaxonomy,
  tagTaxonomyToCollections,
} from './tagGroupModel';

const TAG_TAXONOMY_STORAGE_KEY = 'socialhub.tagTaxonomy.v1';
const TAG_TAXONOMY_EVENT = 'socialhub:tag-taxonomy-changed';
const TAG_COLLECTIONS_STORAGE_KEY = 'socialhub.tagCollections.v1';
const TAG_COLLECTIONS_EVENT = 'socialhub:tag-collections-changed';
const ACTIVE_CAMPAIGNS_STORAGE_KEY = 'socialhub.activeCampaigns.v1';
const ACTIVE_CAMPAIGNS_EVENT = 'socialhub:active-campaigns-changed';
const SYSTEM_TAGS_STORAGE_KEY = 'socialhub.systemTags.v1';
const SYSTEM_TAGS_EVENT = 'socialhub:system-tags-changed';

const cloneCollections = (collections) => (
  collections.map((collection) => ({
    ...collection,
    tags: [...(collection.tags || [])],
    tagIds: [...(collection.tagIds || [])],
    stats: collection.stats ? collection.stats.map((stat) => ({ ...stat })) : undefined,
  }))
);

const cloneTagTaxonomy = (taxonomy) => {
  const normalized = normalizeTagTaxonomy(taxonomy);

  return {
    tags: normalized.tags.map((tag) => ({ ...tag })),
    tagGroups: normalized.tagGroups.map((group) => ({
      ...group,
      tagIds: [...(group.tagIds || [])],
      systemTagIds: [...(group.systemTagIds || [])],
      stats: group.stats ? group.stats.map((stat) => ({ ...stat })) : undefined,
    })),
  };
};

const cloneSystemTags = (tags) => (
  tags.map((tag) => ({
    ...tag,
    appliesTo: [...(tag.appliesTo || [])],
  }))
);

const readStoredArray = (storageKey) => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(storageKey);
    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
};

const readStoredTaxonomy = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(TAG_TAXONOMY_STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue);
    return parsedValue && typeof parsedValue === 'object' ? parsedValue : null;
  } catch {
    return null;
  }
};

const buildInitialTagTaxonomy = () => (
  buildTagTaxonomyFromLegacy({
    activeCampaigns: readStoredArray(ACTIVE_CAMPAIGNS_STORAGE_KEY) || undefined,
    collections: readStoredArray(TAG_COLLECTIONS_STORAGE_KEY) || undefined,
  })
);

const mergeSystemTags = (storedTags) => {
  if (!Array.isArray(storedTags)) {
    return cloneSystemTags(SYSTEM_TAGS);
  }

  const storedById = new Map(storedTags.map((tag) => [tag.id, tag]));

  return SYSTEM_TAGS.map((tag) => {
    const storedTag = storedById.get(tag.id);

    return {
      ...tag,
      enabled: typeof storedTag?.enabled === 'boolean' ? storedTag.enabled : tag.enabled,
    };
  });
};

export const getManagedTagTaxonomy = () => (
  cloneTagTaxonomy(readStoredTaxonomy() || buildInitialTagTaxonomy())
);

export const setManagedTagTaxonomy = (taxonomy) => {
  const nextTaxonomy = cloneTagTaxonomy(taxonomy);

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(TAG_TAXONOMY_STORAGE_KEY, JSON.stringify(nextTaxonomy));
    window.dispatchEvent(new CustomEvent(TAG_TAXONOMY_EVENT, {
      detail: { taxonomy: nextTaxonomy },
    }));
    window.dispatchEvent(new CustomEvent(TAG_COLLECTIONS_EVENT, {
      detail: { collections: tagTaxonomyToCollections(nextTaxonomy) },
    }));
    window.dispatchEvent(new CustomEvent(ACTIVE_CAMPAIGNS_EVENT, {
      detail: {
        campaigns: tagTaxonomyToCollections(nextTaxonomy)
          .filter((group) => group.legacySource === 'campaign' && !group.archived),
      },
    }));
  }

  return nextTaxonomy;
};

export const getManagedTagCollections = () => (
  cloneCollections(tagTaxonomyToCollections(getManagedTagTaxonomy()))
);

export const setManagedTagCollections = (collections) => {
  const nextTaxonomy = collectionsToTagTaxonomy(collections);
  setManagedTagTaxonomy(nextTaxonomy);
  return getManagedTagCollections();
};

export const getManagedSystemTags = () => {
  if (typeof window === 'undefined') {
    return cloneSystemTags(SYSTEM_TAGS);
  }

  try {
    const storedTags = window.localStorage.getItem(SYSTEM_TAGS_STORAGE_KEY);
    if (!storedTags) {
      return cloneSystemTags(SYSTEM_TAGS);
    }

    return mergeSystemTags(JSON.parse(storedTags));
  } catch {
    return cloneSystemTags(SYSTEM_TAGS);
  }
};

export const setManagedSystemTags = (tags) => {
  const nextTags = cloneSystemTags(tags);

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(SYSTEM_TAGS_STORAGE_KEY, JSON.stringify(nextTags));
    window.dispatchEvent(new CustomEvent(SYSTEM_TAGS_EVENT, {
      detail: { tags: nextTags },
    }));
  }

  return nextTags;
};

export const useManagedTagTaxonomy = () => {
  const [taxonomy, setTaxonomyState] = useState(getManagedTagTaxonomy);

  useEffect(() => {
    const syncTaxonomy = (event) => {
      if (event.type === 'storage' && ![TAG_TAXONOMY_STORAGE_KEY, TAG_COLLECTIONS_STORAGE_KEY].includes(event.key)) {
        return;
      }

      setTaxonomyState(
        event.detail?.taxonomy
          ? cloneTagTaxonomy(event.detail.taxonomy)
          : getManagedTagTaxonomy(),
      );
    };

    window.addEventListener(TAG_TAXONOMY_EVENT, syncTaxonomy);
    window.addEventListener(TAG_COLLECTIONS_EVENT, syncTaxonomy);
    window.addEventListener('storage', syncTaxonomy);

    return () => {
      window.removeEventListener(TAG_TAXONOMY_EVENT, syncTaxonomy);
      window.removeEventListener(TAG_COLLECTIONS_EVENT, syncTaxonomy);
      window.removeEventListener('storage', syncTaxonomy);
    };
  }, []);

  const setTaxonomy = (updater) => {
    setTaxonomyState((currentTaxonomy) => {
      const nextTaxonomy = typeof updater === 'function'
        ? updater(cloneTagTaxonomy(currentTaxonomy))
        : updater;

      return setManagedTagTaxonomy(nextTaxonomy);
    });
  };

  return [taxonomy, setTaxonomy];
};

export const useManagedTagCollections = () => {
  const [taxonomy, setTaxonomy] = useManagedTagTaxonomy();
  const collections = cloneCollections(tagTaxonomyToCollections(taxonomy));

  const setCollections = (updater) => {
    const nextCollections = typeof updater === 'function'
      ? updater(cloneCollections(collections))
      : updater;

    setTaxonomy(collectionsToTagTaxonomy(nextCollections));
  };

  return [collections, setCollections];
};

export const useManagedSystemTags = () => {
  const [systemTags, setSystemTagsState] = useState(getManagedSystemTags);

  useEffect(() => {
    const syncSystemTags = (event) => {
      if (event.type === 'storage' && event.key !== SYSTEM_TAGS_STORAGE_KEY) {
        return;
      }

      setSystemTagsState(
        event.detail?.tags
          ? cloneSystemTags(event.detail.tags)
          : getManagedSystemTags(),
      );
    };

    window.addEventListener(SYSTEM_TAGS_EVENT, syncSystemTags);
    window.addEventListener('storage', syncSystemTags);

    return () => {
      window.removeEventListener(SYSTEM_TAGS_EVENT, syncSystemTags);
      window.removeEventListener('storage', syncSystemTags);
    };
  }, []);

  const setSystemTags = (updater) => {
    setSystemTagsState((currentTags) => {
      const nextTags = typeof updater === 'function'
        ? updater(cloneSystemTags(currentTags))
        : updater;

      return setManagedSystemTags(nextTags);
    });
  };

  return [systemTags, setSystemTags];
};
