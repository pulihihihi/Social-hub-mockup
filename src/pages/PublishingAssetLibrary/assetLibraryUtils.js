export const assetTypeValue = (type) => (type === 'template' ? 'post-template' : type);

export const intersects = (left = [], right = []) => left.some((item) => right.includes(item));

export const matchesAssetFilters = (asset, filters) => {
  const selectedContext = filters.context.filter((value) => ['compose', 'reply'].includes(value));
  const selectedTypes = filters.context.filter((value) => ['image', 'video', 'text', 'post-template'].includes(value));
  const selectedTags = filters.tags.filter((value) => value !== '__no_tags_applied__');
  const wantsNoTags = filters.tags.includes('__no_tags_applied__');
  const assetTags = asset.tags || [];

  if (selectedContext.length && !intersects(asset.context || [], selectedContext)) {
    return false;
  }

  if (selectedTypes.length && !selectedTypes.includes(assetTypeValue(asset.type))) {
    return false;
  }

  if (selectedTags.length && !intersects(assetTags, selectedTags)) {
    return false;
  }

  if (wantsNoTags && assetTags.length) {
    return false;
  }

  if (filters.authors.length && !filters.authors.includes(String(asset.author).toLowerCase())) {
    return false;
  }

  return true;
};

export const matchesFolderFilters = (folder, filters) => {
  const selectedContext = filters.context.filter((value) => !['all-context', 'all-type'].includes(value));
  const selectedTags = filters.tags.filter((value) => value !== '__no_tags_applied__');

  if (selectedContext.length || selectedTags.length) {
    return false;
  }

  return !filters.authors.length || filters.authors.includes(String(folder.author).toLowerCase());
};
