import dayjs from 'dayjs';
import { repairDataTextDeep } from '../../utils/textRepair';

export const normalizeEngage = (record) =>
  record.engage ?? record.engagement ?? record.engagements ?? 0;

export const normalizeHandle = (message) => {
  if (message.handle) return message.handle;
  if (typeof message.author === 'string' && message.author.startsWith('@')) return message.author;
  return null;
};

export const deriveChartDateMeta = (dateValue, fallbackLabel, chartDays = [], chartFullDates = []) => {
  const parsed = dayjs(dateValue);
  if (parsed.isValid()) {
    return {
      dateLabel: parsed.format('D MMM'),
      fullDate: parsed.format('dddd, D MMMM YYYY'),
    };
  }

  if (fallbackLabel) {
    const fullDate = chartFullDates[chartDays.indexOf(fallbackLabel)] || fallbackLabel;
    return { dateLabel: fallbackLabel, fullDate };
  }

  return {
    dateLabel: null,
    fullDate: null,
  };
};

export const normalizeDiscussionMessage = (message, options = {}) => {
  const repaired = repairDataTextDeep(message);
  const title = repaired.title || repaired.postTitle || '';
  const text = repaired.text || '';
  const postTitle = repaired.postTitle || title || text.slice(0, 80);
  const stableId = repaired.id || repaired.postId || `${repaired.source || repaired.platform || 'discussion'}-${repaired.author || 'anon'}-${repaired.date || repaired.text || 'item'}`;
  const dateMeta = deriveChartDateMeta(repaired.date, repaired.dateLabel, options.chartDays, options.chartFullDates);

  return {
    ...repaired,
    id: stableId,
    platform: repaired.platform || repaired.source || 'fb_fanpage',
    source: repaired.source || repaired.platform || 'fb_fanpage',
    handle: normalizeHandle(repaired),
    text,
    title,
    postTitle,
    postId: repaired.postId || stableId,
    engage: normalizeEngage(repaired),
    media: repaired.media || [],
    dateLabel: repaired.dateLabel || dateMeta.dateLabel,
    fullDate: repaired.fullDate || dateMeta.fullDate,
  };
};

export const normalizeDiscussionCollection = (records, options = {}) =>
  repairDataTextDeep(records).map((record) => normalizeDiscussionMessage(record, options));
