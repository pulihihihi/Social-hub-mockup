import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  Button,
  DatePicker,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Tag,
  Tabs,
  message,
} from 'antd';
import {
  BookOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { AppPageControls } from '../../app/layout/AppPageControls';
import { AppToolbarCard, AppTableCard } from '../../app/layout/AppCards';
import { usePageSecondaryTopBar } from '../../app/layout/usePageSecondaryTopBar';
import {
  AppToolbarFilter,
  AppToolbarFilters,
  AppToolbarSearch,
  AppToolbarUtility,
} from '../../app/layout/AppToolbarFilters';
import { AppProTable } from '../../app/pro/AppProTable';
import {
  PlusIco,
} from '../../components/icons';
import { ChannelGroupColorChip } from '../../components/ChannelGroupBadge';
import AdminPageLayout from '../../components/AdminPageLayout';
import { CALENDAR_POSTS } from '../PublishingCalendar/calendarMockData';
import {
  CHANNEL_GROUP_COLOR_OPTIONS,
  DEFAULT_CHANNEL_GROUP_COLOR,
  getChannelGroupColorMeta,
  normalizeChannelGroupColor,
} from '../../data/channelManagement';
import { getTagUsageByName } from '../../data/tagManagement';
import {
  createTagEntity,
  createTagGroupEntity,
  makeTagGroupId,
  makeTagId,
  TAG_GROUP_STATUS,
  TAG_STATUS,
} from '../../data/tagGroupModel';
import {
  useManagedSystemTags,
  useManagedTagTaxonomy,
} from '../../data/tagManagementStore';
import { getMessageTypeScopeLabel } from '../../data/messageTypes';
import {
  compareDisplayIdsAscending,
  sortByDisplayIdDescending,
  withNumericDisplayIds,
} from '../../utils/idSort';
import './SettingsTagManagement.css';

const STATUS_FILTER_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: TAG_STATUS.ACTIVE },
  { label: 'Archived', value: TAG_STATUS.ARCHIVED },
];
const STATUS_FILTER_LABEL = 'Status';

const DATE_RANGE_DISPLAY_FORMAT = 'MMM D, YYYY';

const getModalPopupContainer = (triggerNode) => (
  triggerNode?.closest('.ant-modal-content') || document.body
);

const normalizeComparableText = (value = '') => value.trim().toLowerCase();

const getGroupIcon = (group = {}) => {
  const palette = getChannelGroupColorMeta(group.color, group.name);

  return <BookOutlined style={{ color: palette.solid }} />;
};

const formatGroupDateRange = (dateRange) => {
  const [startDate, endDate] = dateRange || [];

  return startDate
    ? (endDate
      ? `${startDate.format(DATE_RANGE_DISPLAY_FORMAT)} - ${endDate.format(DATE_RANGE_DISPLAY_FORMAT)}`
      : startDate.format(DATE_RANGE_DISPLAY_FORMAT))
    : '';
};

const parseGroupDateRange = (dateRange = '') => {
  if (!dateRange || !dateRange.includes(' - ')) {
    return null;
  }

  const [startText, endText] = dateRange.split(' - ');
  const startDate = dayjs(startText);
  const endDate = dayjs(endText);

  return startDate.isValid() && endDate.isValid() ? [startDate, endDate] : null;
};

const getStatusTag = (status) => (
  status === TAG_STATUS.ARCHIVED
    ? <Tag color="default">Archived</Tag>
    : <Tag color="green">Active</Tag>
);

const getTagRows = (taxonomy, tagUsage) => {
  const groupsByTagId = new Map();

  taxonomy.tagGroups.forEach((group) => {
    (group.tagIds || []).forEach((tagId) => {
      const currentGroups = groupsByTagId.get(tagId) || [];
      currentGroups.push(group);
      groupsByTagId.set(tagId, currentGroups);
    });
  });

  return withNumericDisplayIds(taxonomy.tags)
    .map((tag) => {
      const groups = groupsByTagId.get(tag.id) || [];

      return {
        ...tag,
        groupIds: groups.map((group) => group.id),
        groupNames: groups.map((group) => group.name).sort((left, right) => left.localeCompare(right)),
        usageCount: tagUsage[tag.name] || 0,
      };
    });
};

