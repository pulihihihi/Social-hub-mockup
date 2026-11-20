import { AppTableCard } from "../../app/layout/AppCards";
import { useEffect, useMemo, useState } from "react";
import { Form, message } from "antd";
import { ChannelGroupBadge } from "../../components/ChannelGroupBadge";
import { PlatformDisplay } from "../../components/SharedBadges";
import { AppProTable } from "../../app/pro/AppProTable";
import { AppModalForm } from "../../app/pro/forms/AppModalForm";
import { hasMultiSelectFilter, matchesMultiSelectFilter } from "../../utils/multiSelectFilter";
import { sortByIdDescending } from "../../utils/idSort";
import {
  createManagedUser,
  useManagedUsers,
} from "../../data/userManagement";
import {
  MANAGED_CHANNELS,
  useManagedChannelGroups,
} from "../../data/channelManagement";
import { getSystemAdminColumns } from "./SystemAdminColumns";
import SystemUserModalFields from "./SystemUserModalFields";
import EditableUserRoleCell from "./EditableUserRoleCell";
import { SystemAdminToolbarPortal } from "./SystemAdminToolbar";

export const AdminTab = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useManagedUsers();
  const [channelGroups] = useManagedChannelGroups();
  const [page, setPage] = useState(1);
  const [searchEmail, setSearchEmail] = useState("");
  const [filterRole, setFilterRole] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userModalMode, setUserModalMode] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm] = Form.useForm();
  const watchedChannelGroupIds = Form.useWatch("channelGroupIds", userForm) || [];
  const watchedChannelIds = Form.useWatch("channelIds", userForm) || [];
  const [editingCell, setEditingCell] = useState(null);
  const [savingCell, setSavingCell] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const pageSize = 10;
  const isEditingField = (userId, field) => editingCell?.userId === userId && editingCell?.field === field;
  const isSavingField = (userId, field) => savingCell?.userId === userId && savingCell?.field === field;

  const openAddUser = () => {
    setEditingUser(null);
    userForm.resetFields();
    userForm.setFieldsValue({
      role: "Viewer",
      channelIds: [],
      channelGroupIds: [],
    });
    setUserModalMode("add");
  };

  const openEditUser = (user) => {
    setEditingUser(user);
    userForm.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
      channelIds: user.channelIds || [],
      channelGroupIds: user.channelGroupIds || [],
    });
    setUserModalMode("edit");
  };

  const openSelectedUserEdit = () => {
    if (selectedRowKeys.length !== 1) {
      message.warning("Select one user to edit");
      return;
    }

    const selectedUser = users.find(user => user.id === selectedRowKeys[0]);
    if (selectedUser) {
      openEditUser(selectedUser);
    }
  };

  const closeUserModal = () => {
    setUserModalMode(null);
    setEditingUser(null);
    userForm.resetFields();
  };

  const handleSubmitUser = async () => {
    try {
      const values = await userForm.validateFields();
      const nextValues = {
        ...values,
        channelIds: values.channelIds || [],
        channelGroupIds: values.channelGroupIds || [],
      };

      if (userModalMode === "edit" && editingUser) {
        setUsers(prev => prev.map(user => (
          user.id === editingUser.id ? { ...user, ...nextValues } : user
        )));
        message.success("User updated");
      } else {
        setUsers(prev => [
          createManagedUser(nextValues, prev),
          ...prev,
        ]);
        message.success("User added successfully");
      }

      closeUserModal();
      return true;
    } catch {
      // validation failed
    }

    return false;
  };

  const updateUserRoleInline = (userId, role) => {
    setSavingCell({ userId, field: "role" });

    try {
      setUsers(prev => prev.map(user => (
        user.id === userId ? { ...user, role } : user
      )));
      setEditingCell(null);
      message.success("User role updated");
    } catch {
      message.error("Something went wrong. Please try again.");
    } finally {
      setSavingCell(null);
    }
  };

  const renderEditableUserRoleCell = (user) => {
    return (
      <EditableUserRoleCell
        isEditing={isEditingField(user.id, "role")}
        isSaving={isSavingField(user.id, "role")}
        onCancelEdit={() => setEditingCell(null)}
        onChangeRole={updateUserRoleInline}
        onStartEdit={(userId) => setEditingCell({ userId, field: "role" })}
        user={user}
      />
    );
  };

  const channelMap = useMemo(() => new Map(MANAGED_CHANNELS.map(channel => [channel.id, channel])), []);
  const channelGroupMap = useMemo(() => new Map(channelGroups.map(group => [group.id, group])), [channelGroups]);
  const channelOptions = useMemo(() => (
    MANAGED_CHANNELS.map(channel => ({
      value: channel.id,
      label: (
        <PlatformDisplay
          platform={channel.platformKey || channel.platform}
          label={channel.name}
          iconSize="inline"
        />
      ),
    }))
  ), []);
  const channelGroupOptions = useMemo(() => (
    channelGroups.map(group => ({
      value: group.id,
      label: <ChannelGroupBadge group={group} maxWidth={220} />,
    }))
  ), [channelGroups]);
  const getUserChannels = (user) => (user.channelIds || []).map(id => channelMap.get(id)).filter(Boolean);
  const getUserChannelGroups = (user) => (user.channelGroupIds || []).map(id => channelGroupMap.get(id)).filter(Boolean);
  const columns = getSystemAdminColumns({
    getUserChannelGroups,
    getUserChannels,
    renderEditableUserRoleCell,
  });

  const filtered = useMemo(() => (
    sortByIdDescending(users.filter(user => {
      if (!matchesMultiSelectFilter(user.role, filterRole)) return false;
      if (searchEmail && !user.email.toLowerCase().includes(searchEmail.toLowerCase()) && !user.name.toLowerCase().includes(searchEmail.toLowerCase())) return false;
      return true;
    }))
  ), [users, filterRole, searchEmail]);

  const hasActiveFilters = hasMultiSelectFilter(filterRole) || Boolean(searchEmail);

  return (
    <div>
      <SystemAdminToolbarPortal
        filterRole={filterRole}
        hasActiveFilters={hasActiveFilters}
        onAddUser={openAddUser}
        searchEmail={searchEmail}
        setFilterRole={setFilterRole}
        setPage={setPage}
        setSearchEmail={setSearchEmail}
      />

      <AppTableCard>
      <AppProTable
        loading={loading}
        dataSource={filtered}
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        pagination={{
          current: page,
          pageSize,
          total: filtered.length,
          onChange: setPage,
        }}
        alertActions={[
          <a
            key="edit-admin-user"
            disabled={selectedRowKeys.length !== 1}
            onClick={openSelectedUserEdit}
          >
            Edit
          </a>,
          <a key="delete-admin-user" onClick={() => {
            setUsers(prev => prev.filter(user => !selectedRowKeys.includes(user.id)));
            setSelectedRowKeys([]);
            message.success(`${selectedRowKeys.length} user(s) removed`);
          }}>
            Delete
          </a>,
        ]}
        emptyDescription={hasActiveFilters ? "Try adjusting your filters." : "Add your first user to get started."}
        columns={columns}
      />
      </AppTableCard>

      <AppModalForm
        open={!!userModalMode}
        onOpenChange={(open) => {
          if (!open) {
            closeUserModal();
          }
        }}
        title={userModalMode === "edit" ? "Edit User" : "Add User"}
        width={680}
        form={userForm}
        layout="vertical"
        submitText={userModalMode === "edit" ? "Save" : "Add"}
        onFinish={handleSubmitUser}
      >
          <SystemUserModalFields
            channelGroups={channelGroups}
            channelGroupOptions={channelGroupOptions}
          channelOptions={channelOptions}
          watchedChannelGroupIds={watchedChannelGroupIds}
          watchedChannelIds={watchedChannelIds}
        />
      </AppModalForm>
    </div>
  );
};
