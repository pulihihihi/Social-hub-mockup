import { Button, Input, Switch, Tooltip, Typography } from 'antd';
import { KeyOutlined, PlusOutlined, QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';

const { Text } = Typography;

function SettingsToggleRow({ title, description, checked, label, onChange }) {
  return (
    <div className="bots-settings-toggle-row">
      <div>
        <Text strong>{title}</Text>
        <Text>{description}</Text>
      </div>
      <div className="bots-settings-toggle-control">
        <Switch checked={checked} onChange={onChange} />
        <Text strong>{label}</Text>
      </div>
    </div>
  );
}

export default function BuilderSettingsPanel({ settings, setSettings, onOpenPreview, onOpenKeywords, onOpenHelp }) {
  const updateSetting = (key, value) => setSettings((current) => ({ ...current, [key]: value, saved: false }));

  return (
    <main className="bots-builder-settings">
      <div className="bots-settings-grid">
        <div className="bots-settings-left">
          <section className="bots-settings-card">
            <label>
              <Text strong>Edit Chatbot Name</Text>
              <Text>This is an internal name that is only available to you and your team in Sprout.</Text>
              <Input value={settings.name} onChange={(event) => updateSetting('name', event.target.value)} />
            </label>
            <label>
              <Text strong>Edit Chatbot Description</Text>
              <Text>This is an internal description that is only available to you and your team in Sprout.</Text>
              <Input
                placeholder="Enter Chatbot Description"
                value={settings.description}
                onChange={(event) => updateSetting('description', event.target.value)}
              />
            </label>
          </section>

          <section className="bots-settings-card">
            <label>
              <Text strong>Add a Restart Button <Text type="secondary">(Optional)</Text></Text>
              <Text>
                This is a button in the Persistent Menu that allows a user to restart the chatbot flow from the
                beginning.
              </Text>
              <Input
                value={settings.restartCommand}
                onChange={(event) => updateSetting('restartCommand', event.target.value)}
              />
            </label>
            <SettingsToggleRow
              title="Disable Free Text Replies (not recommended)"
              description="When enabled, the user's text input is removed, and they can only interact with the chatbot using quick reply buttons. This setting requires a restart button."
              checked={settings.disableFreeText}
              label={settings.disableFreeText ? 'Turn Off' : 'Turn On'}
              onChange={(checked) => updateSetting('disableFreeText', checked)}
            />
          </section>

          <section className="bots-settings-card">
            <SettingsToggleRow
              title="Automatically complete chatbot messages in the Smart Inbox"
              description="Only unique messages from users will appear in the Smart Inbox as needing completion. Messages resulting from Quick Reply clicks and Keyword Commands will be auto-completed."
              checked={settings.autoCompleteSmartInbox}
              label={settings.autoCompleteSmartInbox ? 'Turn Off' : 'Turn On'}
              onChange={(checked) => updateSetting('autoCompleteSmartInbox', checked)}
            />
            <SettingsToggleRow
              title="Enable Typing Indicators"
              description="Typing indicators appear before chatbot messages are sent."
              checked={settings.typingIndicators}
              label={settings.typingIndicators ? 'Turn Off' : 'Turn On'}
              onChange={(checked) => updateSetting('typingIndicators', checked)}
            />
          </section>
        </div>

        <section className="bots-settings-card bots-payload-card">
          <Text strong>Bot Payload</Text>
          <Text>
            Use this payload to connect your chatbot to Buttons in <a href="https://www.facebook.com/business/ads/click-to-messenger" target="_blank" rel="noreferrer">Facebook Click-to-Messenger Ads</a>
          </Text>
          <div className="bots-payload-copy">
            <Input value={settings.online ? 'fb-bot-payload-test-7f31' : ''} disabled />
            <Button disabled={!settings.online}>Copy ID</Button>
          </div>
          {settings.online ? (
            <Text type="secondary">Use this ID in your ad setup to send people into this bot flow.</Text>
          ) : (
            <Text type="danger" strong>Bot must be turned on to copy id.</Text>
          )}
        </section>
      </div>
      <aside className="bots-builder-rail">
        <Tooltip title="Preview"><Button shape="circle" icon={<SearchOutlined />} onClick={onOpenPreview} /></Tooltip>
        <Tooltip title="Keyword commands"><Button shape="circle" icon={<KeyOutlined />} onClick={onOpenKeywords} /></Tooltip>
        <Tooltip title="Help resources"><Button shape="circle" icon={<QuestionCircleOutlined />} onClick={onOpenHelp} /></Tooltip>
      </aside>
      <div className="bots-builder-zoom">
        <Button type="text" icon={<PlusOutlined />} />
        <span />
        <Button type="text">-</Button>
      </div>
    </main>
  );
}
