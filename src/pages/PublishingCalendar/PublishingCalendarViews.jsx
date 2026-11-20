import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  Badge,
  Button,
  Divider,
  Dropdown,
  Empty,
  Popover,
  Space,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  HistoryOutlined,
  MoreOutlined,
  SendOutlined,
  PictureOutlined,
  PlusOutlined,
  TagsOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { PlatformIcon } from "../../components/SharedBadges";
import { T } from "../../theme";
import { PLATFORM_META, POST_TYPE_LABELS, STATUS_META } from "./calendarMockData";
import {
  WEEKDAY_LABELS,
  TODAY,
  buildMonthGrid,
  buildWeekDays,
  countPostsByPlatform,
  getEffectivePostStatus,
  sortPostsByTime,
} from "./calendarDateHelpers";

const { Text } = Typography;

export const PlatformDot = ({ platform }) => {
  const meta = PLATFORM_META[platform] || PLATFORM_META.other;

  return (
    <span
      className="publishing-calendar-platform-dot"
      style={{ background: meta.color }}
      title={meta.label}
    >
      {meta.shortLabel}
    </span>
  );
};

const stopCardEvent = (event) => {
  event.preventDefault();
  event.stopPropagation();
};

const isVideoPost = (post) => ["video", "reel", "story"].includes(post.postType);

const isFutureScheduledPost = (post) => (
  post.status === "scheduled" && dayjs(post.scheduledAt).isAfter(dayjs())
);

const isSentOutPost = (post) => getEffectivePostStatus(post) === "published";

const WEEK_TIMELINE_START_HOUR = 0;
const WEEK_TIMELINE_END_HOUR = 23;
const WEEK_TIMELINE_HOURS = Array.from(
  { length: WEEK_TIMELINE_END_HOUR - WEEK_TIMELINE_START_HOUR + 1 },
  (_, index) => WEEK_TIMELINE_START_HOUR + index,
);
const WEEK_TIMELINE_ROW_HEIGHT = 172;
const WEEK_LARGE_CARD_HEIGHT = 150;
const WEEK_LARGE_CARD_STACK_GAP = 16;
const WEEK_LARGE_HOUR_TOP_PADDING = 12;
const WEEK_LARGE_HOUR_BOTTOM_PADDING = 10;
const WEEK_INITIAL_SCROLL_HOUR = 8;
const WEEK_TODAY_LINE_HOUR = 10;

const formatHourLabel = (hour) => {
  if (hour === 0) {
    return "12 am";
  }

  if (hour < 12) {
    return `${hour} am`;
  }

  if (hour === 12) {
    return "12 pm";
  }

  return `${hour - 12} pm`;
};

const getPostTimelineHour = (post) => {
  const hour = dayjs(post.scheduledAt).hour();

  return Math.min(WEEK_TIMELINE_END_HOUR, Math.max(WEEK_TIMELINE_START_HOUR, hour));
};

const notifyPostAction = (action, post) => {
  message.info(`${action} is ready for ${post.channelName}`);
};

const notifyActivity = (post) => notifyPostAction("Activity", post);

const PostTagAction = ({ post }) => {
  const navigate = useNavigate();

  return (
    <Popover
      trigger="click"
      placement="bottomLeft"
      content={(
        <div className="publishing-calendar-tag-popover" onClick={stopCardEvent}>
          <Text strong>Tags</Text>
          <div className="publishing-calendar-tag-row">
            {post.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={(event) => {
              stopCardEvent(event);
              navigate("/settings/tag-management");
            }}
          >
            Manage tags
          </Button>
        </div>
      )}
    >
      <Tooltip title="Tag">
        <Button
          type="text"
          size="small"
          className="publishing-calendar-card-action"
          aria-label={`View tags for ${post.channelName}`}
          icon={<TagsOutlined />}
          onClick={stopCardEvent}
        />
      </Tooltip>
    </Popover>
  );
};

const PostActionButton = ({ icon, label, onClick, post }) => (
  <Tooltip title={label}>
    <Button
      type="text"
      size="small"
      className="publishing-calendar-card-action"
      aria-label={`${label} for ${post.channelName}`}
      icon={icon}
      onClick={(event) => {
        stopCardEvent(event);
        onClick?.();
      }}
    />
  </Tooltip>
);

const POST_MORE_PUBLISHED_ACTION_ITEMS = [
  { key: "duplicate", icon: <CopyOutlined />, label: "Duplicate" },
  { key: "activity", icon: <HistoryOutlined />, label: "Activity" },
  { key: "delete", icon: <DeleteOutlined />, label: "Delete" },
];

const POST_MORE_SCHEDULED_ACTION_ITEMS = [
  { key: "reschedule", icon: <CalendarOutlined />, label: "Reschedule" },
  ...POST_MORE_PUBLISHED_ACTION_ITEMS.slice(0, 2),
  { key: "send-now", icon: <SendOutlined />, label: "Send Now" },
  POST_MORE_PUBLISHED_ACTION_ITEMS[2],
];

const getPostMoreActionItems = (post) => (
  isSentOutPost(post) ? POST_MORE_PUBLISHED_ACTION_ITEMS : POST_MORE_SCHEDULED_ACTION_ITEMS
);

const PostMoreActionsDropdown = ({ buttonClassName, overlayClassName, post }) => {
  const actionItems = getPostMoreActionItems(post);

  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomLeft"
      classNames={{ root: overlayClassName || "publishing-calendar-week-more-menu" }}
      menu={{
        items: actionItems,
        onClick: ({ key }) => {
          const actionLabel = actionItems.find((item) => item.key === key)?.label || "Action";
          notifyPostAction(actionLabel, post);
        },
      }}
    >
      <Tooltip title="More">
        <Button
          type="text"
          size="small"
          className={buttonClassName}
          aria-label={`More actions for ${post.channelName}`}
          icon={<MoreOutlined />}
        />
      </Tooltip>
    </Dropdown>
  );
};

