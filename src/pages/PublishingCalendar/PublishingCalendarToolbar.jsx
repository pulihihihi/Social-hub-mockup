import { useState } from "react";
import { Button, DatePicker, Dropdown, Flex, Space, Tooltip, Typography, message } from "antd";
import enGB from "antd/es/date-picker/locale/en_GB";
import {
  AppstoreOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  DownloadOutlined,
  ExpandAltOutlined,
  FilterOutlined,
  LinkOutlined,
  MailOutlined,
  MoreOutlined,
  ThunderboltOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import "dayjs/locale/en-gb";
import { ViewModeSegmented } from "../../components/ViewModeSegmented";

const { Text } = Typography;

const calendarPickerLocale = {
  ...enGB,
  lang: {
    ...enGB.lang,
    shortWeekDays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  },
};

const isDateInRange = (date, range) => {
  if (!date || !range?.[0] || !range?.[1]) {
    return false;
  }

  return (
    date.isSame(range[0], "day") ||
    date.isSame(range[1], "day") ||
    (date.isAfter(range[0], "day") && date.isBefore(range[1], "day"))
  );
};

export const CalendarTopArea = ({
  calendarDateLabel,
  calendarRange,
  density,
  filterBar,
  filtersVisible,
  aiAssistOpen,
  onToggleAiAssist,
  onToggleFilters,
  onToggleVolumeChart,
  onChangeDateRange,
  onNavigateNext,
  onNavigatePrevious,
  onNavigateToday,
  onOpenBulkImport,
  onSetDensity,
  onSetViewMode,
  viewMode,
  volumeChart,
}) => {
  const [selectingRange, setSelectingRange] = useState(false);
  const [draftRange, setDraftRange] = useState(null);
  const pickerValue = selectingRange && draftRange ? draftRange : calendarRange;
  const exportMenuItems = [
    {
      key: "create-shareable-link",
      icon: <LinkOutlined />,
      label: "Create shareable link",
    },
    {
      key: "download-pdf",
      icon: <DownloadOutlined />,
      label: "Download PDF",
    },
    {
      key: "send-pdf",
      icon: <MailOutlined />,
      label: "Send PDF",
    },
  ];
  const showPeriodControls = viewMode === "week" || viewMode === "month";
  const previousPeriodLabel = viewMode === "month" ? "Previous month" : "Previous week";
  const nextPeriodLabel = viewMode === "month" ? "Next month" : "Next week";

  return (
    <div className="publishing-calendar-top-area">
      <Flex align="center" justify="space-between" gap={12} wrap className="publishing-calendar-header">
        <Space
          size={4}
          wrap={false}
          className={showPeriodControls ? "publishing-calendar-date-nav is-period-nav" : "publishing-calendar-date-nav"}
        >
          {showPeriodControls ? (
            <>
              <Button
                aria-label={previousPeriodLabel}
                className="publishing-calendar-period-button"
                icon={<ArrowLeftOutlined />}
                onClick={onNavigatePrevious}
              />
              <Button className="publishing-calendar-today-button" onClick={onNavigateToday}>
                Today
              </Button>
              <Button
                aria-label={nextPeriodLabel}
                className="publishing-calendar-period-button"
                icon={<ArrowRightOutlined />}
                onClick={onNavigateNext}
              />
            </>
          ) : (
            <DatePicker.RangePicker
              allowClear={false}
              className="publishing-calendar-date-range"
              classNames={{
                popup: {
                  root: selectingRange
                    ? "publishing-calendar-range-popup is-selecting-range"
                    : "publishing-calendar-range-popup",
                },
              }}
              format="D/M/YYYY"
              inputReadOnly
              locale={calendarPickerLocale}
              previewValue={false}
              separator="-"
              suffixIcon={<CalendarOutlined />}
              value={pickerValue}
              onCalendarChange={(dates, _dateStrings, info) => {
                const hasStart = Boolean(dates?.[0]);
                const hasEnd = Boolean(dates?.[1]);
                const isChoosingStart = hasStart && (!hasEnd || info?.range === "start");
                const shouldResetOldRange = isChoosingStart && !isDateInRange(dates[0], calendarRange);

                if (shouldResetOldRange) {
                  setDraftRange([dates[0], null]);
                  setSelectingRange(true);
                  return;
                }

                if (isChoosingStart && !hasEnd) {
                  setDraftRange(dates);
                } else {
                  setDraftRange(dates);
                }

                setSelectingRange(hasStart !== hasEnd);
              }}
              onChange={(rangeValues) => {
                setSelectingRange(false);
                setDraftRange(null);
                onChangeDateRange(rangeValues);
              }}
              onOpenChange={(open) => {
                if (!open) {
                  setSelectingRange(false);
                  setDraftRange(null);
                }
              }}
            />
          )}
          <Text strong className="publishing-calendar-date-title">
            {calendarDateLabel}
          </Text>
        </Space>

        <Space size={8} wrap className="publishing-calendar-actionbar">
        <Button
          aria-pressed={filtersVisible}
          icon={<FilterOutlined />}
          onClick={onToggleFilters}
          type={filtersVisible ? "primary" : "default"}
        >
          Filters
        </Button>
        <ViewModeSegmented
          ariaLabel="Calendar density"
          className="publishing-calendar-density-segmented"
          value={density}
          onChange={onSetDensity}
          options={[
            {
              ariaLabel: "Compact",
              icon: <UnorderedListOutlined />,
              tooltip: "Compact",
              value: "compact",
            },
            {
              ariaLabel: "Large",
              icon: <AppstoreOutlined />,
              tooltip: "Large",
              value: "expanded",
            },
          ]}
        />
        <ViewModeSegmented
          ariaLabel="Calendar view"
          className="publishing-calendar-view-segmented"
          value={viewMode}
          onChange={onSetViewMode}
          options={[
            { label: "List", value: "list" },
            { label: "Week", value: "week" },
            { label: "Month", value: "month" },
          ]}
        />
        <Button
          aria-label="AI Assist"
          aria-pressed={aiAssistOpen}
          icon={<ThunderboltOutlined />}
          onClick={onToggleAiAssist}
          type={aiAssistOpen ? "primary" : "default"}
        >
          AI Assist
        </Button>
        <Dropdown
          classNames={{ root: "publishing-calendar-export-menu" }}
          trigger={["click"]}
          menu={{
            items: exportMenuItems,
            onClick: ({ key }) => {
              if (key === "create-shareable-link") {
                message.success("Shareable calendar link created");
                return;
              }

              if (key === "download-pdf") {
                message.success("Calendar PDF download started");
                return;
              }

              if (key === "send-pdf") {
                message.success("Calendar PDF send flow opened");
              }
            },
          }}
        >
          <Button icon={<ExpandAltOutlined />} aria-label="Calendar export options" />
        </Dropdown>
        <Tooltip title="More actions">
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                { key: "toggle-volume-chart", label: "Toggle Volume Chart" },
                { key: "bulk-post-import", label: "Bulk Post Import" },
              ],
              onClick: ({ key }) => {
                if (key === "toggle-volume-chart") {
                  onToggleVolumeChart();
                  return;
                }

                if (key === "bulk-post-import") {
                  onOpenBulkImport();
                }
              },
            }}
          >
            <Button icon={<MoreOutlined />} aria-label="More calendar actions" />
          </Dropdown>
        </Tooltip>
        </Space>
      </Flex>

      {filtersVisible ? filterBar : null}
      {volumeChart}
    </div>
  );
};
