import { Button, Form, Input, Modal, Select } from "antd";
import { ChannelGroupColorChip } from "../../../components/ChannelGroupBadge";
import { CHANNEL_GROUP_COLOR_OPTIONS } from "../../../data/channelManagement";
import { S, T } from "../../../theme";

export const BulkChannelActionModal = ({
  action,
  channelGroupOptions,
  onApply,
  onCancel,
  selectedCount,
  value,
  setValue,
}) => (
  <Modal
    open={!!action}
    onCancel={onCancel}
    title="Assign Group"
    width={460}
    footer={[
      <Button key="cancel" onClick={onCancel}>Cancel</Button>,
      <Button
        key="apply"
        type="primary"
        disabled={value === undefined}
        onClick={onApply}
      >
        Apply
      </Button>,
    ]}
    destroyOnHidden
  >
    <div style={{ marginBottom: 12, color: T.colorTextSecondary, fontSize: T.fontSizeSM }}>
      Apply to <strong>{selectedCount}</strong> selected channel{selectedCount > 1 ? "s" : ""}.
    </div>
    <Select
      mode="multiple"
      allowClear
      maxTagCount="responsive"
      value={value}
      placeholder="Select channel groups"
      options={channelGroupOptions}
      style={{ width: "100%" }}
      onChange={setValue}
    />
  </Modal>
);

export const ChannelGroupFormModal = ({
  color,
  error,
  mode,
  name,
  onCancel,
  onChangeColor,
  onChangeName,
  onSubmit,
}) => (
  <Modal
    open={!!mode}
    onCancel={onCancel}
    title={mode === "edit" ? "Edit Group" : "Add Group"}
    width={420}
    footer={(
      <div style={{ ...S.flexStart, gap: 8, justifyContent: "flex-end" }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" onClick={onSubmit}>
          {mode === "edit" ? "Save" : "Add"}
        </Button>
      </div>
    )}
    destroyOnHidden
  >
    <Form layout="vertical">
      <Form.Item label="Group Name" validateStatus={error ? "error" : ""} help={error || null}>
        <Input
          placeholder="Enter group name..."
          value={name}
          onChange={(event) => onChangeName(event.target.value)}
          onPressEnter={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        />
      </Form.Item>
      <Form.Item label="Color">
        <Select
          value={color}
          placeholder="Select color"
          options={CHANNEL_GROUP_COLOR_OPTIONS.map((option) => ({
            value: option.value,
            label: (
              <ChannelGroupColorChip
                color={option.value}
                groupName={option.label}
              />
            ),
          }))}
          onChange={onChangeColor}
        />
      </Form.Item>
    </Form>
  </Modal>
);

export const DeleteChannelGroupsModal = ({
  channelCountMap,
  groups,
  onCancel,
  onConfirm,
}) => (
  <Modal
    open={groups.length > 0}
    onCancel={onCancel}
    title={groups.length > 1 ? "Delete Groups" : "Delete Group"}
    width={420}
    footer={(
      <div style={{ ...S.flexStart, gap: 8, justifyContent: "flex-end" }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" danger onClick={onConfirm}>
          Delete
        </Button>
      </div>
    )}
  >
    {groups.length > 0 && (
      <div>
        <div style={{ marginBottom: 12 }}>
          {groups.length > 1 ? (
            <>Are you sure you want to delete <strong>{groups.length} groups</strong>?</>
          ) : (
            <>Are you sure you want to delete <strong>"{groups[0].name}"</strong>?</>
          )}
        </div>
        {groups.some((group) => channelCountMap[group.name] > 0) && (
          <div style={{ background: T.colorWarningBg, border: `1px solid ${T.colorWarningBorder}`, borderRadius: T.borderRadius, padding: "8px 12px", fontSize: T.fontSizeSM, color: T.colorTextBase }}>
            {groups.length > 1 ? (
              <>Some selected groups still have assigned channels. Those channel memberships will be removed.</>
            ) : (
              <>This group has <strong>{channelCountMap[groups[0].name]}</strong> channel{channelCountMap[groups[0].name] > 1 ? "s" : ""} assigned. This group will be removed from those channels.</>
            )}
          </div>
        )}
      </div>
    )}
  </Modal>
);
