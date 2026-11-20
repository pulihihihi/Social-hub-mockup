import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { afterEach, describe, expect, it } from 'vitest';
import { formatUiDateRange, formatUiShortDate } from '../src/shared/format/date';

describe('ui date formatting', () => {
  afterEach(() => {
    dayjs.locale('en');
  });

  it('keeps UI dates in English even when the global dayjs locale changes', () => {
    dayjs.locale('zh-cn');

    expect(formatUiShortDate('2026-04-17')).toBe('17 Apr 2026');
    expect(formatUiDateRange('2026-03-18', '2026-04-17')).toBe('18 Mar 2026 - 17 Apr 2026');
  });
});
