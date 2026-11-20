import { Form, Input, Select } from "antd";
import { CHANNEL_TERMINOLOGY } from "../../data/channelManagement";
import { USER_ROLES_OPTIONS } from "../../data/userManagement";
import { GrantedChannelPreview } from "./SystemAccessCells";

const SystemUserModalFields = ({
  channelGroups,
  channelGroupOptions,
  channelOptions,
  watchedChannelGroupIds,
  watchedChannelIds,
}) => (
  <>
    <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter name" }]}>
      <Input placeholder="Full name" />
    </Form.Item>
    <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter email" }, { type: "email", message: "Invalid email" }]}>
      <Input placeholder="email@garena.vn" />
    </Form.Item>
    <Form.Item label="Role" name="role" initialValue="Viewer" rules={[{ required: true, message: "Please select role" }]}>
      <Select options={USER_ROLES_OPTIONS} />
    </Form.Item>
    <Form.Item label={CHANNEL_TERMINOLOGY.groupSingular} name="channelGroupIds">
      <Select
        mode="multiple"
        allowClear
        maxTagCount="responsive"
        placeholder={`Select ${CHANNEL_TERMINOLOGY.lowerGroupPlural}`}
        options={channelGroupOptions}
      />
    </Form.Item>
    <Form.Item label={CHANNEL_TERMINOLOGY.singular} name="channelIds">
      <Select
        mode="multiple"
        allowClear
        maxTagCount="responsive"
        placeholder={`Select ${CHANNEL_TERMINOLOGY.lowerPlural}`}
        options={channelOptions}
        popupMatchSelectWidth={false}
        styles={{ popup: { root: { minWidth: 320 } } }}
      />
    </Form.Item>
    <GrantedChannelPreview
      channelGroupIds={watchedChannelGroupIds}
      channelGroups={channelGroups}
      channelIds={watchedChannelIds}
    />
  </>
);

export default SystemUserModalFields;