const getTagGroupRows = (taxonomy, tagUsage, systemTags = []) => {
  const tagsById = new Map(taxonomy.tags.map((tag) => [tag.id, tag]));
  const systemTagsById = new Map(systemTags.map((tag) => [tag.id, tag]));

  return withNumericDisplayIds(taxonomy.tagGroups)
    .map((group) => {
      const tags = (group.tagIds || [])
        .map((tagId) => tagsById.get(tagId))
        .filter(Boolean)
        .filter((tag) => tag.status !== TAG_STATUS.ARCHIVED)
        .sort((left, right) => left.name.localeCompare(right.name));
      const assignedSystemTags = (group.systemTagIds || [])
        .map((tagId) => systemTagsById.get(tagId))
        .filter(Boolean)
        .sort((left, right) => left.name.localeCompare(right.name));

      return {
        ...group,
        tags,
        tagNames: tags.map((tag) => tag.name),
        tagCount: tags.length,
        systemTagNames: assignedSystemTags.map((tag) => tag.name),
        usageCount: tags.reduce((total, tag) => total + (tagUsage[tag.name] || 0), 0),
      };
    });
};

const getSystemTagRows = (systemTags, taxonomy) => {
  const groupsBySystemTagId = new Map();

  taxonomy.tagGroups.forEach((group) => {
    (group.systemTagIds || []).forEach((systemTagId) => {
      const currentGroups = groupsBySystemTagId.get(systemTagId) || [];
      currentGroups.push(group);
      groupsBySystemTagId.set(systemTagId, currentGroups);
    });
  });

  return withNumericDisplayIds(systemTags)
    .map((systemTag) => {
      const groups = groupsBySystemTagId.get(systemTag.id) || [];

      return {
        ...systemTag,
        groupIds: groups.map((group) => group.id),
        groupNames: groups.map((group) => group.name).sort((left, right) => left.localeCompare(right)),
      };
    });
};

const getTagSearchValue = (tag) => [
  tag.name,
  tag.status,
  ...(tag.groupNames || []),
].join(' ').toLowerCase();

const getTagGroupSearchValue = (group) => [
  group.name,
  group.status,
  ...(group.tagNames || []),
  ...(group.systemTagNames || []),
].join(' ').toLowerCase();

const getSystemTagSearchValue = (tag) => [
  tag.name,
  tag.category,
  tag.sourceSystem,
  tag.description,
  ...(tag.appliesTo || []).map(getMessageTypeScopeLabel),
  ...(tag.appliesTo || []),
  ...(tag.groupNames || []),
].join(' ').toLowerCase();

const doesNameExist = (items, name, excludedId = null) => {
  const comparableName = normalizeComparableText(name);

  return items.some((item) => (
    item.id !== excludedId
    && normalizeComparableText(item.name) === comparableName
  ));
};

