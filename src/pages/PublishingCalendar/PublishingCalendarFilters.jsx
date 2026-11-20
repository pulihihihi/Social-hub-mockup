import { useMemo, useState } from "react";
import { Button, Checkbox as AntCheckbox, Divider, Input, Switch } from "antd";
import {
  AuditOutlined,
  CalendarOutlined,
  CommentOutlined,
  FieldTimeOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  RightOutlined,
  SearchOutlined,
  SendOutlined,
  SoundOutlined,
  TagOutlined,
} from "@ant-design/icons";
import {
  PublishingFilterBar,
  PublishingFilterCell,
} from "../../components/PublishingFilterBar";
import { PlatformIcon } from "../../components/SharedBadges";
import { PlatformDot } from "./PublishingCalendarViews";
import { getFilterSubtitle } from "./calendarDateHelpers";

const POST_TYPE_FILTER_OPTIONS = [
  { label: "Queued Posts", value: "queued", icon: <FieldTimeOutlined /> },
  { label: "Scheduled Posts", value: "scheduled", icon: <CalendarOutlined /> },
  { label: "Drafted Posts", value: "draft", icon: <FileTextOutlined /> },
  { label: "Sent Posts", value: "published", icon: <SendOutlined /> },
  { label: "Needs Approval", value: "needs_approval", icon: <AuditOutlined /> },
  { label: "Notes", value: "note", icon: <CommentOutlined /> },
];

const PROFILE_PLATFORM_ORDER = ["facebook", "instagram", "tiktok", "youtube", "threads", "other"];

const PROFILE_PLATFORM_LABELS = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  threads: "Threads",
  other: "Other",
};

const ChannelFilterSummary = ({ options }) => {
  const countsByPlatform = options.reduce((accumulator, option) => {
    accumulator[option.platform] = (accumulator[option.platform] || 0) + 1;
    return accumulator;
  }, {});

  return (
    <span className="publishing-calendar-channel-summary">
      {["facebook", "instagram", "tiktok", "youtube"].map((platform) => (
        <span key={platform} className="publishing-calendar-channel-summary-item">
          <PlatformIcon platform={platform} size="compact" />
          <span>{countsByPlatform[platform] || 0}</span>
        </span>
      ))}
    </span>
  );
};

const getProfilesByPlatform = (options) => {
  const grouped = options.reduce((accumulator, option) => {
    const platform = option.platform || "other";

    if (!accumulator[platform]) {
      accumulator[platform] = [];
    }

    accumulator[platform].push(option);
    return accumulator;
  }, {});

  return PROFILE_PLATFORM_ORDER
    .filter((platform) => grouped[platform]?.length)
    .map((platform) => ({
      platform,
      profiles: grouped[platform].sort((left, right) => left.label.localeCompare(right.label)),
    }));
};

