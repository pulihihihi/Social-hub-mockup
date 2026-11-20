import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { T } from "../../theme";
import { AppToolbarCard, AppTableCard } from "../../app/layout/AppCards";
import {
  PlusIco, SearchIco, EditIco, ExternalLinkIco,
} from "../../components/icons";
import { ChannelGroupBadge } from "../../components/ChannelGroupBadge";
import { Button, Input, Select, Tabs, Tooltip, message, Form } from 'antd';
import AdminPageLayout from "../../components/AdminPageLayout";
import { AppPageControls } from "../../app/layout/AppPageControls";
import { usePageSecondaryTopBar } from "../../app/layout/usePageSecondaryTopBar";
import {
  AppToolbarFilter,
  AppToolbarFilters,
  AppToolbarSearch,
  AppToolbarUtility,
} from "../../app/layout/AppToolbarFilters";
import { PLATFORM_LIST } from "../../data/platforms";
import { ChannelApiStatusBadge, PlatformDisplay } from "../../components/SharedBadges";
import { AppProTable } from "../../app/pro/AppProTable";
import { AppModalForm } from "../../app/pro/forms/AppModalForm";
import { hasMultiSelectFilter, matchesMultiSelectFilter } from "../../utils/multiSelectFilter";
import ChannelAddDrawerFields from "./channels/ChannelAddDrawerFields";
import {
  BulkChannelActionModal,
  ChannelGroupFormModal,
  DeleteChannelGroupsModal,
} from "./channels/ChannelManagementModals";
import {
  CHANNEL_API_STATUS_FILTER_OPTIONS,
  CHANNEL_TAB_ITEMS,
  buildMockChannels,
  normalizeChannelApiStatus,
} from "./channels/config";
import {
  getChannelColumns,
  getChannelGroupColumns,
} from "./channels/channelColumns";
import {
  useManagedUsers,
} from "../../data/userManagement";
import {
  DEFAULT_CHANNEL_GROUP_COLOR,
  useManagedChannelGroups,
} from "../../data/channelManagement";
import {
  buildChannelCountMap,
  getChannelLinkLabel,
  getChannelGroupNames,
  getFilteredChannelGroupRows,
  matchesChannelGroupFilter,
  removeChannelGroupValues,
  renameChannelGroupFilterValue,
  renameChannelGroupValues,
  resolveChannelsInitialTab,
} from "./channels/pageUtils";