function SystemTagTable({
  onSystemTagGroupIdsChange,
  onToggle,
  onBulkSetEnabled,
  selectedRowKeys,
  onSelectedRowKeysChange,
  tagGroupOptions,
  tags,
}) {
  const selectedTags = useMemo(
    () => tags.filter((tag) => selectedRowKeys.includes(tag.id)),
    [selectedRowKeys, tags],
  );
  const hasSelectedDisabledTags = selectedTags.some((tag) => !tag.enabled);
  const hasSelectedEnabledTags = selectedTags.some((tag) => tag.enabled);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'displayId',
      key: 'id',
      width: 88,
      defaultSortOrder: 'descend',
      sorter: compareDisplayIdsAscending,
      render: (id) => <span className="settings-tag-id-cell">{id}</span>,
    },
    {
      title: 'Tag',
      dataIndex: 'name',
      key: 'name',
      width: 260,
      render: (name) => <span className="settings-tag-name-cell">{name}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '32%',
    },
    {
      title: 'Source',
      dataIndex: 'sourceSystem',
      key: 'sourceSystem',
      width: 160,
      render: (sourceSystem) => (
        <Tag color={sourceSystem === 'Social Listening' ? 'purple' : 'blue'}>{sourceSystem}</Tag>
      ),
    },
    {
      title: 'Applies To',
      dataIndex: 'appliesTo',
      key: 'appliesTo',
      width: 320,
      render: (appliesTo) => (
        <Space size={4} wrap>
          {appliesTo.map((target) => <Tag key={target}>{getMessageTypeScopeLabel(target)}</Tag>)}
        </Space>
      ),
    },
    {
      title: 'Tag Groups',
      dataIndex: 'groupIds',
      key: 'groupIds',
      width: 320,
      render: (groupIds, record) => (
        <Select
          mode="multiple"
          allowClear
          maxTagCount="responsive"
          value={groupIds}
          optionLabelProp="plainLabel"
          placeholder="Select Tag Groups"
          style={{ width: '100%' }}
          onChange={(nextGroupIds) => onSystemTagGroupIdsChange(record.id, nextGroupIds)}
        >
          {tagGroupOptions.map((option) => (
            <Select.Option
              key={option.value}
              value={option.value}
              label={option.plainLabel}
              plainLabel={option.plainLabel}
            >
              {option.label}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Matched Items',
      dataIndex: 'usageCount',
      key: 'usageCount',
      width: 132,
      align: 'right',
      sorter: (left, right) => left.usageCount - right.usageCount,
      render: (usageCount) => usageCount.toLocaleString('en-US'),
    },
    {
      title: 'Enabled',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 112,
      align: 'center',
      render: (_, record) => (
        <Switch
          aria-label={`Toggle ${record.name}`}
          checked={record.enabled}
          onChange={(checked) => onToggle(record.id, checked)}
        />
      ),
    },
  ];

  return (
    <AppProTable
      rowKey="id"
      className="settings-system-tag-table"
      rowSelection={{
        selectedRowKeys,
        onChange: onSelectedRowKeysChange,
      }}
      alertActions={[
        <Button
          key="enable-system-tags"
          type="link"
          disabled={!hasSelectedDisabledTags}
          onClick={() => onBulkSetEnabled(selectedRowKeys, true)}
        >
          Enable
        </Button>,
        <Button
          key="disable-system-tags"
          type="link"
          disabled={!hasSelectedEnabledTags}
          onClick={() => onBulkSetEnabled(selectedRowKeys, false)}
        >
          Disable
        </Button>,
      ]}
      columns={columns}
      dataSource={tags}
      emptyDescription="No system tags match the current search."
      scroll={{ x: 1544 }}
    />
  );
}

export default function SettingsTagManagementPage({
  initialActiveTab,
  initialTagView = 'managed',
} = {}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const requestedStatus = searchParams.get('status');
  const requestedAction = searchParams.get('action');
  const startingTab = initialActiveTab || (initialTagView === 'system' ? 'system' : requestedTab === 'groups' ? 'groups' : 'tags');
  const [activeTab, setActiveTab] = useState(startingTab);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(
    [TAG_STATUS.ACTIVE, TAG_STATUS.ARCHIVED].includes(requestedStatus) ? requestedStatus : 'all',
  );
  const [tagGroupFilter, setTagGroupFilter] = useState(undefined);
  const [taxonomy, setTaxonomy] = useManagedTagTaxonomy();
  const [systemTags, setSystemTags] = useManagedSystemTags();
  const [selectedTagRowKeys, setSelectedTagRowKeys] = useState([]);
  const [selectedSystemTagRowKeys, setSelectedSystemTagRowKeys] = useState([]);
  const [selectedGroupRowKeys, setSelectedGroupRowKeys] = useState([]);
  const [groupModalOpen, setGroupModalOpen] = useState(startingTab === 'groups' && requestedAction === 'add');
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [draftGroupName, setDraftGroupName] = useState('');
  const [draftGroupColor, setDraftGroupColor] = useState(DEFAULT_CHANNEL_GROUP_COLOR);
  const [draftGroupDateRange, setDraftGroupDateRange] = useState(null);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [editingTagId, setEditingTagId] = useState(null);
  const [draftTagName, setDraftTagName] = useState('');
  const [draftTagGroupIds, setDraftTagGroupIds] = useState([]);

  const tagUsage = useMemo(() => getTagUsageByName(CALENDAR_POSTS), []);
  const tagRows = useMemo(() => getTagRows(taxonomy, tagUsage), [taxonomy, tagUsage]);
  const groupRows = useMemo(() => getTagGroupRows(taxonomy, tagUsage, systemTags), [taxonomy, tagUsage, systemTags]);
  const systemTagRows = useMemo(() => getSystemTagRows(systemTags, taxonomy), [systemTags, taxonomy]);

  const tagGroupOptions = useMemo(() => (
    [...taxonomy.tagGroups]
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((group) => ({
        value: group.id,
        label: (
          <span className="settings-tag-icon-option">
            {getGroupIcon(group)}
            <span>{group.name}</span>
          </span>
        ),
        plainLabel: group.name,
      }))
  ), [taxonomy.tagGroups]);

  const activeGroupOptions = useMemo(() => (
    taxonomy.tagGroups
      .filter((group) => group.status !== TAG_GROUP_STATUS.ARCHIVED)
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((group) => ({
        value: group.id,
        label: (
          <span className="settings-tag-icon-option">
            {getGroupIcon(group)}
            <span>{group.name}</span>
          </span>
        ),
        plainLabel: group.name,
      }))
  ), [taxonomy.tagGroups]);

  const filteredTagRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sortByDisplayIdDescending(tagRows.filter((tag) => {
      if (statusFilter !== 'all' && tag.status !== statusFilter) {
        return false;
      }

      if (tagGroupFilter && !tag.groupIds.includes(tagGroupFilter)) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return getTagSearchValue(tag).includes(normalizedQuery);
    }));
  }, [query, statusFilter, tagGroupFilter, tagRows]);

  const filteredGroupRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sortByDisplayIdDescending(groupRows.filter((group) => {
      if (statusFilter !== 'all' && group.status !== statusFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return getTagGroupSearchValue(group).includes(normalizedQuery);
    }));
  }, [groupRows, query, statusFilter]);

  const filteredSystemTags = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return sortByDisplayIdDescending(systemTagRows);
    }

    return sortByDisplayIdDescending(systemTagRows.filter((tag) => getSystemTagSearchValue(tag).includes(normalizedQuery)));
  }, [query, systemTagRows]);

  const selectedTagRows = useMemo(
    () => tagRows.filter((tag) => selectedTagRowKeys.includes(tag.id)),
    [selectedTagRowKeys, tagRows],
  );
  const selectedGroupRows = useMemo(
    () => groupRows.filter((group) => selectedGroupRowKeys.includes(group.id)),
    [groupRows, selectedGroupRowKeys],
  );

  const resetSharedFilters = () => {
    setQuery('');
    setStatusFilter('all');
    setTagGroupFilter(undefined);
  };

  const resetGroupDialog = () => {
    setGroupModalOpen(false);
    setEditingGroupId(null);
    setDraftGroupName('');
    setDraftGroupColor(DEFAULT_CHANNEL_GROUP_COLOR);
    setDraftGroupDateRange(null);
  };

  const resetTagDialog = () => {
    setTagModalOpen(false);
    setEditingTagId(null);
    setDraftTagName('');
    setDraftTagGroupIds([]);
  };

  const openAddGroup = () => {
    setEditingGroupId(null);
    setDraftGroupName('');
    setDraftGroupColor(DEFAULT_CHANNEL_GROUP_COLOR);
    setDraftGroupDateRange(null);
    setGroupModalOpen(true);
  };

  const openEditGroup = (group) => {
    setEditingGroupId(group.id);
    setDraftGroupName(group.name);
    setDraftGroupColor(normalizeChannelGroupColor(group.color, group.name));
    setDraftGroupDateRange(parseGroupDateRange(group.dateRange));
    setGroupModalOpen(true);
  };

  const openAddTag = () => {
    setEditingTagId(null);
    setDraftTagName('');
    setDraftTagGroupIds(tagGroupFilter ? [tagGroupFilter] : []);
    setTagModalOpen(true);
  };

  const openEditTag = (tag) => {
    setEditingTagId(tag.id);
    setDraftTagName(tag.name);
    setDraftTagGroupIds([...(tag.groupIds || [])]);
    setTagModalOpen(true);
  };

  const openGroupPlanner = (groupId) => {
    navigate(`/publishing/campaigns/planner/${groupId}`);
  };

  const submitGroup = () => {
    const nextName = draftGroupName.trim();
    if (!nextName) {
      return;
    }

    if (doesNameExist(taxonomy.tagGroups, nextName, editingGroupId)) {
      message.error('Tag Group name already exists');
      return;
    }

    const nextColor = normalizeChannelGroupColor(draftGroupColor, nextName);
    const nextAccent = getChannelGroupColorMeta(nextColor, nextName).bg;
    const nextDateRange = formatGroupDateRange(draftGroupDateRange);

    setTaxonomy((currentTaxonomy) => {
      if (doesNameExist(currentTaxonomy.tagGroups, nextName, editingGroupId)) {
        return currentTaxonomy;
      }

      if (editingGroupId) {
        return {
          ...currentTaxonomy,
          tagGroups: currentTaxonomy.tagGroups.map((group) => (
            group.id === editingGroupId
              ? {
                ...group,
                name: nextName,
                color: nextColor,
                accent: nextAccent,
                dateRange: nextDateRange,
                icon: 'book',
              }
              : group
          )),
        };
      }

      const usedGroupIds = new Set(currentTaxonomy.tagGroups.map((group) => group.id));
      return {
        ...currentTaxonomy,
        tagGroups: [
          ...currentTaxonomy.tagGroups,
          createTagGroupEntity({
            id: makeTagGroupId(nextName, usedGroupIds),
            name: nextName,
            color: nextColor,
            accent: nextAccent,
            dateRange: nextDateRange,
            icon: 'book',
            tagIds: [],
          }),
        ],
      };
    });

    message.success(editingGroupId ? 'Tag Group updated' : 'Tag Group added');
    resetGroupDialog();
  };

  const submitTag = () => {
    const nextName = draftTagName.trim();
    if (!nextName) {
      return;
    }

    if (doesNameExist(taxonomy.tags, nextName, editingTagId)) {
      message.error('Tag name already exists');
      return;
    }

    setTaxonomy((currentTaxonomy) => {
      if (doesNameExist(currentTaxonomy.tags, nextName, editingTagId)) {
        return currentTaxonomy;
      }

      const usedTagIds = new Set(currentTaxonomy.tags.map((tag) => tag.id));
      const nextTag = editingTagId
        ? null
        : createTagEntity({
          id: makeTagId(nextName, usedTagIds),
          name: nextName,
        });
      const targetTagId = editingTagId || nextTag.id;

      return {
        tags: editingTagId
          ? currentTaxonomy.tags.map((tag) => (
            tag.id === editingTagId ? { ...tag, name: nextName } : tag
          ))
          : [...currentTaxonomy.tags, nextTag],
        tagGroups: currentTaxonomy.tagGroups.map((group) => {
          const selectedForGroup = draftTagGroupIds.includes(group.id);
          const currentTagIds = new Set(group.tagIds || []);

          if (selectedForGroup) {
            currentTagIds.add(targetTagId);
          } else {
            currentTagIds.delete(targetTagId);
          }

          return { ...group, tagIds: Array.from(currentTagIds) };
        }),
      };
    });

    message.success(editingTagId ? 'Tag updated' : 'Tag added');
    resetTagDialog();
  };

  const bulkSetTagStatus = (tagIds, status) => {
    if (!tagIds.length) {
      return;
    }

    const selectedIds = new Set(tagIds);
    setTaxonomy((currentTaxonomy) => ({
      ...currentTaxonomy,
      tags: currentTaxonomy.tags.map((tag) => (
        selectedIds.has(tag.id) ? { ...tag, status } : tag
      )),
    }));
    setSelectedTagRowKeys([]);
    message.success(status === TAG_STATUS.ARCHIVED ? 'Tags archived' : 'Tags restored');
  };

  const bulkSetGroupStatus = (groupIds, status) => {
    if (!groupIds.length) {
      return;
    }

    const selectedIds = new Set(groupIds);
    setTaxonomy((currentTaxonomy) => ({
      ...currentTaxonomy,
      tagGroups: currentTaxonomy.tagGroups.map((group) => (
        selectedIds.has(group.id) ? { ...group, status } : group
      )),
    }));
    setSelectedGroupRowKeys([]);
    message.success(status === TAG_GROUP_STATUS.ARCHIVED ? 'Tag Groups archived' : 'Tag Groups restored');
  };

  const setSystemTagGroupIds = (systemTagId, groupIds) => {
    const selectedGroupIds = new Set(groupIds || []);

    setTaxonomy((currentTaxonomy) => ({
      ...currentTaxonomy,
      tagGroups: currentTaxonomy.tagGroups.map((group) => {
        const currentSystemTagIds = new Set(group.systemTagIds || []);

        if (selectedGroupIds.has(group.id)) {
          currentSystemTagIds.add(systemTagId);
        } else {
          currentSystemTagIds.delete(systemTagId);
        }

        return {
          ...group,
          systemTagIds: Array.from(currentSystemTagIds),
        };
      }),
    }));
  };

  const toggleSystemTag = (tagId, enabled) => {
    const targetTag = systemTags.find((tag) => tag.id === tagId);

    setSystemTags((currentTags) => currentTags.map((tag) => (
      tag.id === tagId ? { ...tag, enabled } : tag
    )));

    message.success(`${enabled ? 'Enabled' : 'Disabled'} ${targetTag?.name || 'system tag'}`);
  };

  const bulkSetSystemTagsEnabled = (tagIds, enabled) => {
    if (!tagIds.length) {
      return;
    }

    const selectedTagIdSet = new Set(tagIds);
    const affectedTags = systemTags.filter((tag) => selectedTagIdSet.has(tag.id));

    setSystemTags((currentTags) => currentTags.map((tag) => (
      selectedTagIdSet.has(tag.id) ? { ...tag, enabled } : tag
    )));
    setSelectedSystemTagRowKeys([]);

    const changedLabel = enabled ? 'Enabled' : 'Disabled';
    message.success(
      affectedTags.length === 1
        ? `${changedLabel} ${affectedTags[0].name}`
        : `${changedLabel} ${affectedTags.length} system tags`,
    );
  };

  const tabs = (
    <Tabs
      activeKey={activeTab}
      className="settings-tag-tabs"
      onChange={(nextTab) => {
        setActiveTab(nextTab);
        setQuery('');
        setStatusFilter('all');
        setTagGroupFilter(undefined);
        setSelectedTagRowKeys([]);
        setSelectedSystemTagRowKeys([]);
        setSelectedGroupRowKeys([]);
      }}
      items={[
        { key: 'tags', label: 'Tags' },
        { key: 'groups', label: 'Tag Groups' },
        { key: 'system', label: 'System Tags' },
      ]}
    />
  );

  const toolbarFilters = (
    <AppToolbarFilters>
      <AppToolbarSearch>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder={
            activeTab === 'groups'
              ? 'Search tag groups...'
              : activeTab === 'system'
                ? 'Search system tags...'
                : 'Search tags...'
          }
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </AppToolbarSearch>
      {activeTab === 'tags' || activeTab === 'groups' ? (
        <AppToolbarFilter width={160}>
          <Select
            value={statusFilter}
            options={STATUS_FILTER_OPTIONS}
            labelRender={({ value, label }) => (
              value === 'all' ? STATUS_FILTER_LABEL : label
            )}
            onChange={(value) => {
              setStatusFilter(value);
              setSelectedTagRowKeys([]);
              setSelectedGroupRowKeys([]);
            }}
            style={{ width: '100%' }}
          />
        </AppToolbarFilter>
      ) : null}
      {activeTab === 'tags' ? (
        <AppToolbarFilter>
          <Select
            allowClear
            placeholder="Tag Group"
            value={tagGroupFilter}
            options={activeGroupOptions}
            onChange={(value) => {
              setTagGroupFilter(value);
              setSelectedTagRowKeys([]);
            }}
            style={{ width: '100%' }}
          />
        </AppToolbarFilter>
      ) : null}
      {(query || statusFilter !== 'all' || tagGroupFilter) ? (
        <AppToolbarUtility>
          <Button onClick={resetSharedFilters}>Clear all</Button>
        </AppToolbarUtility>
      ) : null}
    </AppToolbarFilters>
  );

  const toolbarPrimaryAction = activeTab === 'groups'
    ? (
      <Button type="primary" onClick={openAddGroup}>
        <PlusIco s={12} /> Add
      </Button>
    )
    : activeTab === 'tags'
      ? (
        <Button type="primary" onClick={openAddTag}>
          <PlusIco s={12} /> Add
        </Button>
      )
      : null;

  const tagColumns = [
    {
      title: 'ID',
      dataIndex: 'displayId',
      width: 88,
      defaultSortOrder: 'descend',
      sorter: compareDisplayIdsAscending,
      render: (id) => <span className="settings-tag-id-cell">{id}</span>,
    },
    {
      title: 'Tag',
      dataIndex: 'name',
      sorter: (left, right) => left.name.localeCompare(right.name),
      render: (name) => <span className="settings-tag-name-cell">{name}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 116,
      sorter: (left, right) => left.status.localeCompare(right.status),
      render: getStatusTag,
    },
    {
      title: 'Tag Groups',
      dataIndex: 'groupNames',
      width: 360,
      render: (groupNames) => (
        <Space size={4} wrap>
          {groupNames.length
            ? groupNames.map((groupName) => <Tag key={groupName}>{groupName}</Tag>)
            : <Tag color="default">Ungrouped</Tag>}
        </Space>
      ),
    },
    {
      title: 'Used in Calendar',
      dataIndex: 'usageCount',
      width: 148,
      align: 'right',
      sorter: (left, right) => left.usageCount - right.usageCount,
      render: (usageCount) => usageCount.toLocaleString('en-US'),
    },
  ];

  const groupColumns = [
    {
      title: 'ID',
      dataIndex: 'displayId',
      width: 88,
      defaultSortOrder: 'descend',
      sorter: compareDisplayIdsAscending,
      render: (id) => <span className="settings-tag-id-cell">{id}</span>,
    },
    {
      title: 'Tag Group',
      dataIndex: 'name',
      sorter: (left, right) => left.name.localeCompare(right.name),
      render: (_name, group) => (
        <span className="settings-tag-collection-cell">
          {getGroupIcon(group)}
          <span className="settings-tag-name-cell">{group.name}</span>
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 116,
      sorter: (left, right) => left.status.localeCompare(right.status),
      render: getStatusTag,
    },
    {
      title: 'Date Range',
      dataIndex: 'dateRange',
      width: 220,
      render: (dateRange) => dateRange || <Tag color="default">No range</Tag>,
    },
    {
      title: 'Tags',
      dataIndex: 'tagNames',
      render: (tagNames) => (
        <div className="settings-tag-preview-list">
          {tagNames.slice(0, 3).map((tagName) => (
            <Tag key={tagName}>{tagName}</Tag>
          ))}
          {tagNames.length > 3 ? <span className="settings-tag-preview-more">+{tagNames.length - 3} more</span> : null}
        </div>
      ),
    },
    {
      title: 'System Tags',
      dataIndex: 'systemTagNames',
      width: 260,
      render: (systemTagNames) => (
        <div className="settings-tag-preview-list">
          {systemTagNames.slice(0, 2).map((tagName) => (
            <Tag key={tagName} color="blue">{tagName}</Tag>
          ))}
          {systemTagNames.length > 2 ? <span className="settings-tag-preview-more">+{systemTagNames.length - 2} more</span> : null}
        </div>
      ),
    },
    {
      title: 'Planner',
      key: 'planner',
      width: 132,
      render: (_, group) => (
        <Button type="link" onClick={() => openGroupPlanner(group.id)}>
          Open Planner
        </Button>
      ),
    },
  ];

  const selectedActiveTags = selectedTagRows.filter((tag) => tag.status !== TAG_STATUS.ARCHIVED);
  const selectedArchivedTags = selectedTagRows.filter((tag) => tag.status === TAG_STATUS.ARCHIVED);
  const selectedActiveGroups = selectedGroupRows.filter((group) => group.status !== TAG_GROUP_STATUS.ARCHIVED);
  const selectedArchivedGroups = selectedGroupRows.filter((group) => group.status === TAG_GROUP_STATUS.ARCHIVED);

  const toolbarPortal = usePageSecondaryTopBar(
    <AppToolbarCard>
      <AppPageControls
        layout="toolbar-only"
        filters={toolbarFilters}
        primaryAction={toolbarPrimaryAction}
        marginBottom={0}
      />
    </AppToolbarCard>,
  );

  return (
    <AdminPageLayout
      title="Tag Management"
      breadcrumb="Settings"
      maxWidth="none"
      contentPadding="8px 24px 24px"
      pageControls={(
        <AppPageControls
          layout="tabs-first"
          tabs={tabs}
          marginBottom={0}
        />
      )}
    >
      {toolbarPortal}
      <div className="settings-tag-page">
        {activeTab === 'tags' ? (
          <AppTableCard>
          <AppProTable
            className="settings-tag-table"
            dataSource={filteredTagRows}
            rowKey="id"
            rowSelection={{
              selectedRowKeys: selectedTagRowKeys,
              onChange: setSelectedTagRowKeys,
            }}
            alertActions={[
              <Button
                key="edit-tag"
                type="link"
                disabled={selectedTagRows.length !== 1}
                onClick={() => {
                  if (selectedTagRows.length === 1) {
                    openEditTag(selectedTagRows[0]);
                  }
                }}
              >
                Edit
              </Button>,
              <Button
                key="archive-tag"
                type="link"
                disabled={!selectedActiveTags.length}
                onClick={() => bulkSetTagStatus(selectedActiveTags.map((tag) => tag.id), TAG_STATUS.ARCHIVED)}
              >
                Archive
              </Button>,
              <Button
                key="restore-tag"
                type="link"
                disabled={!selectedArchivedTags.length}
                onClick={() => bulkSetTagStatus(selectedArchivedTags.map((tag) => tag.id), TAG_STATUS.ACTIVE)}
              >
                Restore
              </Button>,
            ]}
            emptyDescription={
              query || statusFilter !== 'all' || tagGroupFilter
                ? 'No tags match the current filters.'
                : 'Add your first tag to get started.'
            }
            columns={tagColumns}
          />
          </AppTableCard>
        ) : null}

        {activeTab === 'groups' ? (
          <AppTableCard>
          <AppProTable
            className="settings-collection-table"
            dataSource={filteredGroupRows}
            rowKey="id"
            rowSelection={{
              selectedRowKeys: selectedGroupRowKeys,
              onChange: setSelectedGroupRowKeys,
            }}
            alertActions={[
              <Button
                key="edit-group"
                type="link"
                disabled={selectedGroupRows.length !== 1}
                onClick={() => {
                  if (selectedGroupRows.length === 1) {
                    openEditGroup(selectedGroupRows[0]);
                  }
                }}
              >
                Edit
              </Button>,
              <Button
                key="planner-group"
                type="link"
                disabled={selectedGroupRows.length !== 1}
                onClick={() => {
                  if (selectedGroupRows.length === 1) {
                    openGroupPlanner(selectedGroupRows[0].id);
                  }
                }}
              >
                Open Planner
              </Button>,
              <Button
                key="archive-group"
                type="link"
                disabled={!selectedActiveGroups.length}
                onClick={() => bulkSetGroupStatus(
                  selectedActiveGroups.map((group) => group.id),
                  TAG_GROUP_STATUS.ARCHIVED,
                )}
              >
                Archive
              </Button>,
              <Button
                key="restore-group"
                type="link"
                disabled={!selectedArchivedGroups.length}
                onClick={() => bulkSetGroupStatus(
                  selectedArchivedGroups.map((group) => group.id),
                  TAG_GROUP_STATUS.ACTIVE,
                )}
              >
                Restore
              </Button>,
            ]}
            emptyDescription={
              query || statusFilter !== 'all'
                ? 'No tag groups match the current filters.'
                : 'Add your first Tag Group to get started.'
            }
            columns={groupColumns}
          />
          </AppTableCard>
        ) : null}

        {activeTab === 'system' ? (
          <SystemTagTable
            onSystemTagGroupIdsChange={setSystemTagGroupIds}
            onToggle={toggleSystemTag}
            onBulkSetEnabled={bulkSetSystemTagsEnabled}
            selectedRowKeys={selectedSystemTagRowKeys}
            onSelectedRowKeysChange={setSelectedSystemTagRowKeys}
            tagGroupOptions={tagGroupOptions}
            tags={filteredSystemTags}
          />
        ) : null}
      </div>

      <Modal
        className="settings-tag-modal"
        destroyOnHidden
        open={groupModalOpen}
        title={editingGroupId ? 'Edit Tag Group' : 'Add Tag Group'}
        width={560}
        onCancel={resetGroupDialog}
        footer={[
          <Button key="cancel" onClick={resetGroupDialog}>Cancel</Button>,
          <Button
            key="submit"
            type="primary"
            disabled={!draftGroupName.trim()}
            onClick={submitGroup}
          >
            {editingGroupId ? 'Save' : 'Add'}
          </Button>,
        ]}
      >
        <div className="settings-tag-modal-grid">
          <div className="settings-tag-modal-field">
            <label htmlFor="settings-tag-group-name">Tag Group name *</label>
            <Input
              id="settings-tag-group-name"
              value={draftGroupName}
              autoFocus
              placeholder="Enter a Tag Group name"
              onChange={(event) => setDraftGroupName(event.target.value)}
            />
          </div>
          <div className="settings-tag-modal-field">
            <label htmlFor="settings-tag-group-color">Color</label>
            <Select
              id="settings-tag-group-color"
              value={draftGroupColor}
              optionLabelProp="plainLabel"
              getPopupContainer={getModalPopupContainer}
              onChange={setDraftGroupColor}
              placeholder="Select color"
            >
              {CHANNEL_GROUP_COLOR_OPTIONS.map((option) => (
                <Select.Option
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  plainLabel={option.label}
                >
                  <ChannelGroupColorChip
                    color={option.value}
                    groupName={option.label}
                  />
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="settings-tag-modal-field settings-tag-modal-field-full">
            <label htmlFor="settings-tag-group-date-range">Date Range</label>
            <DatePicker.RangePicker
              id="settings-tag-group-date-range"
              className="settings-tag-group-date-range"
              value={draftGroupDateRange}
              format={DATE_RANGE_DISPLAY_FORMAT}
              getPopupContainer={getModalPopupContainer}
              onChange={setDraftGroupDateRange}
              placeholder={['Start date', 'End date']}
            />
          </div>
        </div>
      </Modal>

      <Modal
        className="settings-tag-modal"
        destroyOnHidden
        open={tagModalOpen}
        title={editingTagId ? 'Edit Tag' : 'Add Tag'}
        width={520}
        onCancel={resetTagDialog}
        footer={[
          <Button key="cancel" onClick={resetTagDialog}>Cancel</Button>,
          <Button
            key="submit"
            type="primary"
            disabled={!draftTagName.trim()}
            onClick={submitTag}
          >
            {editingTagId ? 'Save' : 'Add'}
          </Button>,
        ]}
      >
        <div className="settings-tag-modal-grid">
          <div className="settings-tag-modal-field settings-tag-modal-field-full">
            <label htmlFor="settings-tag-name">Tag name *</label>
            <Input
              id="settings-tag-name"
              value={draftTagName}
              autoFocus
              placeholder="Enter a tag name"
              onChange={(event) => setDraftTagName(event.target.value)}
            />
          </div>
          <div className="settings-tag-modal-field settings-tag-modal-field-full">
            <label htmlFor="settings-tag-groups">Tag Groups</label>
            <Select
              id="settings-tag-groups"
              mode="multiple"
              allowClear
              value={draftTagGroupIds}
              optionLabelProp="plainLabel"
              getPopupContainer={getModalPopupContainer}
              onChange={setDraftTagGroupIds}
              placeholder="Select Tag Groups"
            >
              {activeGroupOptions.map((option) => (
                <Select.Option
                  key={option.value}
                  value={option.value}
                  label={option.plainLabel}
                  plainLabel={option.plainLabel}
                >
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </Modal>
    </AdminPageLayout>
  );
}