const ProfileFilterList = ({ options, selected, onChange }) => {
  const groups = getProfilesByPlatform(options);
  const allValues = options.map((option) => option.value);
  const isViewingAll = selected.length === 0 || selected.length === allValues.length;

  const toggleProfile = (value) => {
    const nextSelected = isViewingAll
      ? [value]
      : selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];

    onChange(nextSelected.length === allValues.length ? [] : nextSelected);
  };

  const togglePlatform = (platformValues) => {
    if (isViewingAll) {
      onChange(platformValues.length === allValues.length ? [] : platformValues);
      return;
    }

    const hasEveryPlatformValue = platformValues.every((value) => selected.includes(value));
    const nextSelected = hasEveryPlatformValue
      ? selected.filter((value) => !platformValues.includes(value))
      : Array.from(new Set([...selected, ...platformValues]));

    onChange(nextSelected.length === allValues.length ? [] : nextSelected);
  };

  return (
    <div className="publishing-calendar-profile-popover">
      <div className="publishing-calendar-profile-popover-title">Profiles</div>
      <Divider className="publishing-calendar-profile-popover-divider" />
      <label className="publishing-calendar-profile-all-row">
        <AntCheckbox
          checked={isViewingAll}
          indeterminate={selected.length > 0 && selected.length < allValues.length}
          onChange={() => onChange([])}
        />
        <span>All Profiles</span>
      </label>
      <div className="publishing-calendar-profile-groups">
        {groups.map(({ platform, profiles }) => {
          const platformValues = profiles.map((profile) => profile.value);
          const checkedCount = isViewingAll
            ? platformValues.length
            : platformValues.filter((value) => selected.includes(value)).length;
          const platformChecked = checkedCount === platformValues.length;
          const platformIndeterminate = checkedCount > 0 && checkedCount < platformValues.length;

          return (
            <section key={platform} className="publishing-calendar-profile-group">
              <label className="publishing-calendar-profile-platform-row">
                <AntCheckbox
                  checked={platformChecked}
                  indeterminate={platformIndeterminate}
                  onChange={() => togglePlatform(platformValues)}
                />
                <PlatformIcon platform={platform} size="compact" />
                <span>All {PROFILE_PLATFORM_LABELS[platform] || platform} Profiles</span>
              </label>
              <div className="publishing-calendar-profile-list">
                {profiles.map((profile) => (
                  <label key={profile.value} className="publishing-calendar-profile-row">
                    <AntCheckbox
                      checked={isViewingAll || selected.includes(profile.value)}
                      onChange={() => toggleProfile(profile.value)}
                    />
                    <PlatformDot platform={profile.platform} />
                    <span>{profile.label}</span>
                  </label>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

const PostTypeFilterList = ({ selected, onChange }) => {
  const toggleOne = (value) => {
    const nextSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];

    onChange(nextSelected.length === POST_TYPE_FILTER_OPTIONS.length ? [] : nextSelected);
  };

  return (
    <div className="publishing-calendar-posttype-popover">
      <div className="publishing-calendar-posttype-popover-title">Post Types</div>
      <Divider className="publishing-calendar-posttype-popover-divider" />
      <div className="publishing-calendar-posttype-list">
        <label className="publishing-calendar-posttype-row">
          <AntCheckbox
            checked={selected.length === POST_TYPE_FILTER_OPTIONS.length}
            indeterminate={selected.length > 0 && selected.length < POST_TYPE_FILTER_OPTIONS.length}
            onChange={() => onChange([])}
          />
          <span className="publishing-calendar-posttype-label">All Post Types</span>
        </label>
        {POST_TYPE_FILTER_OPTIONS.map((option) => (
          <label key={option.value} className="publishing-calendar-posttype-row">
            <AntCheckbox
              checked={selected.includes(option.value)}
              onChange={() => toggleOne(option.value)}
            />
            <span className="publishing-calendar-posttype-option-icon">{option.icon}</span>
            <span className="publishing-calendar-posttype-label">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const TagFilterList = ({ groups, selected, onChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeGroupLabel, setActiveGroupLabel] = useState(null);
  const [matchAllSelected, setMatchAllSelected] = useState(false);
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const searchableGroups = useMemo(() => (
    groups
      .map((group) => {
        const options = group.options || [];
        const groupMatches = group.label.toLowerCase().includes(normalizedSearch);
        const matchingOptions = normalizedSearch && !groupMatches
          ? options.filter((option) => option.label.toLowerCase().includes(normalizedSearch))
          : options;

        return {
          ...group,
          options: matchingOptions,
        };
      })
      .filter((group) => !normalizedSearch || group.label.toLowerCase().includes(normalizedSearch) || group.options.length)
  ), [groups, normalizedSearch]);
  const activeGroup = searchableGroups.find((group) => group.label === activeGroupLabel)
    || groups.find((group) => group.label === activeGroupLabel);
  const allTagValues = groups.flatMap((group) => group.options.map((option) => option.value));
  const isViewingAll = selected.length === 0;

  const toggleTag = (value) => {
    const nextSelected = isViewingAll
      ? [value]
      : selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];

    onChange(nextSelected.length === allTagValues.length ? [] : nextSelected);
  };

  const toggleGroup = (groupOptions) => {
    const groupValues = groupOptions.map((option) => option.value);
    const hasEveryGroupValue = !isViewingAll && groupValues.every((value) => selected.includes(value));
    const nextSelected = hasEveryGroupValue
      ? selected.filter((value) => !groupValues.includes(value))
      : Array.from(new Set([...(isViewingAll ? [] : selected), ...groupValues]));

    onChange(nextSelected.length === allTagValues.length ? [] : nextSelected);
  };

  const resetTags = () => {
    setActiveGroupLabel(null);
    setSearchTerm("");
    setMatchAllSelected(false);
    onChange([]);
  };

  return (
    <div className="publishing-calendar-tags-popover">
      <div className="publishing-calendar-tags-header">
        <Button
          type="text"
          className={activeGroup ? "publishing-calendar-tags-back" : "publishing-calendar-tags-back is-hidden"}
          onClick={() => setActiveGroupLabel(null)}
          aria-label="Back to tag groups"
          icon={<LeftOutlined />}
        />
        <span>{activeGroup?.label || "Tags"}</span>
        <Button type="link" className="publishing-calendar-tags-reset" onClick={resetTags}>
          Reset
        </Button>
      </div>
      <Divider className="publishing-calendar-tags-divider" />
      <div className="publishing-calendar-tags-body">
        <Input
          className="publishing-calendar-tags-search"
          prefix={<SearchOutlined />}
          placeholder="Search Tags..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        {activeGroup ? (
          <div className="publishing-calendar-tags-list">
            <label className="publishing-calendar-tag-row is-all">
              <AntCheckbox
                checked={!isViewingAll && activeGroup.options.every((option) => selected.includes(option.value))}
                indeterminate={!isViewingAll && activeGroup.options.some((option) => selected.includes(option.value)) && !activeGroup.options.every((option) => selected.includes(option.value))}
                onChange={() => toggleGroup(activeGroup.options)}
              />
              <span>All {activeGroup.label}</span>
            </label>
            {activeGroup.options.map((option) => (
              <label key={option.value} className="publishing-calendar-tag-row">
                <AntCheckbox
                  checked={selected.includes(option.value)}
                  onChange={() => toggleTag(option.value)}
                />
                <TagOutlined />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className="publishing-calendar-tag-group-list">
            {searchableGroups.map((group) => (
              <Button
                key={group.label}
                type="text"
                className="publishing-calendar-tag-group-row"
                onClick={() => setActiveGroupLabel(group.label)}
              >
                <span className="publishing-calendar-tag-group-row-content">
                  <span className="publishing-calendar-tag-group-icon">
                    {group.label === "Campaigns" ? <SoundOutlined /> : <TagOutlined />}
                  </span>
                  <span className="publishing-calendar-tag-group-label">{group.label}</span>
                  <RightOutlined className="publishing-calendar-tag-group-arrow" />
                </span>
              </Button>
            ))}
          </div>
        )}
      </div>
      <div className="publishing-calendar-tags-footer">
        <Switch checked={matchAllSelected} onChange={setMatchAllSelected} />
        <span>Match all selected</span>
        <InfoCircleOutlined />
      </div>
    </div>
  );
};

export const CalendarFilterBar = ({
  filters,
  onClearAll,
  onChangeFilter,
  options,
}) => {
  const activeCounts = {
    channel: filters.channel.length,
    status: filters.status.length,
    tag: filters.tag.length,
  };
  const totalActive = Object.values(activeCounts).filter(Boolean).length;

  return (
    <PublishingFilterBar
      ariaLabel="Calendar filters"
      activeCount={totalActive}
      onClearAll={onClearAll}
    >
      <PublishingFilterCell
        title="Profiles"
        summary={filters.channel.length
          ? getFilterSubtitle(options.channels, filters.channel, "Viewing all")
          : <ChannelFilterSummary options={options.channels} />}
        activeCount={activeCounts.channel}
        popoverWidth={438}
      >
        <ProfileFilterList
          options={options.channels}
          selected={filters.channel}
          onChange={(values) => onChangeFilter("channel", values)}
        />
      </PublishingFilterCell>
      <PublishingFilterCell
        title="Post Types"
        summary={getFilterSubtitle(POST_TYPE_FILTER_OPTIONS, filters.status, "Viewing all")}
        activeCount={activeCounts.status}
        popoverWidth={438}
      >
        <PostTypeFilterList
          selected={filters.status}
          onChange={(values) => onChangeFilter("status", values)}
        />
      </PublishingFilterCell>
      <PublishingFilterCell
        title="Tags"
        summary={getFilterSubtitle(options.tags, filters.tag, "Viewing all")}
        activeCount={activeCounts.tag}
        popoverWidth={438}
      >
        <TagFilterList
          groups={options.tagGroups}
          selected={filters.tag}
          onChange={(values) => onChangeFilter("tag", values)}
        />
      </PublishingFilterCell>
    </PublishingFilterBar>
  );
};
