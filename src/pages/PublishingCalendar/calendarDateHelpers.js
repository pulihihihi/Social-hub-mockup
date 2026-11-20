import dayjs from "dayjs";

export const WEEKDAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const INITIAL_MONTH = "2026-05-15";
export const TODAY = "2026-05-15";

const getMondayOffset = (date) => {
  const day = date.day();
  return day === 0 ? 6 : day - 1;
};

export const getCalendarWeekStart = (date) => date.subtract(getMondayOffset(date), "day");

export const buildMonthGrid = (month) => {
  const startOfMonth = month.startOf("month");
  const gridStart = startOfMonth.subtract(getMondayOffset(startOfMonth), "day");

  return Array.from({ length: 42 }, (_, index) => {
    const date = gridStart.add(index, "day");
    return {
      key: date.format("YYYY-MM-DD"),
      date,
      isCurrentMonth: date.month() === month.month(),
      isToday: date.format("YYYY-MM-DD") === TODAY,
    };
  });
};

export const buildWeekDays = (date) => {
  const startOfWeek = getCalendarWeekStart(date);

  return Array.from({ length: 7 }, (_, index) => {
    const day = startOfWeek.add(index, "day");
    return {
      key: day.format("YYYY-MM-DD"),
      date: day,
    };
  });
};

export const groupPostsByDate = (posts) =>
  posts.reduce((accumulator, post) => {
    if (!accumulator[post.date]) {
      accumulator[post.date] = [];
    }

    accumulator[post.date].push(post);
    return accumulator;
  }, {});

export const sortPostsByTime = (posts) =>
  [...posts].sort((left, right) => left.scheduledAt.localeCompare(right.scheduledAt));

export const countPostsByPlatform = (posts) =>
  posts.reduce((accumulator, post) => {
    accumulator[post.platform] = (accumulator[post.platform] || 0) + 1;
    return accumulator;
  }, {});

export const matchesFilter = (value, selectedValues) =>
  !selectedValues.length || selectedValues.includes(value);

export const getEffectivePostStatus = (post, now = dayjs()) => {
  if (post.status === "scheduled" && post.scheduledAt && !dayjs(post.scheduledAt).isAfter(now)) {
    return "published";
  }

  return post.status;
};

export const matchesTagFilter = (postTags, selectedTags) =>
  !selectedTags.length || selectedTags.some((tag) => postTags.includes(tag));

const getOptionLabel = (options, value) => (
  options.find((option) => option.value === value)?.label || value
);

export const getFilterSubtitle = (options, selectedValues, allLabel) => {
  if (!selectedValues.length || selectedValues.length === options.length) {
    return allLabel;
  }

  return selectedValues.map((value) => getOptionLabel(options, value)).join(", ");
};