const CalendarPostInlineActions = ({ onOpenPost, post, showPostControls = false }) => (
  <>
    <PostTagAction post={post} />
    <PostActionButton
      icon={<CommentOutlined />}
      label="Start Team Conversation"
      post={post}
      onClick={() => notifyPostAction("Start Team Conversation", post)}
    />
    {showPostControls ? (
      <>
        <PostActionButton
          icon={<EyeOutlined />}
          label="Preview how a post displays before publishing"
          post={post}
          onClick={() => onOpenPost(post.id)}
        />
        <PostActionButton
          icon={<EditOutlined />}
          label="Edit"
          post={post}
          onClick={() => onOpenPost(post.id)}
        />
      </>
    ) : null}
  </>
);

const PostActionButtons = ({ onOpenPost, post }) => {
  const canManageScheduledPost = isFutureScheduledPost(post);
  const sentOut = isSentOutPost(post);
  const actions = [
    {
      key: "tag",
      render: () => <PostTagAction post={post} />,
    },
    {
      key: "conversation",
      label: "Start Team Conversation",
      icon: <CommentOutlined />,
      onClick: () => notifyPostAction("Start Team Conversation", post),
    },
    {
      key: "activity",
      label: "Activity",
      icon: <HistoryOutlined />,
      onClick: () => notifyActivity(post),
    },
    ...(sentOut ? [] : [
      {
        key: "duplicate",
        label: "Duplicate",
        icon: <CopyOutlined />,
        onClick: () => notifyPostAction("Duplicate", post),
      },
      ...(canManageScheduledPost ? [{
        key: "send-now",
        label: "Send Now",
        icon: <SendOutlined />,
        onClick: () => notifyPostAction("Send Now", post),
      }] : []),
      {
        key: "preview",
        label: "Preview how a post displays before publishing",
        icon: <EyeOutlined />,
        onClick: () => onOpenPost(post.id),
      },
      {
        key: "reschedule",
        label: "Reschedule",
        icon: <CalendarOutlined />,
        onClick: () => notifyPostAction("Reschedule", post),
      },
      {
        key: "edit",
        label: "Edit",
        icon: <EditOutlined />,
        onClick: () => notifyPostAction("Edit", post),
      },
      {
        key: "delete",
        label: "Delete",
        icon: <DeleteOutlined />,
        onClick: () => notifyPostAction("Delete", post),
      },
    ]),
  ];

  return (
    <Space size={12} className="publishing-calendar-feed-action-icons" onClick={stopCardEvent}>
      {actions.map((action) => (
        action.render
          ? <span key={action.key} className="publishing-calendar-inline-action">{action.render()}</span>
          : (
            <PostActionButton
              key={action.key}
              icon={action.icon}
              label={action.label}
              post={post}
              onClick={action.onClick}
            />
          )
      ))}
    </Space>
  );
};

const MonthLargeMetric = ({ post }) => {
  const metric = post.metricLabel || "N/A";
  const isPositive = metric !== "N/A" && metric !== "0%" && metric !== "-";

  return (
    <Tooltip title="Engagement Rate (per Impression)">
      <span
        className={isPositive ? "publishing-calendar-month-metric is-positive" : "publishing-calendar-month-metric"}
        aria-label={`Engagement Rate (per Impression): ${metric}`}
      >
        {isPositive ? <CheckCircleOutlined /> : null}
        {metric}
      </span>
    </Tooltip>
  );
};

const MonthLargeActions = ({ onOpenPost, post }) => {
  const showPostControls = !isSentOutPost(post);

  return (
    <div className="publishing-calendar-month-large-actions" onClick={stopCardEvent}>
      <PostMoreActionsDropdown
        post={post}
        buttonClassName="publishing-calendar-month-more-action"
      />
      <div className="publishing-calendar-month-large-inline-actions">
        <CalendarPostInlineActions
          post={post}
          onOpenPost={onOpenPost}
          showPostControls={showPostControls}
        />
        {showPostControls ? null : <MonthLargeMetric post={post} />}
      </div>
    </div>
  );
};

const MediaPreview = ({ post, variant = "month" }) => {
  if (!post.mediaCount) {
    return null;
  }

  const video = isVideoPost(post);
  const portraitFeed = variant === "feed" && (
    post.platform === "tiktok" ||
    post.platform === "instagram" ||
    ["reel", "story"].includes(post.postType)
  );

  return (
    <div
      className={[
        "publishing-calendar-media-preview",
        `is-${variant}`,
        video ? "is-video" : "is-image",
        portraitFeed ? "is-portrait" : "",
      ].join(" ")}
      aria-label={`${POST_TYPE_LABELS[post.postType]} preview`}
    >
      <div className="publishing-calendar-media-art">
        <div className="publishing-calendar-media-stripe" />
        <div className="publishing-calendar-media-shape" />
        {video ? (
          <span className="publishing-calendar-play-button">
            <VideoCameraOutlined />
          </span>
        ) : (
          <PictureOutlined className="publishing-calendar-image-glyph" />
        )}
      </div>
      {variant === "week" ? (
        <span className="publishing-calendar-media-caption">
          {post.mediaCount > 1 ? `${post.mediaCount} media` : POST_TYPE_LABELS[post.postType]}
        </span>
      ) : null}
    </div>
  );
};

