import { Select } from "antd";
import { T } from "../../theme";
import { EditIco } from "../../components/icons";
import { USER_ROLES_OPTIONS } from "../../data/userManagement";
import { RoleTag } from "./SystemAccessCells";

const EditableUserRoleCell = ({ isEditing, isSaving, onCancelEdit, onChangeRole, onStartEdit, user }) => {
  if (isEditing) {
    return (
      <div style={{ minWidth: 160 }} onClick={(event) => event.stopPropagation()}>
        <Select
          autoFocus
          open={!isSaving}
          size="small"
          value={user.role}
          options={USER_ROLES_OPTIONS}
          loading={isSaving}
          style={{ width: "100%" }}
          onChange={(value) => onChangeRole(user.id, value)}
          onOpenChange={(open) => {
            if (!open && !isSaving) {
              onCancelEdit();
            }
          }}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onStartEdit(user.id);
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
        cursor: "pointer",
        textAlign: "left",
      }}
      aria-label={`Edit role for ${user.name}`}
    >
      <RoleTag role={user.role} />
      <span style={{ color: T.colorTextTertiary, display: "flex", flexShrink: 0 }}>
        <EditIco s={11} />
      </span>
    </button>
  );
};

export default EditableUserRoleCell;