const ChannelsPage = ({ initialTab = "channels" }) => {
  const location = useLocation();
  const resolvedInitialTab = useMemo(() => {
    return resolveChannelsInitialTab(location.search, initialTab);
  }, [initialTab, location.search]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t); }, []);
  const [activeTab, setActiveTab] = useState(resolvedInitialTab);
  useEffect(() => {
    setActiveTab(resolvedInitialTab);
  }, [resolvedInitialTab]);
  const [channelGroups, setChannelGroups] = useManagedChannelGroups();
  const [channels, setChannels] = useState(() => buildMockChannels(channelGroups));

  // Filters
  const [filterPlatform, setFilterPlatform] = useState([]);
  const [filterChannelGroup, setFilterChannelGroup] = useState([]);
  const [filterApiStatus, setFilterApiStatus] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedGroupRowKeys, setSelectedGroupRowKeys] = useState([]);
  const [searchQ, setSearchQ] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => { const t = setTimeout(() => setDebouncedSearch(searchQ), 300); return () => clearTimeout(t); }, [searchQ]);

  // Add channel modal
  const [addModal, setAddModal] = useState(false);
  const [addMethod, setAddMethod] = useState("api");
  const [addMode, setAddMode] = useState("single");
  const [csvFileName, setCsvFileName] = useState("");
  const [csvPreview, setCsvPreview] = useState([]);
  const [addForm] = Form.useForm();

  const [editingCell, setEditingCell] = useState(null);
  const [savingCell, setSavingCell] = useState(null);
  const [bulkChannelAction, setBulkChannelAction] = useState(null);
  const [bulkChannelValue, setBulkChannelValue] = useState(undefined);
  const [managedUsers] = useManagedUsers();

  useEffect(() => {
    setChannels((currentChannels) => {
      const syncedChannels = buildMockChannels(channelGroups);
      const currentChannelMap = new Map(currentChannels.map((channel) => [channel.sourceChannelId, channel]));

      return syncedChannels.map((channel) => ({
        ...channel,
        ...(currentChannelMap.get(channel.sourceChannelId) || {}),
        channelGroup: channel.channelGroup,
        channelGroups: channel.channelGroups,
      }));
    });
  }, [channelGroups]);

  // Channel group management
  const [groupModalMode, setGroupModalMode] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [groupFormName, setGroupFormName] = useState("");
  const [groupFormColor, setGroupFormColor] = useState(DEFAULT_CHANNEL_GROUP_COLOR);
  const [groupFormError, setGroupFormError] = useState("");
  const [deleteGroups, setDeleteGroups] = useState([]);
  const [groupSearchQ, setGroupSearchQ] = useState("");
  const channelCountMap = useMemo(() => buildChannelCountMap(channels), [channels]);

  const filtered = channels.filter(ch => {
    if (!matchesMultiSelectFilter(ch.platform, filterPlatform)) return false;
    if (!matchesChannelGroupFilter(ch, filterChannelGroup)) return false;
    if (!matchesMultiSelectFilter(normalizeChannelApiStatus(ch.health), filterApiStatus)) return false;
    if (debouncedSearch && !ch.name.toLowerCase().includes(debouncedSearch.toLowerCase()) && !String(ch.id).includes(debouncedSearch)) return false;
    return true;
  });
  const hasActiveFilters = hasMultiSelectFilter(filterPlatform) || hasMultiSelectFilter(filterChannelGroup) || hasMultiSelectFilter(filterApiStatus) || searchQ;
  const channelGroupFilterOptions = channelGroups.map((group) => ({
    value: group.name,
    label: <ChannelGroupBadge group={group} maxWidth={220} />,
  }));
  const channelGroupOptions = channelGroups.map((group) => ({
    value: group.name,
    label: <ChannelGroupBadge group={group} maxWidth={220} />,
  }));
  const channelGroupIdByName = useMemo(() => (
    new Map(channelGroups.map(group => [group.name, group.id]))
  ), [channelGroups]);
  const managedUserMap = useMemo(() => (
    new Map(managedUsers.map(user => [user.uid, user]))
  ), [managedUsers]);
  const currentEditorUid = managedUsers[0]?.uid || "user-tran-hai-son";
  const platOptions = PLATFORM_LIST.map(p => ({
    value: p.key,
    label: <PlatformDisplay platform={p.key} />,
  }));

  const hasUserChannelAccess = (user, sourceChannelId) => (
    Boolean(sourceChannelId) && (user.channelIds || []).includes(sourceChannelId)
  );
  const hasUserChannelGroupAccess = (user, channelGroupId) => (
    channelGroupId !== undefined
    && channelGroupId !== null
    && (user.channelGroupIds || []).some(id => String(id) === String(channelGroupId))
  );
  const getGroupTeamMembers = (group) => (
    managedUsers.filter(user => hasUserChannelGroupAccess(user, group.id))
  );
  const getChannelTeamMembers = (channel) => {
    const channelGroupIds = getChannelGroupNames(channel)
      .map(groupName => channelGroupIdByName.get(groupName))
      .filter(groupId => groupId !== undefined && groupId !== null);

    return managedUsers.filter(user => (
      hasUserChannelAccess(user, channel.sourceChannelId)
      || channelGroupIds.some(channelGroupId => hasUserChannelGroupAccess(user, channelGroupId))
    ));
  };
  const isEditingField = (channelId, field) => editingCell?.channelId === channelId && editingCell?.field === field;
  const isSavingField = (channelId, field) => savingCell?.channelId === channelId && savingCell?.field === field;

  const updateChannelField = (channelId, field, nextValue, successMessage) => {
    setSavingCell({ channelId, field });

    try {
      const currentChannel = channels.find((channel) => channel.id === channelId);

      setChannels(prev => prev.map(channel => (
        channel.id === channelId
          ? {
            ...channel,
            [field]: nextValue,
            ...(field === "channelGroups" ? { channelGroup: getChannelGroupNames(nextValue)[0] || "" } : {}),
            editedByUid: currentEditorUid,
          }
          : channel
      )));
      if (field === "channelGroups" && currentChannel?.sourceChannelId) {
        const nextGroupNameSet = new Set(getChannelGroupNames(nextValue));

        setChannelGroups(prevGroups => prevGroups.map((group) => {
          const channelIds = new Set(group.channelIds || []);

          if (nextGroupNameSet.has(group.name)) {
            channelIds.add(currentChannel.sourceChannelId);
          } else {
            channelIds.delete(currentChannel.sourceChannelId);
          }

          return { ...group, channelIds: [...channelIds] };
        }));
      }
      setEditingCell(null);
      message.success(successMessage);
    } catch {
      message.error("Something went wrong. Please try again.");
    } finally {
      setSavingCell(null);
    }
  };

  const renderConnectionStatusCell = (health, record) => {
    const normalizedApiStatus = normalizeChannelApiStatus(health);

    return (
      <Tooltip title={`${record.name} connection status is synced from the platform API.`}>
        <span style={{ display: "inline-flex" }}>
          <ChannelApiStatusBadge status={normalizedApiStatus} />
        </span>
      </Tooltip>
    );
  };

  const renderChannelLinkCell = (link, record) => {
    if (!link) {
      return <span style={{ color: T.colorTextTertiary, fontSize: T.fontSizeSM }}>-</span>;
    }

    const linkLabel = getChannelLinkLabel(link);

    return (
      <Tooltip title={link}>
        <Button
          aria-label={`Open channel link for ${record.name}`}
          href={link}
          icon={<ExternalLinkIco s={12} />}
          rel="noopener noreferrer"
          size="small"
          target="_blank"
          type="link"
          style={{
            height: 24,
            paddingInline: 0,
            fontSize: T.fontSizeSM,
            fontWeight: T.fontWeightStrong,
            maxWidth: 210,
          }}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {linkLabel}
          </span>
        </Button>
      </Tooltip>
    );
  };

  const renderEditableSelectCell = ({
    record,
    field,
    options,
    selectValue,
    displayValue,
    displayNode,
    minWidth = 160,
    ariaLabel,
    onChange,
    mutedWhenEmpty = false,
    disabled = false,
    selectMode,
  }) => {
    const isEditing = isEditingField(record.id, field);
    const isSaving = isSavingField(record.id, field);

    if (isEditing) {
      return (
        <div style={{ minWidth }} onClick={event => event.stopPropagation()}>
          <Select
            autoFocus
            mode={selectMode}
            allowClear
            maxTagCount="responsive"
            open={!isSaving}
            size="small"
            value={selectValue}
            options={options}
            loading={isSaving}
            style={{ width: "100%" }}
            onChange={onChange}
            onOpenChange={(open) => {
              if (!open && !isSaving) {
                setEditingCell(null);
              }
            }}
          />
        </div>
      );
    }

    return (
      <button
        type="button"
        disabled={disabled}
        onClick={(event) => {
          event.stopPropagation();
          setEditingCell({ channelId: record.id, field });
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          width: "100%",
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: disabled ? "not-allowed" : "pointer",
          textAlign: "left",
          opacity: disabled ? 0.72 : 1,
        }}
        aria-label={ariaLabel}
      >
        {displayNode || (
          <span style={{ fontSize: T.fontSizeSM, color: mutedWhenEmpty && !displayValue ? T.colorTextTertiary : T.colorTextBase }}>
            {displayValue || "-"}
          </span>
        )}
        <span style={{ color: T.colorTextTertiary, display: "flex", flexShrink: 0, opacity: disabled ? 0.4 : 1 }}>
          <EditIco s={11} />
        </span>
      </button>
    );
  };

  const groupRows = getFilteredChannelGroupRows({
    channelCountMap,
    channelGroups,
    query: groupSearchQ,
  });
  const selectedChannels = channels.filter(channel => selectedRowKeys.includes(channel.id));
  const channelFilters = (
    <AppToolbarFilters>
      <AppToolbarSearch>
        <Input placeholder="Search by name or ID..." value={searchQ} onChange={e => setSearchQ(e.target.value)} prefix={<SearchIco s={12} />} />
      </AppToolbarSearch>
      <AppToolbarFilter>
        <Select mode="multiple" allowClear maxTagCount="responsive" placeholder="Platform" value={filterPlatform} options={platOptions} onChange={v => setFilterPlatform(v)} style={{ width: "100%" }} />
      </AppToolbarFilter>
      <AppToolbarFilter>
        <Select mode="multiple" allowClear maxTagCount="responsive" placeholder="Channel Group" value={filterChannelGroup} options={channelGroupFilterOptions} onChange={v => setFilterChannelGroup(v)} style={{ width: "100%" }} />
      </AppToolbarFilter>
      <AppToolbarFilter>
        <Select mode="multiple" allowClear maxTagCount="responsive" placeholder="Connection Status" value={filterApiStatus} options={CHANNEL_API_STATUS_FILTER_OPTIONS.filter(option => option.value !== "all")} onChange={v => setFilterApiStatus(v)} style={{ width: "100%" }} />
      </AppToolbarFilter>
      {hasActiveFilters && (
        <AppToolbarUtility>
          <Button onClick={() => { setFilterPlatform([]); setFilterChannelGroup([]); setFilterApiStatus([]); setSearchQ(""); }}>
            Clear all
          </Button>
        </AppToolbarUtility>
      )}
    </AppToolbarFilters>
  );
  const channelPrimaryAction = (
    <Button type="primary" onClick={() => {
      setAddModal(true);
      setAddMethod("api");
      setAddMode("single");
      setCsvFileName("");
      setCsvPreview([]);
      addForm.resetFields();
    }}>
      <PlusIco s={12} /> Add
    </Button>
  );
  const groupFilters = (
    <AppToolbarFilters>
      <AppToolbarSearch>
        <Input placeholder="Search groups..." value={groupSearchQ} onChange={e => setGroupSearchQ(e.target.value)} prefix={<SearchIco s={12} />} />
      </AppToolbarSearch>
    </AppToolbarFilters>
  );
  const groupPrimaryAction = (
    <Button type="primary" onClick={() => {
      setEditingGroup(null);
      setGroupFormName("");
      setGroupFormColor(DEFAULT_CHANNEL_GROUP_COLOR);
      setGroupFormError("");
      setGroupModalMode("add");
    }}>
      <PlusIco s={12} /> Add
    </Button>
  );
  const activeToolbarControls = (
    <AppToolbarCard>
      {activeTab === "channels"
        ? <AppPageControls layout="toolbar-only" filters={channelFilters} primaryAction={channelPrimaryAction} marginBottom={0} />
        : <AppPageControls layout="toolbar-only" filters={groupFilters} primaryAction={groupPrimaryAction} marginBottom={0} />}
    </AppToolbarCard>
  );
  const activeToolbarPortal = usePageSecondaryTopBar(activeToolbarControls);

  const openBulkChannelAction = (action) => {
    setBulkChannelAction(action);
    setBulkChannelValue(undefined);
  };

  const closeBulkChannelAction = () => {
    setBulkChannelAction(null);
    setBulkChannelValue(undefined);
  };

  const applyBulkChannelAction = () => {
    if (!bulkChannelAction || bulkChannelValue === undefined) {
      return;
    }

    try {
      const nextFieldValue = bulkChannelAction === "channelGroups"
        ? getChannelGroupNames(bulkChannelValue)
        : bulkChannelValue;
      const nextGroupNameSet = new Set(nextFieldValue);
      const selectedSourceChannelIds = selectedChannels
        .map(channel => channel.sourceChannelId)
        .filter(Boolean);

      setChannels(prev => prev.map(channel => (
        selectedRowKeys.includes(channel.id)
          ? {
            ...channel,
            [bulkChannelAction]: nextFieldValue,
            ...(bulkChannelAction === "channelGroups" ? { channelGroup: nextFieldValue[0] || "" } : {}),
            editedByUid: currentEditorUid,
          }
          : channel
      )));
      if (bulkChannelAction === "channelGroups") {
        setChannelGroups(prevGroups => prevGroups.map((group) => {
          const channelIds = new Set(group.channelIds || []);

          selectedSourceChannelIds.forEach((sourceChannelId) => {
            if (nextGroupNameSet.has(group.name)) {
              channelIds.add(sourceChannelId);
            } else {
              channelIds.delete(sourceChannelId);
            }
          });

          return { ...group, channelIds: [...channelIds] };
        }));
      }

      const successCopy = bulkChannelAction === "channelGroups"
        ? "Channel group assigned"
        : "Channels updated";

      message.success(`${successCopy} for ${selectedRowKeys.length} channel(s)`);
      setSelectedRowKeys([]);
      closeBulkChannelAction();
    } catch {
      message.error("Something went wrong. Please try again.");
    }
  };

  const confirmDeleteGroups = (groups) => {
    if (!groups.length) {
      return;
    }

    setDeleteGroups(groups);
  };

  const openEditGroup = (group) => {
    setEditingGroup(group);
    setGroupFormName(group.name);
    setGroupFormColor(group.color || DEFAULT_CHANNEL_GROUP_COLOR);
    setGroupFormError("");
    setGroupModalMode("edit");
  };

  const removeGroups = (groups) => {
    const groupIds = new Set(groups.map(group => group.id));
    const groupNames = new Set(groups.map(group => group.name));

    setChannelGroups(prev => prev.filter(group => !groupIds.has(group.id)));
    setChannels(prev => prev.map((channel) => {
      const currentGroups = getChannelGroupNames(channel);
      const nextGroups = removeChannelGroupValues(channel, groupNames);

      return nextGroups.length === currentGroups.length
        ? channel
        : { ...channel, channelGroups: nextGroups, channelGroup: nextGroups[0] || "" };
    }));

    if (filterChannelGroup.some((groupName) => groupNames.has(groupName))) {
      setFilterChannelGroup(filterChannelGroup.filter((groupName) => !groupNames.has(groupName)));
    }

    if (editingCell?.field === "channelGroups") {
      setEditingCell(null);
    }

    setSelectedGroupRowKeys(prev => prev.filter(key => !groupIds.has(key)));
  };

  const submitGroupForm = () => {
    const nextName = groupFormName?.trim();

    if (!nextName) {
      setGroupFormError("Please enter group name");
      return;
    }

    try {
      setGroupFormError("");

      if (groupModalMode === "edit" && editingGroup) {
        setChannelGroups(prev => prev.map(group => (
          group.id === editingGroup.id
            ? { ...group, name: nextName, color: groupFormColor }
            : group
        )));
        setChannels(prev => prev.map((channel) => {
          const currentGroups = getChannelGroupNames(channel);

          if (!currentGroups.includes(editingGroup.name)) {
            return channel;
          }

          const nextGroups = renameChannelGroupValues(channel, editingGroup.name, nextName);

          return { ...channel, channelGroups: nextGroups, channelGroup: nextGroups[0] || "" };
        }));

        if (filterChannelGroup.includes(editingGroup.name)) {
          setFilterChannelGroup(prev => renameChannelGroupFilterValue(prev, editingGroup.name, nextName));
        }

        setSelectedGroupRowKeys(prev => prev.map(key => (
          key === editingGroup.id ? editingGroup.id : key
        )));

        message.success("Channel group updated");
      } else {
        setChannelGroups(prev => [
          {
            id: Math.max(...prev.map(group => group.id), 0) + 1,
            name: nextName,
            color: groupFormColor,
            channelIds: [],
          },
          ...prev,
        ]);
        message.success("Group added");
      }

      setEditingGroup(null);
      setGroupFormName("");
      setGroupFormColor(DEFAULT_CHANNEL_GROUP_COLOR);
      setGroupModalMode(null);
    } catch {
      message.error("Something went wrong. Please try again.");
    }
  };
  const channelColumns = getChannelColumns({
    channelGroupOptions,
    channelGroups,
    getChannelTeamMembers,
    managedUserMap,
    renderChannelLinkCell,
    renderConnectionStatusCell,
    renderEditableSelectCell,
    updateChannelField,
  });
  const groupColumns = getChannelGroupColumns({ getGroupTeamMembers, onEditGroup: openEditGroup });

  return (
    <>
      {activeToolbarPortal}
      <AdminPageLayout
        title="Channel"
        contentPadding={`${T.paddingXS}px ${T.paddingLG}px ${T.paddingLG}px`}
        pageControls={(
          <AppPageControls
            layout="tabs-first"
            tabs={(
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={CHANNEL_TAB_ITEMS}
                style={{ marginBottom: 0 }}
                tabBarStyle={{ marginBottom: T.paddingXS }}
              />
            )}
          />
        )}
      >
        <AppTableCard>
        {activeTab === "channels" ? (
          <AppProTable
            dataSource={filtered}
            rowKey="id"
            loading={loading}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            alertActions={[
              <a key="assign-channel-group" onClick={() => openBulkChannelAction("channelGroups")}>
                Assign Group
              </a>,
              <a key="delete-channel" onClick={() => { try { setChannels(prev => prev.filter(c => !selectedRowKeys.includes(c.id))); setSelectedRowKeys([]); message.success(`${selectedRowKeys.length} channel(s) deleted`); } catch { message.error("Something went wrong. Please try again."); } }}>
                Delete
              </a>,
            ]}
            emptyDescription={hasActiveFilters ? "Try adjusting your filters." : "Add your first channel to get started."}
            columns={channelColumns}
          />
        ) : (
          <AppProTable
            loading={loading}
            dataSource={groupRows}
            rowKey="id"
            rowSelection={{
              selectedRowKeys: selectedGroupRowKeys,
              onChange: setSelectedGroupRowKeys,
            }}
            alertActions={[
              ...(selectedGroupRowKeys.length === 1 ? [
                <a
                  key="edit-group"
                  onClick={() => {
                    const selectedGroup = groupRows.find((item) => item.id === selectedGroupRowKeys[0]);

                    if (selectedGroup) {
                      openEditGroup(selectedGroup);
                    }
                  }}
                >
                  Edit
                </a>,
              ] : []),
              <a
                key="delete-group"
                onClick={() => {
                  const groups = groupRows.filter(item => selectedGroupRowKeys.includes(item.id));
                  confirmDeleteGroups(groups);
                }}
              >
                Delete
              </a>,
            ]}
            emptyDescription={groupSearchQ ? "No groups match your search." : "Add your first group to get started."}
            columns={groupColumns}
          />
        )}
        </AppTableCard>

        {/* Add Channel Modal */}
        <AppModalForm
        open={addModal}
        onOpenChange={(open) => {
          setAddModal(open);
          if (!open) {
            setCsvFileName("");
            setCsvPreview([]);
            addForm.resetFields();
          }
        }}
        title="Add Channel"
        width={560}
        form={addForm}
        layout="vertical"
        submitter={addMethod === "api" ? false : undefined}
        submitText={addMode === "csv" ? `Import ${csvPreview.length || ""} Channels` : "Add Channel"}
        onFinish={async () => {
          try {
            await addForm.validateFields();
            setAddModal(false);
            setCsvFileName("");
            setCsvPreview([]);
            message.success(addMode === "csv" ? `Imported ${csvPreview.length} channels` : "Channel added");
            addForm.resetFields();
            return true;
          } catch {
            return false;
          }
        }}
        >
        <ChannelAddDrawerFields
          addMethod={addMethod}
          addMode={addMode}
          channelGroups={channelGroups}
          csvFileName={csvFileName}
          csvPreview={csvPreview}
          setAddMethod={setAddMethod}
          setAddMode={setAddMode}
          setCsvFileName={setCsvFileName}
          setCsvPreview={setCsvPreview}
        />
        </AppModalForm>

        <BulkChannelActionModal
        action={bulkChannelAction}
        channelGroupOptions={channelGroupOptions}
        onApply={applyBulkChannelAction}
        onCancel={closeBulkChannelAction}
        selectedCount={selectedChannels.length}
        value={bulkChannelValue}
        setValue={setBulkChannelValue}
        />

        <ChannelGroupFormModal
        color={groupFormColor}
        error={groupFormError}
        mode={groupModalMode}
        name={groupFormName}
        onCancel={() => {
          setGroupModalMode(null);
          setEditingGroup(null);
          setGroupFormName("");
          setGroupFormColor(DEFAULT_CHANNEL_GROUP_COLOR);
          setGroupFormError("");
        }}
        onChangeColor={setGroupFormColor}
        onChangeName={(nextName) => {
          setGroupFormName(nextName);
          if (groupFormError) {
            setGroupFormError("");
          }
        }}
        onSubmit={submitGroupForm}
        />

        <DeleteChannelGroupsModal
        channelCountMap={channelCountMap}
        groups={deleteGroups}
        onCancel={() => setDeleteGroups([])}
        onConfirm={() => {
          try {
            if (deleteGroups.length > 0) {
              removeGroups(deleteGroups);
              const deletedCount = deleteGroups.length;
              setDeleteGroups([]);
              message.success(deletedCount > 1 ? `${deletedCount} groups deleted` : "Group deleted");
            }
          } catch {
            message.error("Something went wrong. Please try again.");
          }
        }}
        />

      </AdminPageLayout>
    </>
  );
};

export default ChannelsPage;