const LargeWeekActionBar = ({ onOpenPost, post }) => {
  const showPostControls = !isSentOutPost(post);

  return (
    <div className="publishing-calendar-week-large-footer" onClick={stopCardEvent}>
      <PostMoreActionsDropdown
        post={post}
        buttonClassName="publishing-calendar-week-large-more"
      />
      <div className="publishing-calendar-week-large-actions">
        <CalendarPostInlineActions
          post={post}
          onOpenPost={onOpenPost}
          showPostControls={showPostControls}
        />
      </div>
    </div>
  );
};

const LargeWeekPostCard = ({ onOpen, post }) => {
  const captionNeedsMore = post.caption.length > 82;
  const platforms = getPostPlatforms(post);

  return (
    <article className="publishing-calendar-week-large-card">
      <div className="publishing-calendar-week-large-meta">
        <span className="publishing-calendar-week-large-platforms" aria-label="Publishing platforms">
          <WeekPostStatusIcon post={post} />
          {platforms.map((platform) => (
            <PlatformIcon key={platform} platform={platform} size="inline" />
          ))}
        </span>
        <button
          type="button"
          className="publishing-calendar-week-time-link"
          onClick={(event) => {
            stopCardEvent(event);
            onOpen(post.id);
          }}
        >
          {post.timeLabel}
        </button>
      </div>

      <div className="publishing-calendar-week-large-body">
        <div className="publishing-calendar-week-large-copy">
          <div className="publishing-calendar-week-large-caption">
            {post.caption}
          </div>
          {captionNeedsMore ? (
            <Button
              type="link"
              size="small"
              className="publishing-calendar-week-large-show-more"
              onClick={stopCardEvent}
            >
              Show More
            </Button>
          ) : null}
        </div>
        <MediaPreview post={post} variant="weekLarge" />
      </div>

      <LargeWeekActionBar post={post} onOpenPost={onOpen} />
    </article>
  );
};

const MonthLargePostCard = ({ onOpen, post }) => {
  const captionNeedsMore = post.caption.length > 68;
  const platforms = getPostPlatforms(post);

  return (
    <article className="publishing-calendar-month-large-card">
      <div className="publishing-calendar-month-large-meta">
        <CalendarOutlined className="publishing-calendar-month-large-source" />
        <span className="publishing-calendar-month-platforms" aria-label="Publishing platforms">
          {platforms.map((platform) => (
            <PlatformIcon key={platform} platform={platform} size="inline" />
          ))}
        </span>
        <button
          type="button"
          className="publishing-calendar-month-time-link"
          onClick={(event) => {
            stopCardEvent(event);
            onOpen(post.id);
          }}
        >
          {post.timeLabel}
        </button>
      </div>
      <div className="publishing-calendar-month-large-body">
        <div className="publishing-calendar-month-large-copy">
          <div className="publishing-calendar-month-large-caption">{post.caption}</div>
          {captionNeedsMore ? (
            <Button
              type="link"
              size="small"
              className="publishing-calendar-month-show-more"
              onClick={stopCardEvent}
            >
              Show More
            </Button>
          ) : null}
        </div>
        <MediaPreview post={post} variant="monthLarge" />
      </div>
      <MonthLargeActions post={post} onOpenPost={onOpen} />
    </article>
  );
};

const PostCard = ({ density, onOpen, post, variant = "month" }) => {
  const platformMeta = PLATFORM_META[post.platform] || PLATFORM_META.other;
  const statusMeta = STATUS_META[getEffectivePostStatus(post)] || STATUS_META.scheduled;
  const showMonthMedia = variant === "month" && density === "expanded" && post.mediaCount > 0;
  const showWeekMedia = variant === "week" && post.mediaCount > 0;

  if (variant === "month" && density === "expanded") {
    return <MonthLargePostCard post={post} onOpen={onOpen} />;
  }

  if (variant === "week" && density === "compact") {
    return <CompactWeekPostCard post={post} onOpen={onOpen} />;
  }

  return (
    <div
      className={[
        "publishing-calendar-post-card",
        density === "compact" ? "is-compact" : "",
        variant === "week" ? "is-week-card" : "",
        showMonthMedia ? "has-month-media" : "",
      ].filter(Boolean).join(" ")}
      style={{ borderLeftColor: platformMeta.color }}
    >
      <div className="publishing-calendar-post-topline">
        <div className="publishing-calendar-post-actions">
          <PlatformDot platform={post.platform} />
          <span className="publishing-calendar-post-time">{post.timeLabel}</span>
        </div>
        <Badge color={statusMeta.color} />
      </div>
      <div className={showMonthMedia ? "publishing-calendar-post-main has-media" : "publishing-calendar-post-main"}>
        <div className="publishing-calendar-post-copy">
          {variant === "week" ? (
            <div className="publishing-calendar-post-channel">{post.channelName}</div>
          ) : null}
          <div className="publishing-calendar-post-caption">{post.caption}</div>
        </div>
        {showMonthMedia ? <MediaPreview post={post} variant="month" /> : null}
      </div>
      {showWeekMedia ? <MediaPreview post={post} variant="week" /> : null}
      <div className="publishing-calendar-post-actions">
        <span className="publishing-calendar-action-cluster">
          <PostActionButtons post={post} onOpenPost={onOpen} />
          <span>{post.mediaCount ? `${post.mediaCount} media` : POST_TYPE_LABELS[post.postType]}</span>
          {post.hasConversation ? <CommentOutlined title="Team conversation" /> : null}
        </span>
        <Text type="secondary" style={{ fontSize: T.fontSizeXS }}>
          {post.metricLabel}
        </Text>
      </div>
    </div>
  );
};

