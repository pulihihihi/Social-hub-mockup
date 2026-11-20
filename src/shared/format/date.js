import dayjs from 'dayjs';

const UI_DATE_LOCALE = 'en';

export const formatUiShortDate = (value) => dayjs(value).locale(UI_DATE_LOCALE).format('D MMM YYYY');

export const formatUiDateRange = (startValue, endValue) => (
  `${formatUiShortDate(startValue)} - ${formatUiShortDate(endValue)}`
);
