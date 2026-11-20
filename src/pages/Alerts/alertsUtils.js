import dayjs from "dayjs";
import {
  DEFAULT_TOPIC_UPDATE_FREQUENCY,
  TOPIC_UPDATE_FREQUENCY_LABELS,
} from "../../domain/topic/contracts";
import { DELIVERY_CHANNELS, METRIC_LABELS } from "./alertsData";

const UI_DATE_LOCALE = "en";

export const formatDateTime = (value) => (
  value ? dayjs(value).locale(UI_DATE_LOCALE).format("D MMM YYYY, HH:mm") : "-"
);

export const sanitizeRecipients = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (!value) {
    return [];
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const buildTopicFrequencyLookup = (topics) =>
  topics.reduce((accumulator, topic) => {
    accumulator[topic.name] = topic.updateFrequency || DEFAULT_TOPIC_UPDATE_FREQUENCY;
    return accumulator;
  }, {});

export const getRuleUpdateFrequency = (rule, topicFrequencyLookup) =>
  topicFrequencyLookup[rule.topic] || rule.updateFrequency || DEFAULT_TOPIC_UPDATE_FREQUENCY;

export const buildRuleCondition = (rule, topicFrequencyLookup = {}) => {
  const direction = rule.direction === "increase" ? "up" : "down";
  const thresholdSuffix = rule.thresholdType === "percent" ? "%" : "";
  const updateFrequency = getRuleUpdateFrequency(rule, topicFrequencyLookup);
  return `${METRIC_LABELS[rule.metric] || rule.metric} ${direction} ${rule.thresholdValue}${thresholdSuffix} / ${TOPIC_UPDATE_FREQUENCY_LABELS[updateFrequency] || updateFrequency}`;
};

export const buildChannelSummary = (channels = []) => {
  if (!channels.length) {
    return "-";
  }

  const labels = channels.map((channel) => DELIVERY_CHANNELS.find((item) => item.key === channel)?.label || channel);
  return labels.length === 1 ? labels[0] : `${labels[0]} +${labels.length - 1}`;
};

export const getDateSortValue = (value) => (value ? dayjs(value).valueOf() : 0);