const CompactDaySummary = ({
  dateKey,
  maxCount,
  onOpenCompactGroup,
  posts,
  selectedCompactGroup,
}) => {
  const platformCounts = countPostsByPlatform(posts);
  const summaryItems = Object.entries(platformCounts)
    .sort(([leftPlatform], [rightPlatform]) => {
      const leftLabel = PLATFORM_META[leftPlatform]?.label || leftPlatform;
      const rightLabel = PLATFORM_META[rightPlatform]?.label || rightPlatform;
      return leftLabel.localeCompare(rightLabel);
    });

  return (
    <div className="publishing-calendar-compact-stack">
      {summaryItems.map(([platform, count]) => {
        const platformLabel = PLATFORM_META[platform]?.label || platform;
        const isSelected = selectedCompactGroup?.dateKey === dateKey && selectedCompactGroup?.platform === platform;
        const widthRatio = Math.max(0.38, count / Math.max(maxCount, 1));

        return (
          <Button
            key={platform}
            className={isSelected ? "publishing-calendar-compact-pill is-active" : "publishing-calendar-compact-pill"}
            style={{ "--compact-ratio": widthRatio }}
            aria-label={`${platformLabel}: ${count} posts on ${dayjs(dateKey).format("ddd, D MMM YYYY")}`}
            onClick={() => onOpenCompactGroup?.({
              dateKey,
              platform,
            })}
          >
            <PlatformIcon platform={platform} size="inline" />
            <span>{count}</span>
          </Button>
        );
      })}
    </div>
  );
};

