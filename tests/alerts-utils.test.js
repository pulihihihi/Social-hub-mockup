import { describe, expect, it } from 'vitest';
import {
  buildChannelSummary,
  buildRuleCondition,
  buildTopicFrequencyLookup,
  sanitizeRecipients,
} from '../src/pages/Alerts/alertsUtils';

describe('alerts utilities', () => {
  it('normalizes comma and tag recipient input', () => {
    expect(sanitizeRecipients('hai@garena.vn, son@garena.vn  ,')).toEqual([
      'hai@garena.vn',
      'son@garena.vn',
    ]);
    expect(sanitizeRecipients([' hai@garena.vn ', '', 'son@garena.vn'])).toEqual([
      'hai@garena.vn',
      'son@garena.vn',
    ]);
  });

  it('summarizes delivery channels using configured labels', () => {
    expect(buildChannelSummary([])).toBe('-');
    expect(buildChannelSummary(['email'])).toBe('Email');
    expect(buildChannelSummary(['email', 'seatalk'])).toBe('Email +1');
  });

  it('uses topic frequency when building rule conditions', () => {
    const topicFrequencyLookup = buildTopicFrequencyLookup([
      { name: 'Brand Health VN', updateFrequency: '1h' },
    ]);

    expect(buildRuleCondition({
      topic: 'Brand Health VN',
      metric: 'negativeSentiment',
      direction: 'increase',
      thresholdType: 'percent',
      thresholdValue: 15,
    }, topicFrequencyLookup)).toBe('Negative sentiment up 15% / 1 hour');
  });
});
