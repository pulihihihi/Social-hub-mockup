import { Form } from "antd";
import {
  ProFormCheckbox,
  ProFormDigit,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { AppModalForm } from "../../app/pro/forms/AppModalForm";
import { DEFAULT_TOPIC_UPDATE_FREQUENCY, TOPIC_UPDATE_FREQUENCY_OPTIONS } from "../../domain/topic/contracts";
import { DEFAULT_RULE_VALUES, DELIVERY_CHANNELS } from "./alertsData";
import { getRuleUpdateFrequency } from "./alertsUtils";

export const CreateAlertRuleModal = ({ editRule, onClose, onSave, open, topicFrequencyLookup, topicOptions }) => {
  const [form] = Form.useForm();
  const initialValues = editRule
    ? {
        ...DEFAULT_RULE_VALUES,
        ...editRule,
        updateFrequency: getRuleUpdateFrequency(editRule, topicFrequencyLookup),
        recipients: Array.isArray(editRule.recipients) ? editRule.recipients : [],
      }
    : DEFAULT_RULE_VALUES;

  return (
    <AppModalForm
      key={editRule?.id || "new-alert-rule"}
      form={form}
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      title={editRule ? "Edit Rule" : "New Rule"}
      width={560}
      initialValues={initialValues}
      submitText={editRule ? "Save Changes" : "Create Rule"}
      onFinish={async (values) => {
        const syncedUpdateFrequency =
          topicFrequencyLookup[values.topic] || values.updateFrequency || DEFAULT_TOPIC_UPDATE_FREQUENCY;

        onSave({
          ...values,
          updateFrequency: syncedUpdateFrequency,
        });
        return true;
      }}
    >
      <ProFormText
        label="Rule Name"
        name="name"
        placeholder="Brand negative surge"
        rules={[{ required: true, message: "Enter a rule name" }]}
      />
      <ProFormSelect
        label="Topic"
        name="topic"
        placeholder="Select topic"
        options={topicOptions}
        fieldProps={{
          onChange: (value) => {
            form.setFieldValue("updateFrequency", topicFrequencyLookup[value]);
          },
        }}
        rules={[{ required: true, message: "Select a topic" }]}
      />
      <ProFormGroup>
        <ProFormSelect
          label="Metric"
          name="metric"
          width="md"
          options={[
            { label: "Discussion volume", value: "volume" },
            { label: "Negative sentiment", value: "negativeSentiment" },
            { label: "Engagements", value: "engagements" },
          ]}
          rules={[{ required: true, message: "Select a metric" }]}
        />
        <ProFormSelect
          label="Direction"
          name="direction"
          width="sm"
          options={[
            { label: "Increase", value: "increase" },
            { label: "Decrease", value: "decrease" },
          ]}
          rules={[{ required: true, message: "Select a direction" }]}
        />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormDigit
          label="Threshold"
          name="thresholdValue"
          width="sm"
          min={0}
          rules={[{ required: true, message: "Enter a threshold" }]}
        />
        <ProFormSelect
          label="Type"
          name="thresholdType"
          width="sm"
          options={[
            { label: "Percent", value: "percent" },
            { label: "Absolute", value: "absolute" },
          ]}
          rules={[{ required: true, message: "Select a type" }]}
        />
        <ProFormSelect
          label="Update frequency"
          name="updateFrequency"
          width="sm"
          options={TOPIC_UPDATE_FREQUENCY_OPTIONS}
          disabled
          extra="Inherited from the selected topic."
          rules={[{ required: true, message: "Select a topic to inherit its update frequency" }]}
        />
      </ProFormGroup>
      <ProFormCheckbox.Group
        label="Delivery"
        name="channels"
        options={DELIVERY_CHANNELS.map((channel) => ({
          label: channel.label,
          value: channel.key,
        }))}
        rules={[{ required: true, message: "Select at least one channel" }]}
      />
      <ProFormSelect
        label="Recipients"
        name="recipients"
        placeholder="Add email recipients"
        fieldProps={{
          mode: "tags",
          tokenSeparators: [",", " "],
          maxTagCount: "responsive",
        }}
      />
    </AppModalForm>
  );
};
