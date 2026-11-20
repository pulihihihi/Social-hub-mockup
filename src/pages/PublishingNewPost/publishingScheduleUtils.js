import dayjs from 'dayjs';

export const canUseOptimalTimes = (scheduledTime) => Boolean(scheduledTime?.date);

export const applyOptimalTimeToDate = (date, timeValue) => {
  const [hour, minute] = timeValue.split(':').map(Number);
  const baseDate = date || dayjs();

  return baseDate.hour(hour).minute(minute).second(0);
};
