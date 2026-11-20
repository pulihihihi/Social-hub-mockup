export const hasMultiSelectFilter = (values) => Array.isArray(values) && values.length > 0;

export const matchesMultiSelectFilter = (candidate, values) => (
  !hasMultiSelectFilter(values) || values.includes(candidate)
);
