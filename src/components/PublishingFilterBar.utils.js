export const getPublishingFilterSummary = (values, fallback = 'Viewing all', options = []) => {
  if (!values?.length) {
    return fallback;
  }

  if (values.length === 1 && options.length) {
    return options.find((option) => option.value === values[0])?.label ?? values[0];
  }

  return values.length === 1 ? '1 selected' : `${values.length} selected`;
};
