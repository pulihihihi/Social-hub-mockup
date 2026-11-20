const extractSortableNumber = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  const numericParts = String(value ?? '').match(/\d+/g);
  if (!numericParts?.length) {
    return null;
  }

  return Math.max(...numericParts.map((part) => Number(part)).filter(Number.isFinite));
};

export const compareIdsAscending = (leftId, rightId) => {
  const leftNumber = extractSortableNumber(leftId);
  const rightNumber = extractSortableNumber(rightId);

  if (leftNumber !== null && rightNumber !== null && leftNumber !== rightNumber) {
    return leftNumber - rightNumber;
  }

  return String(leftId ?? '').localeCompare(String(rightId ?? ''), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
};

export const compareRecordIdsAscending = (leftRecord, rightRecord) => (
  compareIdsAscending(leftRecord?.id, rightRecord?.id)
);

export const sortByIdDescending = (records = []) => (
  [...records].sort((leftRecord, rightRecord) => compareRecordIdsAscending(rightRecord, leftRecord))
);

export const withNumericDisplayIds = (records = [], displayField = 'displayId') => (
  records.map((record, index) => ({
    ...record,
    [displayField]: index + 1,
  }))
);

export const compareDisplayIdsAscending = (
  leftRecord,
  rightRecord,
  displayField = 'displayId',
) => (
  (Number(leftRecord?.[displayField]) || 0) - (Number(rightRecord?.[displayField]) || 0)
);

export const sortByDisplayIdDescending = (records = [], displayField = 'displayId') => (
  [...records].sort((leftRecord, rightRecord) => (
    compareDisplayIdsAscending(rightRecord, leftRecord, displayField)
  ))
);
