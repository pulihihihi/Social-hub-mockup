import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import enGB from "antd/es/date-picker/locale/en_GB";
import {
  Button,
  Checkbox,
  DatePicker,
  Drawer,
  Dropdown,
  Form,
  Input,
  Modal,
  Popover,
  Radio,
  Select,
  Space,
  Tag,
  Typography,
  Upload,
  message,
} from "antd";
import {
  BarChartOutlined,
  CalendarOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  CommentOutlined,
  DownOutlined,
  FileTextOutlined,
  HighlightOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  PictureOutlined,
  RightOutlined,
  SmileOutlined,
  StarOutlined,
  SwapRightOutlined,
  TagsOutlined,
  TeamOutlined,
  ToolOutlined,
  TranslationOutlined,
  UploadOutlined,
  UpOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import AdminPageLayout from "../../components/AdminPageLayout";
import { T } from "../../theme";
import {
  CALENDAR_POSTS,
  PLATFORM_META,
  POST_TYPE_LABELS,
  STATUS_META,
} from "./calendarMockData";
import {
  CalendarGrid,
  CalendarPostSidePanel,
  PlatformDot,
  PostVolumeStrip,
  PostListView,
  WeekBoard,
} from "./PublishingCalendarViews";
import { CalendarFilterBar } from "./PublishingCalendarFilters";
import { CalendarTopArea } from "./PublishingCalendarToolbar";
import {
  INITIAL_MONTH,
  TODAY,
  getCalendarWeekStart,
  getEffectivePostStatus,
  groupPostsByDate,
  matchesFilter,
  matchesTagFilter,
  sortPostsByTime,
} from "./calendarDateHelpers";
import { useManagedTagCollections } from "../../data/tagManagementStore";
import {
  flattenOptionGroups,
  getPublishingTagFilterGroups,
} from "../../data/publishingTaxonomy";
import { filterItemsByChannelIds } from "../../data/channelManagement";
import { useChannelGroup } from "../../app/providers/useChannelGroup";
import "./PublishingCalendar.css";

const { Paragraph, Text } = Typography;
const { Dragger } = Upload;

const notePickerLocale = {
  ...enGB,
  lang: {
    ...enGB.lang,
    shortWeekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  },
};

const NOTE_COLORS = [
  { label: "White", value: "#ffffff", border: "#b8c1c6" },
  { label: "Green", value: "#d8f7d8", border: "#8fd693" },
  { label: "Mint", value: "#d6fbf2", border: "#47d5bf" },
  { label: "Cyan", value: "#d6f6fb", border: "#50cbe5" },
  { label: "Blue", value: "#dceafe", border: "#6299f6" },
  { label: "Lavender", value: "#ebe5ff", border: "#8c7cff" },
  { label: "Pink", value: "#fde1fa", border: "#e66bd7" },
  { label: "Rose", value: "#ffe1ec", border: "#f46f9c" },
  { label: "Coral", value: "#ffe0dc", border: "#ff7b6e" },
  { label: "Peach", value: "#ffe7d3", border: "#ff9c62" },
];

const POST_TYPE_ICONS = {
  image: <PictureOutlined />,
  video: <VideoCameraOutlined />,
  text: <FileTextOutlined />,
  link: <LinkOutlined />,
  reel: <VideoCameraOutlined />,
  story: <PictureOutlined />,
};

const NOTE_SAVE_ACTIONS = [
  { key: "save", label: "Save" },
  { key: "save-new", label: "Save + New" },
  { key: "save-duplicate", label: "Save + Duplicate" },
];

const CALENDAR_AI_ACTIONS = [
  { key: "top-performing", icon: <HighlightOutlined />, label: "Generate from Top performing posts" },
  { key: "custom-topic", icon: <HighlightOutlined />, label: "Generate from Custom topic" },
  { key: "article", icon: <HighlightOutlined />, label: "Generate from Article" },
  { key: "generate-more", disabled: true, icon: <HighlightOutlined />, label: "Generate more" },
  { key: "confident", disabled: true, icon: <StarOutlined />, label: "Make confident" },
  { key: "friendly", disabled: true, icon: <SmileOutlined />, label: "Make friendly" },
  { key: "professional", disabled: true, icon: <ToolOutlined />, label: "Make professional" },
  {
    key: "translate",
    disabled: true,
    icon: <TranslationOutlined />,
    label: (
      <span className="publishing-calendar-ai-action-label">
        <span>Translate</span>
        <RightOutlined />
      </span>
    ),
  },
];

export const CalendarAiAssistPanel = ({ onClose }) => (
  <aside className="publishing-calendar-ai-panel" aria-label="Calendar AI Assist">
    <div className="publishing-calendar-ai-header">
      <Text strong>AI Assist</Text>
      <Space size={8}>
        <Button type="link" className="publishing-calendar-ai-clear">
          Clear Chat
        </Button>
        <Button type="text" aria-label="Close AI Assist" icon={<CloseOutlined />} onClick={onClose} />
      </Space>
    </div>

    <div className="publishing-calendar-ai-body">
      <div className="publishing-calendar-ai-chat">
        <div className="publishing-calendar-ai-bubble">Hi Hai-Son! I&apos;m here to help you generate posts.</div>
        <div className="publishing-calendar-ai-bubble">
          I&apos;m still improving, so if you have issues with the content I generate use the feedback controls and let me know what isn&apos;t quite right.
        </div>
        <div className="publishing-calendar-ai-bubble">
          I can help you improve your post or generate new posts. To get started, choose an action.
        </div>
      </div>
    </div>

    <div className="publishing-calendar-ai-footer">
      <Text strong className="publishing-calendar-ai-actions-label">AI actions</Text>
      <Dropdown
        classNames={{ root: "publishing-calendar-ai-actions-menu" }}
        placement="topLeft"
        trigger={["click"]}
        menu={{
          items: CALENDAR_AI_ACTIONS,
          onClick: ({ key }) => {
            const selectedAction = CALENDAR_AI_ACTIONS.find((action) => action.key === key);

            if (selectedAction && !selectedAction.disabled) {
              message.success(`${selectedAction.label} selected`);
            }
          },
        }}
      >
        <Button aria-label="Tell AI Assist what to do next..." className="publishing-calendar-ai-action-trigger">
          <span>Tell AI Assist what to do next...</span>
          <DownOutlined />
        </Button>
      </Dropdown>
      <Text type="secondary" className="publishing-calendar-ai-disclaimer">
        Review AI-generated content for inaccuracies. <a href="#ai-learn-more">Learn more</a>
      </Text>
    </div>
  </aside>
);

const PublishingCalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(() => dayjs(INITIAL_MONTH));
  const [calendarRange, setCalendarRange] = useState(() => [
    dayjs(INITIAL_MONTH),
    dayjs(INITIAL_MONTH).add(3, "day"),
  ]);
  const [density, setDensity] = useState("compact");
  const [viewMode, setViewMode] = useState("week");
  const [channelFilter, setChannelFilter] = useState([]);
  const [postTypeFilter, setPostTypeFilter] = useState([]);
  const [tagFilter, setTagFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [expandedDays, setExpandedDays] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedCompactGroup, setSelectedCompactGroup] = useState(null);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [volumeChartVisible, setVolumeChartVisible] = useState(false);
  const [aiAssistOpen, setAiAssistOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [bulkImportDateFormat, setBulkImportDateFormat] = useState("us");
  const [noteComposerOpen, setNoteComposerOpen] = useState(false);
  const [noteDateRange, setNoteDateRange] = useState(() => [
    dayjs(INITIAL_MONTH),
    dayjs(INITIAL_MONTH).add(9, "day"),
  ]);
  const [noteDraftDateRange, setNoteDraftDateRange] = useState(null);
  const [noteActiveDateField, setNoteActiveDateField] = useState("start");
  const [noteColorIndex, setNoteColorIndex] = useState(1);
  const [noteColorPickerOpen, setNoteColorPickerOpen] = useState(false);
  const [noteSaveAction, setNoteSaveAction] = useState("save");
  const [noteSaveMenuOpen, setNoteSaveMenuOpen] = useState(false);
  const [noteForm] = Form.useForm();
  const noteRangePickerRef = useRef(null);
  const [tagCollections] = useManagedTagCollections();
  const { activeChannelIds } = useChannelGroup();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle("has-calendar-ai-assist", aiAssistOpen);

    return () => document.body.classList.remove("has-calendar-ai-assist");
  }, [aiAssistOpen]);

  const scopedPosts = useMemo(
    () => filterItemsByChannelIds(CALENDAR_POSTS, activeChannelIds),
    [activeChannelIds],
  );

  const channelOptions = useMemo(
    () =>
      Array.from(new Map(
        scopedPosts.map((post) => [
          post.channelName,
          { label: post.channelName, value: post.channelName, platform: post.platform },
        ]),
      ).values()).sort((left, right) => left.label.localeCompare(right.label)),
    [scopedPosts],
  );

  const postTypeOptions = useMemo(
    () =>
      Object.entries(POST_TYPE_LABELS).map(([value, label]) => ({
        label,
        value,
      })),
    [],
  );

  const tagOptionGroups = useMemo(
    () => getPublishingTagFilterGroups(tagCollections),
    [tagCollections],
  );
  const tagOptions = useMemo(
    () => flattenOptionGroups(tagOptionGroups),
    [tagOptionGroups],
  );

  const filteredPosts = useMemo(
    () =>
      sortPostsByTime(scopedPosts).filter((post) => (
        matchesFilter(post.channelName, channelFilter) &&
        matchesFilter(post.postType, postTypeFilter) &&
        matchesTagFilter(post.tags, tagFilter) &&
        matchesFilter(getEffectivePostStatus(post), statusFilter)
      )),
    [postTypeFilter, channelFilter, scopedPosts, statusFilter, tagFilter],
  );

  const postsByDate = useMemo(() => groupPostsByDate(filteredPosts), [filteredPosts]);

  const selectedPost = useMemo(
    () => scopedPosts.find((post) => post.id === selectedPostId) || null,
    [scopedPosts, selectedPostId],
  );

  const selectedPanelPosts = useMemo(
    () => (
      selectedCompactGroup
        ? filteredPosts.filter((post) => (
          post.date === selectedCompactGroup.dateKey &&
          (!selectedCompactGroup.platform || post.platform === selectedCompactGroup.platform)
        ))
        : []
    ),
    [filteredPosts, selectedCompactGroup],
  );

  const calendarDateLabel = useMemo(() => {
    if (viewMode === "list") {
      return currentMonth.format("ddd, D MMM YYYY");
    }

    if (viewMode === "week") {
      const weekStart = getCalendarWeekStart(currentMonth);
      return `Week of ${weekStart.format("D MMMM YYYY")}`;
    }

    return currentMonth.format("MMMM YYYY");
  }, [currentMonth, viewMode]);

  const syncCalendarPeriod = (date, mode = viewMode) => {
    setCurrentMonth(date);

    if (mode === "week") {
      const weekStart = getCalendarWeekStart(date);
      setCalendarRange([weekStart, weekStart.add(6, "day")]);
    } else if (mode === "month") {
      setCalendarRange([date.startOf("month"), date.endOf("month")]);
    }

    setExpandedDays([]);
    setSelectedCompactGroup(null);
  };

  const clearFilters = () => {
    setChannelFilter([]);
    setPostTypeFilter([]);
    setTagFilter([]);
    setStatusFilter([]);
    setExpandedDays([]);
    setSelectedCompactGroup(null);
  };

  const updateCalendarFilter = (filterKey, values) => {
    if (filterKey === "channel") {
      setChannelFilter(values);
    } else if (filterKey === "postType") {
      setPostTypeFilter(values);
    } else if (filterKey === "tag") {
      setTagFilter(values);
    } else if (filterKey === "status") {
      setStatusFilter(values);
    }
    setExpandedDays([]);
    setSelectedCompactGroup(null);
  };

  const toggleExpandedDay = (dateKey) => {
    setExpandedDays((previous) => (
      previous.includes(dateKey)
        ? previous.filter((item) => item !== dateKey)
        : [...previous, dateKey]
    ));
  };

  const changeCalendarRange = (rangeValues) => {
    const [startDate, endDate] = rangeValues || [];

    if (!startDate || !endDate) {
      return;
    }

    setCalendarRange([startDate, endDate]);
    setCurrentMonth(startDate);
    setExpandedDays([]);
    setSelectedCompactGroup(null);
  };

  const selectCalendarDay = (date) => {
    setCurrentMonth(date);
    setCalendarRange([date, date]);
    setExpandedDays([]);
    setSelectedCompactGroup(null);
  };

  const changeDensity = (nextDensity) => {
    setDensity(nextDensity);

    if (nextDensity !== "compact") {
      setSelectedCompactGroup(null);
    }
  };

  const changeViewMode = (nextViewMode) => {
    setViewMode(nextViewMode);

    if (nextViewMode !== "month") {
      setSelectedCompactGroup(null);
    }

    if (nextViewMode === "week" || nextViewMode === "month") {
      syncCalendarPeriod(currentMonth, nextViewMode);
    }
  };

  const navigateCalendarPeriod = (direction) => {
    if (viewMode === "week") {
      syncCalendarPeriod(currentMonth.add(direction, "week"), "week");
      return;
    }

    if (viewMode === "month") {
      syncCalendarPeriod(currentMonth.add(direction, "month"), "month");
    }
  };

  const navigateCalendarToday = () => {
    syncCalendarPeriod(dayjs(TODAY), viewMode);
  };

  const openCompactGroup = (selection) => {
    setAiAssistOpen(false);
    setSelectedCompactGroup({ ...selection, type: "platform" });
  };

  const openDayPosts = (selection) => {
    setAiAssistOpen(false);
    setSelectedCompactGroup({ ...selection, type: "day" });
  };

  const toggleAiAssist = () => {
    setSelectedCompactGroup(null);
    setAiAssistOpen((open) => !open);
  };

  const openNewPost = () => {
    navigate("/publishing/new-post");
  };

  const openNoteComposer = (date = currentMonth) => {
    setNoteDateRange([date, date.add(9, "day")]);
    setNoteDraftDateRange(null);
    setNoteActiveDateField("start");
    setNoteColorPickerOpen(false);
    setNoteSaveAction("save");
    setNoteSaveMenuOpen(false);
    setNoteComposerOpen(true);
    noteForm.setFieldsValue({
      title: "",
      content: "",
      tags: "",
    });
  };

  const closeNoteComposer = () => {
    setNoteDraftDateRange(null);
    setNoteActiveDateField("start");
    setNoteColorPickerOpen(false);
    setNoteSaveMenuOpen(false);
    setNoteComposerOpen(false);
  };

  const saveNoteComposer = () => {
    const selectedAction = NOTE_SAVE_ACTIONS.find((action) => action.key === noteSaveAction);

    setNoteDraftDateRange(null);
    setNoteActiveDateField("start");
    setNoteColorPickerOpen(false);
    setNoteSaveMenuOpen(false);
    setNoteComposerOpen(false);
    message.success(`${selectedAction?.label || "Save"} completed locally`);
  };

  const focusNoteRangeField = (field) => {
    const fieldIndex = field === "start" ? 0 : 1;

    setNoteActiveDateField(field);
    setTimeout(() => {
      noteRangePickerRef.current?.focus(fieldIndex);
    }, 0);
  };

  const filterBar = (
    <CalendarFilterBar
      filters={{
        channel: channelFilter,
        postType: postTypeFilter,
        tag: tagFilter,
        status: statusFilter,
      }}
      options={{
        channels: channelOptions,
        postTypes: postTypeOptions,
        tagGroups: tagOptionGroups,
        tags: tagOptions,
      }}
      onChangeFilter={updateCalendarFilter}
      onClearAll={clearFilters}
    />
  );
  const volumeChart = volumeChartVisible && viewMode !== "month" ? (
    <PostVolumeStrip
      posts={filteredPosts}
      selectedDate={currentMonth}
      onClose={() => setVolumeChartVisible(false)}
      onSelectDate={selectCalendarDay}
    />
  ) : null;

  const calendarControls = (
    <CalendarTopArea
      calendarDateLabel={calendarDateLabel}
      calendarRange={calendarRange}
      density={density}
      filterBar={filterBar}
      filtersVisible={filtersVisible}
      aiAssistOpen={aiAssistOpen}
      viewMode={viewMode}
      volumeChart={volumeChart}
      onChangeDateRange={changeCalendarRange}
      onNavigateNext={() => navigateCalendarPeriod(1)}
      onNavigatePrevious={() => navigateCalendarPeriod(-1)}
      onNavigateToday={navigateCalendarToday}
      onOpenBulkImport={() => setBulkImportOpen(true)}
      onSetDensity={changeDensity}
      onSetViewMode={changeViewMode}
      onToggleAiAssist={toggleAiAssist}
      onToggleFilters={() => setFiltersVisible((visible) => !visible)}
      onToggleVolumeChart={() => setVolumeChartVisible((visible) => !visible)}
    />
  );

  const renderContent = () => {
    if (viewMode === "list") {
      return (
        <PostListView
          calendarRange={calendarRange}
          currentDate={currentMonth}
          density={density}
          onCreatePost={openNewPost}
          onCreateNote={openNoteComposer}
          posts={filteredPosts}
          onOpenPost={setSelectedPostId}
          emptyDescription="No posts match the current filters."
        />
      );
    }

    if (viewMode === "week") {
      return (
        <WeekBoard
          currentDate={currentMonth}
          density={density}
          onCreatePost={openNewPost}
          postsByDate={postsByDate}
          onOpenPost={setSelectedPostId}
        />
      );
    }

    return (
      <CalendarGrid
        currentMonth={currentMonth}
        density={density}
        expandedDays={expandedDays}
        postsByDate={postsByDate}
        selectedCompactGroup={selectedCompactGroup}
        onCreateNote={openNoteComposer}
        onCreatePost={openNewPost}
        onOpenCompactGroup={openCompactGroup}
        onOpenDayPosts={openDayPosts}
        onOpenPost={setSelectedPostId}
        onToggleDay={toggleExpandedDay}
      />
    );
  };

  const compactPostPanelOpen = Boolean(
    selectedCompactGroup &&
    viewMode === "month",
  );
  const sidePanelOpen = aiAssistOpen || compactPostPanelOpen;
  const selectedStatus = selectedPost ? STATUS_META[getEffectivePostStatus(selectedPost)] : null;
  const selectedPlatform = selectedPost ? PLATFORM_META[selectedPost.platform] : null;
  const selectedNoteColor = NOTE_COLORS[noteColorIndex] || NOTE_COLORS[1];
  const activeNoteDateRange = noteDraftDateRange || noteDateRange;
  const selectedNoteSaveAction = NOTE_SAVE_ACTIONS.find((action) => action.key === noteSaveAction) || NOTE_SAVE_ACTIONS[0];
  const noteSaveMenuItems = NOTE_SAVE_ACTIONS.map((action) => ({
    key: action.key,
    icon: action.key === noteSaveAction
      ? <CheckOutlined />
      : <span className="publishing-calendar-note-save-menu-icon-spacer" />,
    label: action.label,
  }));
  const noteColorPopoverContent = (
    <div className="publishing-calendar-note-color-popover">
      <div className="publishing-calendar-note-color-popover-header">
        <Text strong>Note Color</Text>
        <UpOutlined />
      </div>
      <div className="publishing-calendar-note-color-grid" role="radiogroup" aria-label="Note color">
        {NOTE_COLORS.map((color, index) => (
          <Button
            key={color.label}
            type="text"
            shape="circle"
            size="small"
            role="radio"
            aria-checked={index === noteColorIndex}
            aria-label={color.label}
            className={index === noteColorIndex ? "publishing-calendar-note-color-swatch is-active" : "publishing-calendar-note-color-swatch"}
            style={{
              "--note-color": color.value,
              "--note-color-border": color.border,
            }}
            onClick={() => {
              setNoteColorIndex(index);
              setNoteColorPickerOpen(false);
            }}
          />
        ))}
      </div>
    </div>
  );
  const noteDateRangePanel = (originPanel) => (
    <div className="publishing-calendar-note-range-panel">
      <div className="publishing-calendar-note-range-calendar">
        {originPanel}
      </div>
      <div className="publishing-calendar-note-range-sidebar">
        <Text strong className="publishing-calendar-note-range-sidebar-title">
          <CalendarOutlined /> Date Range
        </Text>
        <div className="publishing-calendar-note-range-inputs">
          <Input
            aria-label="Note start date"
            className={noteActiveDateField === "start" ? "is-active" : undefined}
            readOnly
            value={activeNoteDateRange?.[0]?.format("D/M/YYYY") || ""}
            onClick={() => focusNoteRangeField("start")}
            onMouseDown={(event) => event.preventDefault()}
          />
          <SwapRightOutlined />
          <Input
            aria-label="Note end date"
            className={noteActiveDateField === "end" ? "is-active" : undefined}
            readOnly
            value={activeNoteDateRange?.[1]?.format("D/M/YYYY") || ""}
            onClick={() => focusNoteRangeField("end")}
            onMouseDown={(event) => event.preventDefault()}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <AdminPageLayout
        title="Calendar"
        hidePageHeader
        pageControls={calendarControls}
        contentPadding={sidePanelOpen
          ? `0 0 ${T.paddingLG}px ${T.paddingLG}px`
          : `0 ${T.paddingLG}px ${T.paddingLG}px`}
      >
        <div className={sidePanelOpen ? "publishing-calendar-workspace has-side-panel" : "publishing-calendar-workspace"}>
          <div className="publishing-calendar-page">
            {renderContent()}
          </div>
          {aiAssistOpen ? <CalendarAiAssistPanel onClose={() => setAiAssistOpen(false)} /> : null}
          {compactPostPanelOpen ? (
            <CalendarPostSidePanel
              posts={selectedPanelPosts}
              selection={selectedCompactGroup}
              onClose={() => setSelectedCompactGroup(null)}
              onOpenPost={setSelectedPostId}
            />
          ) : null}
        </div>

        <Drawer
          title={selectedPost ? selectedPost.channelName : "Post Detail"}
          open={Boolean(selectedPost)}
          onClose={() => setSelectedPostId(null)}
          size={480}
          destroyOnHidden
        >
          {selectedPost ? (
            <>
              <div className="publishing-calendar-drawer-section">
                <Space size={8} wrap>
                  <PlatformDot platform={selectedPost.platform} />
                  <Text strong>{selectedPlatform?.label}</Text>
                  <Tag color={selectedStatus?.color}>{selectedStatus?.label}</Tag>
                </Space>
                <Space size={8} wrap>
                  <Text type="secondary">
                    <CalendarOutlined /> {dayjs(selectedPost.date).format("D MMM YYYY")}
                  </Text>
                  <Text type="secondary">
                    <ClockCircleOutlined /> {selectedPost.timeLabel}
                  </Text>
                </Space>
              </div>

              <div className="publishing-calendar-drawer-section">
                <Text strong>Caption</Text>
                <Paragraph style={{ marginBottom: 0 }}>{selectedPost.caption}</Paragraph>
              </div>

              <div className="publishing-calendar-drawer-section">
                <Text strong>Publishing Details</Text>
                <Space direction="vertical" size={8}>
                  <Text>
                    <UserOutlined /> {selectedPost.channelName}
                  </Text>
                  <Text>
                    {POST_TYPE_ICONS[selectedPost.postType]} {POST_TYPE_LABELS[selectedPost.postType]}
                    {selectedPost.mediaCount ? `, ${selectedPost.mediaCount} media` : ""}
                  </Text>
                  <Text>
                    <CommentOutlined /> {selectedPost.hasConversation ? "Team conversation open" : "No active conversation"}
                  </Text>
                  <Text>
                    <BarChartOutlined /> Metric: {selectedPost.metricLabel}
                  </Text>
                </Space>
              </div>

              <div className="publishing-calendar-drawer-section">
                <Text strong>Tags</Text>
                <div className="publishing-calendar-tag-row">
                  {selectedPost.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </div>

              <Space wrap>
                <Button type="primary" onClick={() => message.success("Post opened in composer")}>
                  Edit Post
                </Button>
                <Button onClick={() => message.success("Conversation opened")}>
                  View Conversation
                </Button>
                <Button icon={<HistoryOutlined />} onClick={() => message.success("Activity opened")}>
                  Activity
                </Button>
              </Space>
            </>
          ) : null}
        </Drawer>

        <Modal
          className="publishing-calendar-import-modal"
          centered
          closeIcon={<CloseOutlined />}
          footer={(
            <div className="publishing-calendar-import-footer">
              <Button type="text" onClick={() => setBulkImportOpen(false)}>
                Cancel
              </Button>
              <Button type="primary" disabled>
                Start Import
              </Button>
            </div>
          )}
          onCancel={() => setBulkImportOpen(false)}
          open={bulkImportOpen}
          title="Import Posts"
          width={970}
          destroyOnHidden
        >
          <div className="publishing-calendar-import-body">
            <div className="publishing-calendar-import-main">
              <Select
                className="publishing-calendar-import-profile"
                placeholder="Please select a profile"
                size="large"
                suffixIcon={<DownOutlined />}
                prefix={<TeamOutlined />}
                options={channelOptions.map((channel) => ({
                  label: channel.label,
                  value: channel.value,
                }))}
              />

              <Dragger
                accept=".csv"
                beforeUpload={() => false}
                className="publishing-calendar-import-dropzone"
                maxCount={1}
                showUploadList={false}
              >
                <p className="publishing-calendar-import-drop-title">Drag .CSV file here</p>
                <p className="publishing-calendar-import-drop-or">or</p>
                <Button icon={<UploadOutlined />}>Choose File</Button>
              </Dragger>

              <div className="publishing-calendar-import-section">
                <Text strong className="publishing-calendar-import-section-title">
                  Choose date format
                </Text>
                <Radio.Group
                  className="publishing-calendar-import-format-grid"
                  value={bulkImportDateFormat}
                  onChange={(event) => setBulkImportDateFormat(event.target.value)}
                >
                  <label className={bulkImportDateFormat === "us" ? "publishing-calendar-import-format is-active" : "publishing-calendar-import-format"}>
                    <Radio value="us">U.S. Format</Radio>
                    <span>mm/dd/yyyy</span>
                  </label>
                  <label className={bulkImportDateFormat === "international" ? "publishing-calendar-import-format is-active" : "publishing-calendar-import-format"}>
                    <Radio value="international">International Format</Radio>
                    <span>dd/mm/yyyy</span>
                  </label>
                </Radio.Group>
              </div>

              <div className="publishing-calendar-import-section">
                <Text strong className="publishing-calendar-import-section-title">
                  Tags (optional)
                </Text>
                <Text type="secondary">
                  Choose tags for easier tracking. Applied to all posts.
                </Text>
                <Input
                  className="publishing-calendar-import-tags"
                  prefix={<TagsOutlined />}
                  placeholder="Add tags"
                />
              </div>

              <Space direction="vertical" size={10} className="publishing-calendar-import-checks">
                <Checkbox>Schedule posts as Drafts</Checkbox>
                <Checkbox>Shorten Link URLs with Bit.ly</Checkbox>
              </Space>
            </div>

            <div className="publishing-calendar-import-guide">
              <Text strong className="publishing-calendar-import-guide-title">
                Formatting Your .CSV File
              </Text>
              <Paragraph>
                <Text strong>Date:</Text> US (mm/dd/yyyy) or International (dd/mm/yyyy) format.
              </Paragraph>
              <Paragraph>
                <Text strong>Time:</Text> 24-hour format (e.g., "13:40" for 1:30pm); imports for your Personal Settings time zone.
              </Paragraph>
              <Paragraph>
                <Text strong>Link URL (optional):</Text> Share links without including them in the post text for Facebook, and LinkedIn. Insert X links in the post text field.
              </Paragraph>
              <Paragraph>
                <Text strong>Public Image URL (optional):</Text> Link to a publicly accessible image.
              </Paragraph>
              <Paragraph>
                <Text strong>Tags (optional):</Text> Comma separated list of existing tags in Sprout for individual posts.
              </Paragraph>
              <Button type="link" className="publishing-calendar-import-link">
                Read the full guide
              </Button>
              <Button type="link" className="publishing-calendar-import-link">
                Download sample template
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          className={[
            "publishing-calendar-note-modal",
            `is-color-${noteColorIndex}`,
          ].join(" ")}
          centered
          closable={false}
          footer={null}
          maskClosable
          onCancel={closeNoteComposer}
          open={noteComposerOpen}
          width={728}
          destroyOnHidden
        >
          <div
            className="publishing-calendar-note-shell"
            style={{ background: selectedNoteColor.value }}
          >
            <div className="publishing-calendar-note-header">
              <Text strong className="publishing-calendar-note-title">Create Note</Text>
              <Space size={8} wrap={false}>
                <Popover
                  arrow={false}
                  content={noteColorPopoverContent}
                  open={noteColorPickerOpen}
                  placement="bottomLeft"
                  trigger="click"
                  onOpenChange={setNoteColorPickerOpen}
                >
                  <Button
                    className={noteColorPickerOpen ? "publishing-calendar-note-color-trigger is-open" : "publishing-calendar-note-color-trigger"}
                  >
                    Change color
                  </Button>
                </Popover>
                <DatePicker.RangePicker
                  ref={noteRangePickerRef}
                  allowClear={false}
                  className="publishing-calendar-note-date-range"
                  classNames={{
                    popup: {
                      root: noteDraftDateRange && !noteDraftDateRange[1]
                        ? "publishing-calendar-note-range-popup is-selecting-range"
                        : "publishing-calendar-note-range-popup",
                    },
                  }}
                  format="D/M/YYYY"
                  inputReadOnly
                  locale={notePickerLocale}
                  panelRender={noteDateRangePanel}
                  previewValue={false}
                  separator="-"
                  suffixIcon={<CalendarOutlined />}
                  value={activeNoteDateRange}
                  onCalendarChange={(dates, _dateStrings, info) => {
                    setNoteActiveDateField(info?.range || noteActiveDateField);
                    setNoteDraftDateRange(dates);
                  }}
                  onChange={(rangeValues) => {
                    const [startDate, endDate] = rangeValues || [];

                    if (startDate && endDate) {
                      setNoteDateRange([startDate, endDate]);
                    }
                    setNoteDraftDateRange(null);
                  }}
                  onFocus={(_event, info) => {
                    setNoteActiveDateField(info?.range || "start");
                  }}
                  onOpenChange={(open) => {
                    if (!open) {
                      setNoteDraftDateRange(null);
                      setNoteActiveDateField("start");
                    }
                  }}
                />
              </Space>
            </div>

            <Form
              form={noteForm}
              layout="vertical"
              className="publishing-calendar-note-form"
            >
              <Form.Item label="Title" name="title">
                <Input autoFocus placeholder="Add your title here" />
              </Form.Item>
              <Form.Item label="Content" name="content">
                <Input.TextArea
                  autoSize={{ minRows: 5, maxRows: 7 }}
                  placeholder="Add your note body here"
                />
              </Form.Item>
              <Form.Item label="Tagging" name="tags">
                <Input placeholder="Add Tags" />
              </Form.Item>
            </Form>
          </div>

          <div className="publishing-calendar-note-footer">
            <Text type="secondary" className="publishing-calendar-note-helper">
              <InfoCircleOutlined /> Calendar notes can be seen by all team members in this group.
            </Text>
            <Space size={8}>
              <Button type="text" onClick={closeNoteComposer}>
                Cancel
              </Button>
              <Space.Compact>
                <Button type="primary" className="publishing-calendar-note-save" onClick={saveNoteComposer}>
                  {selectedNoteSaveAction.label}
                </Button>
                <Dropdown
                  overlayClassName="publishing-calendar-note-save-dropdown"
                  open={noteSaveMenuOpen}
                  trigger={["click"]}
                  menu={{
                    items: noteSaveMenuItems,
                    selectedKeys: [noteSaveAction],
                    onClick: ({ key }) => {
                      setNoteSaveAction(key);
                      setNoteSaveMenuOpen(false);
                    },
                  }}
                  onOpenChange={setNoteSaveMenuOpen}
                >
                  <Button
                    type="primary"
                    className="publishing-calendar-note-save-menu"
                    aria-label="More save options"
                    icon={noteSaveMenuOpen ? <UpOutlined /> : <DownOutlined />}
                  />
                </Dropdown>
              </Space.Compact>
            </Space>
          </div>
        </Modal>
      </AdminPageLayout>
    </>
  );
};

export default PublishingCalendarPage;
