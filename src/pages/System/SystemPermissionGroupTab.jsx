import { useState } from "react";
import { Button, Checkbox, Form, Input, Modal, Select, message } from "antd";
import { T, C, S } from "../../theme";
import { EditIco, PlusIco, TrashIco } from "../../components/icons";
import {
  INITIAL_ROLE_PERMISSIONS,
  MOCK_ROLES,
  PERMISSION_CATEGORY_LABELS,
  PERMISSION_FEATURES,
  buildRoleId,
  clonePermissionMatrix,
  cloneRolePermissionStore,
  createEmptyPermissionMatrix,
} from "./permissionMatrix";

const ROLE_CARD_COLUMN_STYLE = {
  width: "35%",
  flexShrink: 0,
};

const PERMISSION_CARD_STYLE = {
  background: C.white,
  border: `1px solid ${T.colorBorderSecondary}`,
  borderRadius: T.borderRadius,
  padding: T.paddingMD,
};

export const PermissionGroupTab = () => {
  const [roles, setRoles] = useState(MOCK_ROLES);
  const [selectedRole, setSelectedRole] = useState(MOCK_ROLES[0]?.id || "");
  const [savedRolePermissions, setSavedRolePermissions] = useState(() => cloneRolePermissionStore(INITIAL_ROLE_PERMISSIONS));
  const [draftRolePermissions, setDraftRolePermissions] = useState(() => cloneRolePermissionStore(INITIAL_ROLE_PERMISSIONS));
  const [createRoleModal, setCreateRoleModal] = useState(false);
  const [editRoleModal, setEditRoleModal] = useState(false);
  const [createRoleForm] = Form.useForm();
  const [editRoleForm] = Form.useForm();

  const selectedRoleData = roles.find(role => role.id === selectedRole);
  const selectedPermissions = draftRolePermissions[selectedRole] || createEmptyPermissionMatrix();
  const savedPermissions = savedRolePermissions[selectedRole] || createEmptyPermissionMatrix();
  const isPermissionDirty = JSON.stringify(selectedPermissions) !== JSON.stringify(savedPermissions);
  const canDeleteSelectedRole = selectedRoleData && selectedRoleData.id !== "superadmin";

  const openCreateRoleModal = () => {
    createRoleForm.setFieldsValue({
      name: "",
      desc: "",
      cloneFrom: selectedRole || undefined,
    });
    setCreateRoleModal(true);
  };

  const handleCreateRole = async () => {
    try {
      const values = await createRoleForm.validateFields();
      const roleId = buildRoleId(values.name, roles);
      const sourceMatrix = values.cloneFrom ? savedRolePermissions[values.cloneFrom] : null;
      const nextMatrix = sourceMatrix ? clonePermissionMatrix(sourceMatrix) : createEmptyPermissionMatrix();

      setRoles(prev => [
        ...prev,
        {
          id: roleId,
          name: values.name.trim(),
          desc: values.desc.trim(),
          color: T.colorPrimary,
        },
      ]);
      setSavedRolePermissions(prev => ({
        ...prev,
        [roleId]: clonePermissionMatrix(nextMatrix),
      }));
      setDraftRolePermissions(prev => ({
        ...prev,
        [roleId]: clonePermissionMatrix(nextMatrix),
      }));
      setSelectedRole(roleId);
      setCreateRoleModal(false);
      createRoleForm.resetFields();
      message.success("Permission group added");
    } catch {
      // validation failed
    }
  };

  const openEditRoleModal = () => {
    if (!selectedRoleData) return;
    editRoleForm.setFieldsValue({
      name: selectedRoleData.name,
      desc: selectedRoleData.desc,
    });
    setEditRoleModal(true);
  };

  const handleEditRole = async () => {
    try {
      const values = await editRoleForm.validateFields();
      setRoles(prev => prev.map(role => (
        role.id === selectedRole
          ? { ...role, name: values.name.trim(), desc: values.desc.trim() }
          : role
      )));
      setEditRoleModal(false);
      message.success("Permission group updated");
    } catch {
      // validation failed
    }
  };

  const handlePermissionChange = (category, featureKey, action, checked) => {
    setDraftRolePermissions(prev => {
      const currentMatrix = prev[selectedRole] || createEmptyPermissionMatrix();
      return {
        ...prev,
        [selectedRole]: {
          ...currentMatrix,
          [category]: {
            ...currentMatrix[category],
            [featureKey]: {
              ...currentMatrix[category]?.[featureKey],
              [action]: checked,
            },
          },
        },
      };
    });
  };

  const handleSavePermissions = () => {
    setSavedRolePermissions(prev => ({
      ...prev,
      [selectedRole]: clonePermissionMatrix(selectedPermissions),
    }));
    message.success("Permissions saved");
  };

  const handleDeleteRole = () => {
    if (!selectedRoleData) return;

    if (roles.length <= 1) {
      message.warning("At least one permission group must remain");
      return;
    }

    Modal.confirm({
      title: "Delete Permission Group",
      content: `Delete "${selectedRoleData.name}"? This action cannot be undone.`,
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: () => {
        const remainingRoles = roles.filter(role => role.id !== selectedRole);
        setRoles(remainingRoles);
        setSavedRolePermissions(prev => {
          const next = { ...prev };
          delete next[selectedRole];
          return next;
        });
        setDraftRolePermissions(prev => {
          const next = { ...prev };
          delete next[selectedRole];
          return next;
        });
        setSelectedRole(remainingRoles[0]?.id || "");
        message.success("Permission group deleted");
      },
    });
  };

  const getCategoryPermissionCount = (category, features) => (
    features.reduce((count, feature) => {
      const permissions = selectedPermissions[category]?.[feature.key] || {};
      return count + ["View", "Create", "Edit", "Delete"].filter(action => permissions[action]).length;
    }, 0)
  );

  return (
    <div style={{ display: "flex", gap: T.paddingLG }}>
      <div style={ROLE_CARD_COLUMN_STYLE}>
        <div style={PERMISSION_CARD_STYLE}>
            <div style={{ ...S.flexBetween, marginBottom: T.paddingMD }}>
              <div style={{ ...S.label, fontWeight: T.fontWeightStrong }}>Roles</div>
              <Button type="primary" onClick={openCreateRoleModal}>
                <PlusIco s={12} /> Add
              </Button>
            </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {roles.map(role => (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                style={{
                  padding: T.padding,
                  background: selectedRole === role.id ? T.colorPrimaryBg : "transparent",
                  border: selectedRole === role.id ? `1px solid ${T.colorPrimaryBorder}` : `1px solid ${T.colorBorderSecondary}`,
                  borderRadius: T.borderRadius,
                  cursor: "pointer",
                  transition: `all ${T.motionDurationMid}`,
                }}
              >
                <div style={{ ...S.flexStart, gap: 8, marginBottom: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: role.color, flexShrink: 0 }} />
                  <span style={{ fontWeight: T.fontWeightStrong, fontSize: T.fontSizeMD, color: selectedRole === role.id ? T.colorPrimary : T.colorTextBase }}>
                    {role.name}
                  </span>
                </div>
                <div style={{ fontSize: T.fontSizeXS, color: T.colorTextSecondary, marginLeft: 16 }}>{role.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {selectedRoleData && (
          <div style={PERMISSION_CARD_STYLE}>
            <div style={{ ...S.flexBetween, marginBottom: T.paddingMD }}>
              <div>
                <h3 style={{ margin: 0, fontSize: T.fontSizeLG, fontWeight: T.fontWeightStrong }}>{selectedRoleData.name}</h3>
              </div>
              <div style={{ ...S.flexStart, gap: 8 }}>
                {canDeleteSelectedRole ? (
                  <Button danger onClick={handleDeleteRole}>
                    <TrashIco s={12} /> Delete
                  </Button>
                ) : null}
                <Button onClick={openEditRoleModal}>
                  <EditIco s={12} /> Edit info
                </Button>
                <Button type="primary" disabled={!isPermissionDirty} onClick={handleSavePermissions}>
                  Save
                </Button>
              </div>
            </div>

            {Object.entries(PERMISSION_FEATURES).map(([category, features]) => {
              const selectedCount = getCategoryPermissionCount(category, features);
              const totalCount = features.length * 4;

              return (
                <div key={category} style={{ marginBottom: T.paddingMD }}>
                  <div style={{ fontWeight: T.fontWeightStrong, fontSize: T.fontSizeMD, marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
                    {PERMISSION_CATEGORY_LABELS[category] || category}
                    <span style={{ fontSize: T.fontSizeXS, background: T.colorFillSecondary, padding: "2px 8px", borderRadius: 10 }}>
                      {selectedCount}/{totalCount}
                    </span>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={{ padding: "8px", border: `1px solid ${T.colorBorderSecondary}`, textAlign: "left", fontSize: T.fontSizeSM, fontWeight: T.fontWeightStrong, background: T.colorFillTertiary }}>Feature</th>
                          <th style={{ padding: "8px", border: `1px solid ${T.colorBorderSecondary}`, textAlign: "center", fontSize: T.fontSizeSM, fontWeight: T.fontWeightStrong, background: T.colorFillTertiary, width: 80 }}>View</th>
                          <th style={{ padding: "8px", border: `1px solid ${T.colorBorderSecondary}`, textAlign: "center", fontSize: T.fontSizeSM, fontWeight: T.fontWeightStrong, background: T.colorFillTertiary, width: 80 }}>Create</th>
                          <th style={{ padding: "8px", border: `1px solid ${T.colorBorderSecondary}`, textAlign: "center", fontSize: T.fontSizeSM, fontWeight: T.fontWeightStrong, background: T.colorFillTertiary, width: 80 }}>Edit</th>
                          <th style={{ padding: "8px", border: `1px solid ${T.colorBorderSecondary}`, textAlign: "center", fontSize: T.fontSizeSM, fontWeight: T.fontWeightStrong, background: T.colorFillTertiary, width: 80 }}>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {features.map(feature => (
                          <tr key={feature.key}>
                            <td style={{ padding: "8px", border: `1px solid ${T.colorBorderSecondary}`, fontSize: T.fontSizeSM }}>{feature.name}</td>
                            <td style={{ padding: "8px", border: `1px solid ${T.colorBorderSecondary}`, textAlign: "center" }}>
                              <Checkbox checked={selectedPermissions[category]?.[feature.key]?.View || false} onChange={(event) => handlePermissionChange(category, feature.key, "View", event.target.checked)} />
                            </td>
                            <td style={{ padding: "8px", border: `1px solid ${T.colorBorderSecondary}`, textAlign: "center" }}>
                              <Checkbox checked={selectedPermissions[category]?.[feature.key]?.Create || false} onChange={(event) => handlePermissionChange(category, feature.key, "Create", event.target.checked)} />
                            </td>
                            <td style={{ padding: "8px", border: `1px solid ${T.colorBorderSecondary}`, textAlign: "center" }}>
                              <Checkbox checked={selectedPermissions[category]?.[feature.key]?.Edit || false} onChange={(event) => handlePermissionChange(category, feature.key, "Edit", event.target.checked)} />
                            </td>
                            <td style={{ padding: "8px", border: `1px solid ${T.colorBorderSecondary}`, textAlign: "center" }}>
                              <Checkbox checked={selectedPermissions[category]?.[feature.key]?.Delete || false} onChange={(event) => handlePermissionChange(category, feature.key, "Delete", event.target.checked)} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        open={createRoleModal}
        onCancel={() => setCreateRoleModal(false)}
        title="Add Permission Group"
        width={480}
        footer={[
          <Button key="cancel" onClick={() => setCreateRoleModal(false)}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={handleCreateRole}>Add</Button>,
        ]}
      >
        <Form form={createRoleForm} layout="vertical">
          <Form.Item label="Role name" name="name" rules={[{ required: true, message: "Please enter role name" }]}>
            <Input placeholder="Enter role name" />
          </Form.Item>
          <Form.Item label="Description" name="desc" rules={[{ required: true, message: "Please enter role description" }]}>
            <Input.TextArea rows={3} placeholder="Describe this role" />
          </Form.Item>
          <Form.Item label="Clone permissions from" name="cloneFrom">
            <Select
              allowClear
              placeholder="Start from blank permissions"
              options={roles.map(role => ({ value: role.id, label: role.name }))}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={editRoleModal}
        onCancel={() => setEditRoleModal(false)}
        title="Edit Permission Group"
        width={480}
        footer={[
          <Button key="cancel" onClick={() => setEditRoleModal(false)}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={handleEditRole}>Save</Button>,
        ]}
      >
        <Form form={editRoleForm} layout="vertical">
          <Form.Item label="Role name" name="name" rules={[{ required: true, message: "Please enter role name" }]}>
            <Input placeholder="Enter role name" />
          </Form.Item>
          <Form.Item label="Description" name="desc" rules={[{ required: true, message: "Please enter role description" }]}>
            <Input.TextArea rows={3} placeholder="Describe this role" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