export const CalendarGrid = ({
  currentMonth,
  density,
  expandedDays,
  onCreateNote,
  onCreatePost,
  onOpenDayPosts,
  onOpenCompactGroup,
  onOpenPost,
  onToggleDay,
  postsByDate,
  selectedCompactGroup,
}) => {
  const days = useMemo(() => buildMonthGrid(currentMonth), [currentMonth]);
  const isCompact = density === "compact";
  const visibleLimit = 5;
  const maxCompactCount = useMemo(() => {
    const counts = days.flatMap((day) => {
      const dateKey = day.date.format("YYYY-MM-DD");

      return Object.values(countPostsByPlatform(postsByDate[dateKey] || []));
    });

    return Math.max(...counts, 1);
  }, [days, postsByDate]);

  return (
    <div
      className={isCompact ? "publishing-calendar-grid is-compact-month" : "publishing-calendar-grid is-large-month"}
      aria-label="Publishing calendar month grid"
    >
      {WEEKDAY_LABELS.map((label) => (
        <div key={label} className="publishing-calendar-weekday">
          {label}
        </div>
      ))}
      {days.map((day) => {
        const dateKey = day.date.format("YYYY-MM-DD");
        const dayPosts = sortPostsByTime(postsByDate[dateKey] || []);
        const isExpanded = expandedDays.includes(dateKey);
        const visiblePosts = dayPosts.slice(0, visibleLimit);
        const hiddenCount = Math.max(dayPosts.length - visiblePosts.length, 0);

        return (
          <div
            key={day.key}
            className={[
              "publishing-calendar-day",
              day.isCurrentMonth ? "" : "is-outside",
              day.isToday ? "is-today" : "",
            ].filter(Boolean).join(" ")}
          >
            <div className="publishing-calendar-day-header">
              <span className="publishing-calendar-day-number">{day.date.date()}</span>
              {dayPosts.length ? (
                <Text type="secondary" style={{ fontSize: T.fontSizeXS }}>
                  {dayPosts.length}
                </Text>
              ) : null}
            </div>
            <div className="publishing-calendar-posts">
              {isCompact ? (
                <CompactDaySummary
                  dateKey={dateKey}
                  maxCount={maxCompactCount}
                  posts={dayPosts}
                  selectedCompactGroup={selectedCompactGroup}
                  onOpenCompactGroup={onOpenCompactGroup}
                />
              ) : (
                <>
                  {visiblePosts.map((post) => (
                    <PostCard
                      key={post.id}
                      density={density}
                      post={post}
                      onOpen={onOpenPost}
                    />
                  ))}
                  {hiddenCount ? (
                    <Button
                      type="link"
                      className="publishing-calendar-view-more"
                      onClick={() => {
                        if (onOpenDayPosts) {
                          onOpenDayPosts({ dateKey });
                          return;
                        }

                        onToggleDay?.(dateKey);
                      }}
                    >
                      View {hiddenCount} more
                    </Button>
                  ) : isExpanded && dayPosts.length > visibleLimit ? (
                    <Button
                      type="link"
                      className="publishing-calendar-view-more"
                      onClick={() => onToggleDay(dateKey)}
                    >
                      Show less
                    </Button>
                  ) : null}
                </>
              )}
            </div>
            <div className="publishing-calendar-day-hover-actions">
              <Button
                type="dashed"
                icon={<EditOutlined />}
                data-tooltip="Schedule Post"
                title="Schedule Post"
                aria-label={`Schedule post for ${day.date.format("dddd, D MMM YYYY")}`}
                onClick={() => onCreatePost?.(day.date)}
              />
              <Button
                type="dashed"
                icon={<FileTextOutlined />}
                data-tooltip="Add Note"
                title="Add Note"
                aria-label={`Add note for ${day.date.format("dddd, D MMM YYYY")}`}
                onClick={() => onCreateNote?.(day.date)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const LargeWeekBoard = ({ currentDate, onCreatePost, onOpenPost, postsByDate }) => {
  const boardRef = useRef(null);
  const weekDays = useMemo(() => buildWeekDays(currentDate), [currentDate]);
  const hourRowHeights = useMemo(() => {
    const maxPostsByHour = new Map(WEEK_TIMELINE_HOURS.map((hour) => [hour, 0]));

    weekDays.forEach((day) => {
      const dateKey = day.date.format("YYYY-MM-DD");
      const countsByHour = new Map();

      (postsByDate[dateKey] || []).forEach((post) => {
        const hour = getPostTimelineHour(post);
        countsByHour.set(hour, (countsByHour.get(hour) || 0) + 1);
      });

      countsByHour.forEach((count, hour) => {
        maxPostsByHour.set(hour, Math.max(maxPostsByHour.get(hour) || 0, count));
      });
    });

    return WEEK_TIMELINE_HOURS.map((hour) => {
      const postCount = maxPostsByHour.get(hour) || 0;

      if (postCount === 0) {
        return WEEK_TIMELINE_ROW_HEIGHT;
      }

      return Math.max(
        WEEK_TIMELINE_ROW_HEIGHT,
        WEEK_LARGE_HOUR_TOP_PADDING +
          (postCount * WEEK_LARGE_CARD_HEIGHT) +
          ((postCount - 1) * WEEK_LARGE_CARD_STACK_GAP) +
          WEEK_LARGE_HOUR_BOTTOM_PADDING,
      );
    });
  }, [postsByDate, weekDays]);
  const hourOffsets = useMemo(
    () => hourRowHeights.map((_, index) => (
      hourRowHeights.slice(0, index).reduce((total, height) => total + height, 0)
    )),
    [hourRowHeights],
  );
  const totalHourHeight = useMemo(
    () => hourRowHeights.reduce((total, height) => total + height, 0),
    [hourRowHeights],
  );

  useLayoutEffect(() => {
    if (!boardRef.current) {
      return;
    }

    boardRef.current.scrollTop = hourOffsets[WEEK_INITIAL_SCROLL_HOUR - WEEK_TIMELINE_START_HOUR] || 0;
  }, [currentDate, hourOffsets]);

  return (
    <div
      ref={boardRef}
      className="publishing-calendar-week-board is-large"
      style={{
        "--week-hour-count": WEEK_TIMELINE_HOURS.length,
        "--week-hour-height": `${WEEK_TIMELINE_ROW_HEIGHT}px`,
        "--week-total-hour-height": `${totalHourHeight}px`,
        gridTemplateRows: `38px ${hourRowHeights.map((height) => `${height}px`).join(" ")}`,
      }}
    >
      <div className="publishing-calendar-week-time-corner" />
      {weekDays.map((day) => (
        <div
          key={day.key}
          className={day.date.format("YYYY-MM-DD") === TODAY ? "publishing-calendar-week-header is-active" : "publishing-calendar-week-header"}
        >
          <span>{day.date.format("dddd D")}</span>
          <Button
            type="text"
            size="small"
            icon={<PlusOutlined />}
            aria-label={`Add post or note for ${day.date.format("dddd D")}`}
            onClick={() => onCreatePost?.(day.date)}
          />
        </div>
      ))}

      {WEEK_TIMELINE_HOURS.map((hour, hourIndex) => (
        <div
          key={hour}
          className="publishing-calendar-week-time-label"
          style={{ gridColumn: 1, gridRow: hourIndex + 2 }}
        >
          {formatHourLabel(hour)}
        </div>
      ))}

      {weekDays.map((day, dayIndex) => {
        const dateKey = day.date.format("YYYY-MM-DD");
        const dayPosts = sortPostsByTime(postsByDate[dateKey] || []);
        const hourStackIndexes = new Map();
        const isToday = dateKey === TODAY;

        return (
          <div
            key={`${dateKey}-lane`}
            className="publishing-calendar-week-time-lane"
            style={{
              gridColumn: dayIndex + 2,
              gridRow: `2 / span ${WEEK_TIMELINE_HOURS.length}`,
            }}
          >
            {isToday ? (
              <div
                className="publishing-calendar-week-now-line"
                style={{ top: `${hourOffsets[WEEK_TODAY_LINE_HOUR - WEEK_TIMELINE_START_HOUR] || 0}px` }}
              />
            ) : null}
            {WEEK_TIMELINE_HOURS.map((hour, hourIndex) => (
              <div
                key={`${dateKey}-${hour}-rule`}
                className="publishing-calendar-week-hour-rule"
                style={{
                  top: hourOffsets[hourIndex],
                  height: hourRowHeights[hourIndex],
                }}
              />
            ))}
            {dayPosts.map((post) => {
              const hourKey = getPostTimelineHour(post);
              const stackIndex = hourStackIndexes.get(hourKey) || 0;
              hourStackIndexes.set(hourKey, stackIndex + 1);
              const hourIndex = hourKey - WEEK_TIMELINE_START_HOUR;
              const top =
                (hourOffsets[hourIndex] || 0) +
                WEEK_LARGE_HOUR_TOP_PADDING +
                (stackIndex * (WEEK_LARGE_CARD_HEIGHT + WEEK_LARGE_CARD_STACK_GAP));

              return (
                <div
                  key={post.id}
                  className="publishing-calendar-week-large-event"
                  style={{ top }}
                >
                  <LargeWeekPostCard post={post} onOpen={onOpenPost} />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export const WeekBoard = ({ currentDate, density, onCreatePost, onOpenPost, postsByDate }) => {
  const weekDays = useMemo(() => buildWeekDays(currentDate), [currentDate]);
  const scheduleSlotIndexes = useMemo(() => Array.from({ length: 6 }, (_, index) => index), []);
  const [activeScheduleSlot, setActiveScheduleSlot] = useState(null);

  if (density === "expanded") {
    return (
      <LargeWeekBoard
        currentDate={currentDate}
        onCreatePost={onCreatePost}
        onOpenPost={onOpenPost}
        postsByDate={postsByDate}
      />
    );
  }

  return (
    <div className="publishing-calendar-week-board">
      {weekDays.map((day) => {
        const dateKey = day.date.format("YYYY-MM-DD");
        const dayPosts = sortPostsByTime(postsByDate[dateKey] || []);

        return (
          <div key={dateKey} className="publishing-calendar-week-column">
            <div className={day.date.format("YYYY-MM-DD") === TODAY ? "publishing-calendar-week-header is-active" : "publishing-calendar-week-header"}>
              <span>{day.date.format("dddd D")}</span>
              <Button
                type="text"
                size="small"
                icon={<PlusOutlined />}
                aria-label={`Add post or note for ${day.date.format("dddd D")}`}
                onClick={onCreatePost}
              />
            </div>
            <div className="publishing-calendar-week-column-body">
              {dayPosts.length ? (
                dayPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    density={density}
                    post={post}
                    variant="week"
                    onOpen={onOpenPost}
                  />
                ))
              ) : null}
              {scheduleSlotIndexes.map((slotIndex) => (
                <WeekScheduleHoverSlot
                  key={`${dateKey}-schedule-slot-${slotIndex}`}
                  active={activeScheduleSlot === `${dateKey}-${slotIndex}`}
                  day={day}
                  onCreatePost={onCreatePost}
                  onActivate={() => setActiveScheduleSlot(`${dateKey}-${slotIndex}`)}
                  onDeactivate={() => setActiveScheduleSlot((slot) => (slot === `${dateKey}-${slotIndex}` ? null : slot))}
                  slotIndex={slotIndex}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const PostVolumeStrip = ({ onClose, onSelectDate, posts, selectedDate }) => {
  const maxBarHeight = 46;
  const minNonZeroBarHeight = 14;

  const days = useMemo(() => {
    const start = selectedDate.subtract(4, "day");
    return Array.from({ length: 20 }, (_, index) => {
      const date = start.add(index, "day");
      const count = posts.filter((post) => post.date === date.format("YYYY-MM-DD")).length;
      return { date, count };
    });
  }, [posts, selectedDate]);
  const maxCount = Math.max(...days.map((day) => day.count), 1);
  const getBarHeight = (count) => {
    if (!count) {
      return 3;
    }

    return Math.max(minNonZeroBarHeight, Math.round(maxBarHeight * (count / maxCount)));
  };

  return (
    <div className="publishing-calendar-volume-strip">
      <div className="publishing-calendar-volume-header">
        <Text strong>Post Volume</Text>
        <Button
          type="text"
          aria-label="Hide volume chart"
          icon={<CloseOutlined />}
          onClick={onClose}
        />
      </div>
      <div className="publishing-calendar-volume-days">
        {days.map((day, index) => {
          const dateLabel = day.date.format("ddd, D MMM YYYY");
          const postCountLabel = `${day.count} ${day.count === 1 ? "post" : "posts"}`;

          return (
            <Tooltip
              key={day.date.format("YYYY-MM-DD")}
              title={postCountLabel}
              placement="top"
              mouseEnterDelay={0.15}
            >
              <button
                type="button"
                className={day.date.isSame(selectedDate, "day") ? "publishing-calendar-volume-day is-active" : "publishing-calendar-volume-day"}
                aria-label={`Filter calendar to ${dateLabel}, ${postCountLabel}`}
                onClick={() => onSelectDate(day.date)}
              >
                <div
                  className={day.date.isSame(selectedDate, "day") ? "publishing-calendar-volume-bar is-active" : "publishing-calendar-volume-bar"}
                  style={{ height: getBarHeight(day.count) }}
                />
                <span>{day.date.date()}</span>
                {index === 0 ? <span>{day.date.format("MMM")}</span> : null}
              </button>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

const getCompactStatusLabel = (status) => {
  if (status === "published") {
    return "Sent Post";
  }

  if (status === "needs_approval") {
    return "Needs Approval";
  }

  return `${STATUS_META[status]?.label || "Scheduled"} Post`;
};

const getCompactHandle = (post) => (
  post.channelName
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\s+/g, "")
);

const getPostPlatforms = (post) => (
  Array.isArray(post.platforms) && post.platforms.length
    ? post.platforms
    : [post.platform]
);

const WEEK_STATUS_ICON = {
  draft: FileTextOutlined,
  failed: ExclamationCircleOutlined,
  needs_approval: ClockCircleOutlined,
  published: CheckCircleOutlined,
  scheduled: CalendarOutlined,
};

const WeekPostStatusIcon = ({ post }) => {
  const status = getEffectivePostStatus(post);
  const statusMeta = STATUS_META[status] || STATUS_META.scheduled;
  const StatusIcon = WEEK_STATUS_ICON[status] || CalendarOutlined;

  return (
    <Tooltip title={statusMeta.label}>
      <span
        className={`publishing-calendar-week-status-icon is-${status}`}
        style={{ "--post-status-color": statusMeta.color }}
        aria-label={statusMeta.label}
      >
        <StatusIcon />
      </span>
    </Tooltip>
  );
};

const CompactWeekActionBar = ({ onOpenPost, post }) => {
  const showPostControls = !isSentOutPost(post);

  return (
    <div className="publishing-calendar-week-compact-footer" onClick={stopCardEvent}>
      <PostMoreActionsDropdown
        post={post}
        buttonClassName="publishing-calendar-week-more-action"
      />
      <div className="publishing-calendar-week-inline-actions">
        <CalendarPostInlineActions
          post={post}
          onOpenPost={onOpenPost}
          showPostControls={showPostControls}
        />
      </div>
    </div>
  );
};

const CompactWeekPostCard = ({ onOpen, post }) => {
  const [expanded, setExpanded] = useState(false);
  const platformMeta = PLATFORM_META[post.platform] || PLATFORM_META.other;
  const captionNeedsMore = post.caption.length > 92;
  const platforms = getPostPlatforms(post);

  return (
    <article
      className={expanded ? "publishing-calendar-week-compact-card is-expanded" : "publishing-calendar-week-compact-card"}
      style={{ borderLeftColor: platformMeta.color }}
    >
      <div className="publishing-calendar-week-compact-meta">
        <WeekPostStatusIcon post={post} />
        <button
          type="button"
          className="publishing-calendar-week-time-link"
          onClick={(event) => {
            stopCardEvent(event);
            onOpen(post.id);
          }}
        >
          {post.timeLabel}
        </button>
      </div>

      <div className="publishing-calendar-week-profile-line">
        <span className="publishing-calendar-week-platforms" aria-label="Publishing platforms">
          {platforms.map((platform) => (
            <PlatformIcon key={platform} platform={platform} size="inline" />
          ))}
        </span>
        <Text strong className="publishing-calendar-week-profile-name">
          {post.channelName}
        </Text>
      </div>

      <div className="publishing-calendar-week-caption-block">
        <div className={expanded ? "publishing-calendar-week-caption is-expanded" : "publishing-calendar-week-caption"}>
          {post.caption}
        </div>
        {captionNeedsMore ? (
          <Button
            type="link"
            size="small"
            className="publishing-calendar-week-show-more"
            onClick={(event) => {
              stopCardEvent(event);
              setExpanded((value) => !value);
            }}
          >
            {expanded ? "Show Less" : "Show More"}
          </Button>
        ) : null}
      </div>

      <MediaPreview post={post} variant="weekCompact" />
      <CompactWeekActionBar post={post} onOpenPost={onOpen} />
    </article>
  );
};

const WeekScheduleHoverSlot = ({ active, day, onActivate, onCreatePost, onDeactivate, slotIndex }) => {
  const hiddenSlotContentStyle = active ? undefined : { visibility: "hidden" };
  const activeSlotStyle = active ? {
    background: "#fbfcfc",
    borderColor: "#314044",
    borderLeftColor: "#8c9a9f",
    boxShadow: "0 0 0 2px rgba(49, 64, 68, 0.06)",
  } : undefined;

  return (
    <div
      className={active ? "publishing-calendar-week-compact-card publishing-calendar-week-schedule-card is-visible" : "publishing-calendar-week-compact-card publishing-calendar-week-schedule-card"}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      style={activeSlotStyle}
    >
      <div className="publishing-calendar-week-compact-meta" aria-hidden="true" style={hiddenSlotContentStyle}>
      <span className="publishing-calendar-week-schedule-status">
        <CalendarOutlined />
      </span>
      <span className="publishing-calendar-week-schedule-time" />
      </div>

      <div className="publishing-calendar-week-profile-line" aria-hidden="true" style={hiddenSlotContentStyle}>
        <span className="publishing-calendar-week-platforms">
          <span className="publishing-calendar-week-schedule-platform-dot" />
        </span>
        <span className="publishing-calendar-week-hover-line is-profile" />
      </div>

      <div className="publishing-calendar-week-caption-block" aria-hidden="true" style={hiddenSlotContentStyle}>
        <span className="publishing-calendar-week-hover-line is-long" />
        <span className="publishing-calendar-week-hover-line" />
        <span className="publishing-calendar-week-hover-line is-medium" />
        <span className="publishing-calendar-week-hover-media" />
      </div>

      <Button
        block
        className="publishing-calendar-week-schedule-button"
        onClick={() => onCreatePost?.(day.date)}
        aria-label={`Schedule post for ${day.date.format("dddd D")}, empty slot ${slotIndex + 1}`}
        style={hiddenSlotContentStyle}
      >
        Schedule Post
      </Button>
    </div>
  );
};

const ListFeedCard = ({ actionVariant = "feed", density = "compact", onOpenPost, post }) => {
  const platformMeta = PLATFORM_META[post.platform] || PLATFORM_META.other;
  const handle = getCompactHandle(post);
  const statusLabel = getCompactStatusLabel(getEffectivePostStatus(post));
  const isLarge = density === "expanded";
  const authorName = post.authorName || "Xuan Tien M.";

  return (
    <div className={isLarge ? "publishing-calendar-feed-card is-large" : "publishing-calendar-feed-card"}>
      <div className="publishing-calendar-feed-header">
        <div className="publishing-calendar-feed-avatar">
          <span className="publishing-calendar-feed-avatar-photo" />
          <span className="publishing-calendar-feed-platform-badge" style={{ background: platformMeta.color }}>
            {platformMeta.shortLabel}
          </span>
        </div>
        <div className="publishing-calendar-feed-identity">
          <div className="publishing-calendar-feed-title">
            {isLarge ? <PlatformIcon platform={post.platform} size="inline" /> : null}
            <span>{post.channelName}</span>
            {isLarge ? (
              <Text type="secondary" className="publishing-calendar-feed-title-handle">
                {handle}
              </Text>
            ) : null}
          </div>
          <Text type="secondary" className="publishing-calendar-feed-subtitle">
            {statusLabel}
          </Text>
        </div>
        <Text type="secondary" className="publishing-calendar-feed-handle">
          {handle}
        </Text>
        <Text type="secondary" className="publishing-calendar-feed-date">
          {dayjs(post.date).format("ddd, D MMM YYYY")} {post.timeLabel}
        </Text>
      </div>
      <div className="publishing-calendar-feed-body-row">
        <div className="publishing-calendar-feed-body">
          {post.caption}
          {post.caption.length > 132 ? (
            <Button type="link" size="small" className="publishing-calendar-feed-show-more" onClick={stopCardEvent}>
              Show More
            </Button>
          ) : null}
        </div>
        <MediaPreview post={post} variant="feed" />
      </div>
      <div className="publishing-calendar-feed-footer">
        {isLarge ? (
          <div className="publishing-calendar-feed-author">
            <span className="publishing-calendar-feed-author-mark">MXT</span>
            <Text type="secondary">by {authorName}</Text>
          </div>
        ) : null}
        <PostActionButtons actionVariant={actionVariant} post={post} onOpenPost={onOpenPost} />
      </div>
    </div>
  );
};

export const CalendarPostSidePanel = ({
  onClose,
  onOpenPost,
  posts,
  selection,
}) => {
  const panelPosts = sortPostsByTime(posts);
  const platformMeta = selection.platform ? (PLATFORM_META[selection.platform] || PLATFORM_META.other) : null;
  const dateLabel = dayjs(selection.dateKey).format("ddd, D MMM YYYY");
  const countLabel = `${panelPosts.length} ${panelPosts.length === 1 ? "post" : "posts"}`;
  const panelLabel = platformMeta ? `${platformMeta.label} posts on ${dateLabel}` : `Posts on ${dateLabel}`;

  return (
    <aside className="publishing-calendar-post-side-panel" aria-label={panelLabel}>
      <div className="publishing-calendar-post-side-header">
        <div className="publishing-calendar-post-side-title">
          <Text strong>{dateLabel}</Text>
          <span className="publishing-calendar-post-side-count">
            {platformMeta ? <PlatformIcon platform={selection.platform} size="inline" /> : null}
            {countLabel}
          </span>
        </div>
        <Button type="text" aria-label="Close post list" icon={<CloseOutlined />} onClick={onClose} />
      </div>
      <div className="publishing-calendar-post-side-body">
        {panelPosts.length ? (
          <div className="publishing-calendar-post-side-list">
            {panelPosts.map((post) => (
              <ListFeedCard key={post.id} actionVariant="sidePanel" post={post} onOpenPost={onOpenPost} />
            ))}
          </div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No posts in this group" />
        )}
      </div>
    </aside>
  );
};

const CalendarNoPostsEmpty = ({ onCreatePost }) => (
  <div className="publishing-calendar-no-posts-empty">
    <div className="publishing-calendar-empty-illustration" aria-hidden="true">
      <span className="publishing-calendar-empty-dot is-ring" />
      <span className="publishing-calendar-empty-dot is-small" />
      <span className="publishing-calendar-empty-plus is-left">+</span>
      <span className="publishing-calendar-empty-plus is-right">+</span>
      <div className="publishing-calendar-empty-calendar">
        <span className="publishing-calendar-empty-binding is-one" />
        <span className="publishing-calendar-empty-binding is-two" />
        <span className="publishing-calendar-empty-binding is-three" />
        <span className="publishing-calendar-empty-binding is-four" />
        <span className="publishing-calendar-empty-binding is-five" />
        <span className="publishing-calendar-empty-calendar-top" />
        <span className="publishing-calendar-empty-cell is-highlight" />
      </div>
      <div className="publishing-calendar-empty-lens">
        <span className="publishing-calendar-empty-check">✓</span>
      </div>
      <span className="publishing-calendar-empty-handle" />
    </div>
    <Text strong className="publishing-calendar-no-posts-title">
      No content found for this profile
    </Text>
    <Button type="primary" onClick={onCreatePost}>
      Compose a Post
    </Button>
  </div>
);

export const PostListView = ({
  calendarRange,
  currentDate,
  density = "compact",
  emptyDescription,
  onCreateNote,
  onCreatePost,
  onOpenPost,
  posts,
}) => {
  if (!posts.length) {
    return (
      <div className="publishing-calendar-empty">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyDescription} />
      </div>
    );
  }

  const rangeStart = calendarRange?.[0] || currentDate;
  const rawRangeEnd = calendarRange?.[1] || rangeStart;
  const rangeEnd = rawRangeEnd.isBefore(rangeStart, "day") ? rangeStart : rawRangeEnd;
  const rangeDayCount = Math.min(rangeEnd.diff(rangeStart, "day") + 1, 62);
  const rangeDays = Array.from({ length: rangeDayCount }, (_, index) => rangeStart.add(index, "day"));
  const isSingleDayRange = rangeDayCount === 1;
  const singleDayPosts = isSingleDayRange
    ? posts.filter((post) => dayjs(post.date).isSame(rangeStart, "day"))
    : [];
  const shouldShowNoPostsEmpty = isSingleDayRange && !singleDayPosts.length;

  return (
    <div className={density === "expanded" ? "publishing-calendar-list-source-view is-large" : "publishing-calendar-list-source-view"}>
      {shouldShowNoPostsEmpty ? (
        <div className="publishing-calendar-feed-stack">
          <CalendarNoPostsEmpty onCreatePost={onCreatePost} />
        </div>
      ) : (
        <div className="publishing-calendar-range-sections">
          {rangeDays.map((day) => {
            const dateKey = day.format("YYYY-MM-DD");
            const dayPosts = posts.filter((post) => dayjs(post.date).isSame(day, "day"));

            return (
              <section key={dateKey} className="publishing-calendar-range-section">
                <Divider plain className="publishing-calendar-list-day-divider">
                  {day.format("ddd, D MMMM YYYY")}
                </Divider>
                <div className="publishing-calendar-list-actions">
                  <Button type="dashed" block icon={<EditOutlined />} onClick={onCreatePost}>Schedule Post</Button>
                  <Button type="dashed" block icon={<FileTextOutlined />} onClick={() => onCreateNote(day)}>Add Note</Button>
                </div>
                {dayPosts.length ? (
                  <div className="publishing-calendar-feed-stack">
                    {dayPosts.map((post) => (
                      <ListFeedCard key={post.id} density={density} post={post} onOpenPost={onOpenPost} />
                    ))}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      )}
      {shouldShowNoPostsEmpty ? null : (
        <div className="publishing-calendar-end-message">
          There is no more content within this date range. To see more, adjust the date range and content filters.
        </div>
      )}
    </div>
  );
};
