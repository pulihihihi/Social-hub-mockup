import { Avatar, Button, Modal, Switch, Tabs, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import BuilderCanvas from './BuilderCanvas';
import BuilderSettingsPanel from './BuilderSettingsPanel';
import {
  ContentTypeModal,
  EditNodeModal,
  HelpPanel,
  KeywordCommandsPanel,
  PreviewPanel,
} from './BotBuilderModals';
import { useBotBuilderModel } from './useBotBuilderModel';

const { Text, Title } = Typography;

export function BuilderOverlay({ open, onClose }) {
  const model = useBotBuilderModel({ onClose });

  return (
    <Modal
      open={open}
      width="calc(100vw - 136px)"
      style={{ top: 0, maxWidth: 'none' }}
      styles={{ body: { padding: 0 } }}
      footer={null}
      closable={false}
      onCancel={onClose}
      className="bots-builder-modal"
    >
      <div className="bots-builder">
        <header className="bots-builder-header">
          <div>
            <Title level={2}>Configure Chatbot for test</Title>
            <Text type="secondary">esc to go back</Text>
          </div>
          <Button icon={<CloseOutlined />} onClick={onClose}>Close</Button>
        </header>
        <section className="bots-builder-channel">
          <Avatar size={42} className="bots-card-avatar">TG</Avatar>
          <div>
            <Text strong>Garena Delta Force (VN - Vietnamese)</Text>
            <Text type="secondary">GarenaDeltaForceVN</Text>
          </div>
          <Tabs
            activeKey={model.activeTab}
            onChange={model.setActiveTab}
            items={[
              { key: 'builder', label: 'Builder' },
              { key: 'settings', label: 'Settings' },
            ]}
          />
          <div className="bots-builder-actions">
            <Text type={model.settings.saved ? 'success' : 'secondary'}>{model.settings.saved ? 'Saved' : 'Unsaved'}</Text>
            <Switch checked={model.settings.online} onChange={model.setOnline} />
            <Text strong>{model.settings.online ? 'Online' : 'Offline'}</Text>
            <Button type="primary" onClick={model.handleFinish}>Finish</Button>
          </div>
        </section>
        {model.activeTab === 'settings' ? (
          <BuilderSettingsPanel
            settings={model.settings}
            setSettings={model.setSettings}
            onOpenPreview={() => model.setPreviewOpen(true)}
            onOpenKeywords={() => model.setKeywordsOpen(true)}
            onOpenHelp={() => model.setHelpOpen(true)}
          />
        ) : (
          <BuilderCanvas
            welcomeMessages={model.welcomeMessages}
            quickReplies={model.quickReplies}
            onAdd={model.setContentContext}
            onEdit={model.openEditNode}
            onDuplicate={model.duplicateNode}
            onDelete={model.deleteNode}
            onOpenPreview={() => model.setPreviewOpen(true)}
            onOpenKeywords={() => model.setKeywordsOpen(true)}
            onOpenHelp={() => model.setHelpOpen(true)}
          />
        )}
        <ContentTypeModal
          open={Boolean(model.contentContext)}
          context={model.contentContext}
          onSelect={model.addContent}
          onClose={() => model.setContentContext(null)}
        />
        <EditNodeModal
          open={Boolean(model.editNode)}
          node={model.editNode}
          onSave={model.saveNode}
          onClose={() => model.setEditNode(null)}
        />
        <PreviewPanel
          open={model.previewOpen}
          onClose={() => model.setPreviewOpen(false)}
          welcomeMessages={model.welcomeMessages}
          quickReplies={model.quickReplies}
          settings={model.settings}
        />
        <KeywordCommandsPanel
          open={model.keywordsOpen}
          onClose={() => model.setKeywordsOpen(false)}
          commands={model.commands}
          setCommands={model.setCommands}
          quickReplies={model.quickReplies}
        />
        <HelpPanel open={model.helpOpen} onClose={() => model.setHelpOpen(false)} />
      </div>
    </Modal>
  );
}
