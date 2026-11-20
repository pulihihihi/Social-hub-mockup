import { useMemo, useState } from 'react';
import {
  Avatar,
  Button,
  Checkbox,
  Input,
  Modal,
  Popover,
  Select,
  Typography,
} from 'antd';
import {
  CopyOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FacebookFilled,
  FilterOutlined,
  GiftOutlined,
  InfoCircleOutlined,
  MessageOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import AdminPageLayout from '../../components/AdminPageLayout';
import {
  BOTS,
  BOT_CHANNELS,
  TEMPLATES,
} from './botData';
import { filterItemsByChannelIds } from '../../data/channelManagement';
import { useChannelGroup } from '../../app/providers/useChannelGroup';
import { BuilderOverlay } from './BotsBuilder';
import './Bots.css';

const { Text, Title } = Typography;

function NetworkIcon({ network }) {
  if (network === 'facebook') {
    return <FacebookFilled className="bots-network-icon is-facebook" />;
  }

  return <MessageOutlined className="bots-network-icon is-instagram" />;
}

function FilterCell({ title, summary, children }) {
  return (
    <Popover trigger="click" placement="bottomLeft" content={children} overlayClassName="bots-filter-popover">
      <Button type="text" className="bots-filter-cell">
        <span className="bots-filter-cell-inner">
          <span className="bots-filter-cell-copy">
            <Text className="bots-filter-cell-title">{title}</Text>
            <Text className="bots-filter-cell-summary">{summary}</Text>
          </span>
          <DownOutlined className="bots-filter-cell-chevron" />
        </span>
      </Button>
    </Popover>
  );
}

function ChannelsFilter({ channels }) {
  return (
    <div className="bots-popover">
      <div className="bots-popover-title">Channels</div>
      <div className="bots-channel-options">
        <Checkbox defaultChecked>All Channels</Checkbox>
        {channels.map((channel) => (
          <Checkbox key={channel.id} defaultChecked>
            <span className="bots-channel-option">
              <NetworkIcon network={channel.network} />
              <span>
                <Text>{channel.name}</Text>
                <Text type="secondary">{channel.handle}</Text>
              </span>
            </span>
          </Checkbox>
        ))}
      </div>
    </div>
  );
}

function StatusFilter() {
  return (
    <div className="bots-popover is-status">
      <div className="bots-popover-title">Status</div>
      <Checkbox defaultChecked>Online</Checkbox>
      <Checkbox defaultChecked>Offline</Checkbox>
    </div>
  );
}

function HeaderControls({ setFiltersVisible, searchValue, setSearchValue }) {
  return (
    <div className="bots-header-controls">
      <Button
        type="primary"
        icon={<FilterOutlined />}
        className="bots-filter-toggle"
        onClick={() => setFiltersVisible((visible) => !visible)}
      >
        Filters
      </Button>
      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder="Search by bot name"
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        className="bots-search"
      />
    </div>
  );
}

function FilterBar({ visible, channels }) {
  if (!visible) {
    return null;
  }

  return (
    <div className="bots-filterbar" aria-label="Bot filters">
      <FilterCell title="Channels" summary="Viewing all">
        <ChannelsFilter channels={channels} />
      </FilterCell>
      <FilterCell title="Status" summary="Viewing all">
        <StatusFilter />
      </FilterCell>
      <div className="bots-filter-reset">
        <Button type="link">Reset</Button>
      </div>
    </div>
  );
}

function TemplateIcon({ template }) {
  return (
    <span className={`bots-template-icon is-${template.tone}`} aria-hidden="true">
      {template.icon}
      <i />
      <i />
      <i />
    </span>
  );
}

function TemplateCard({ template, onCustomize }) {
  return (
    <article className="bots-template-card">
      <TemplateIcon template={template} />
      <Title level={3}>{template.title}</Title>
      <Text>{template.description}</Text>
      <Button type="link" icon={<PlusOutlined />} onClick={() => onCustomize(template)}>
        Customize Bot
      </Button>
    </article>
  );
}

function TemplatesPanel({ collapsed, setCollapsed, onCustomize }) {
  return (
    <section className="bots-templates">
      <Button type="text" className="bots-section-toggle" onClick={() => setCollapsed((value) => !value)}>
        <Text strong>Bot Templates</Text>
        <DownOutlined rotate={collapsed ? 0 : 180} />
      </Button>
      {collapsed ? null : (
        <div className="bots-template-body">
          <div className="bots-template-intro">
            <div className="bots-template-intro-icon" aria-hidden="true">
              <GiftOutlined />
            </div>
            <Text>Create a bot from scratch or use a template to help you get started.</Text>
          </div>
          <div className="bots-template-grid">
            {TEMPLATES.map((template) => (
              <TemplateCard key={template.key} template={template} onCustomize={onCustomize} />
            ))}
          </div>
          <div className="bots-template-note">
            <InfoCircleOutlined />
            <Text>
              Customer care, lead generation, shop, and content discovery templates are currently unavailable for
              Instagram and WhatsApp bots.
            </Text>
          </div>
        </div>
      )}
    </section>
  );
}

function BotMenu({ bot, onAction }) {
  return (
    <div className="bots-card-menu">
      <Button type="text" icon={<EditOutlined />} onClick={() => onAction('edit', bot)}>Edit</Button>
      <Button type="text" icon={<CopyOutlined />} onClick={() => onAction('duplicate', bot)}>Duplicate</Button>
      <Button type="text" icon={<DeleteOutlined />} danger onClick={() => onAction('delete', bot)}>Delete</Button>
      <Button type="text" icon={<ShareAltOutlined />} onClick={() => onAction('share', bot)}>Share Preview</Button>
    </div>
  );
}

function BotCard({ bot, onOpenBuilder, onMenuAction }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuAction = (action, selectedBot) => {
    setMenuOpen(false);
    onMenuAction(action, selectedBot);
  };

  return (
    <article className="bots-card">
      <div className="bots-card-media">
        <Avatar size={58} className="bots-card-avatar">TG</Avatar>
      </div>
      <div className="bots-card-content">
        <Button type="link" className="bots-card-title" onClick={onOpenBuilder}>
          {bot.name}
        </Button>
        <div className="bots-card-channel">
          <NetworkIcon network={bot.network} />
          <Text>{bot.channel}</Text>
        </div>
      </div>
      <div className="bots-card-footer">
        <div>
          <Text strong className="bots-status">
            <span />
            {bot.status}
          </Text>
          <Text type="secondary">Saved {bot.savedAt}</Text>
        </div>
        <Popover
          trigger="click"
          placement="topRight"
          open={menuOpen}
          onOpenChange={setMenuOpen}
          content={<BotMenu bot={bot} onAction={handleMenuAction} />}
          overlayClassName="bots-card-menu-popover"
        >
          <Button type="text" icon={<MoreOutlined />} aria-label={`Open menu for ${bot.name}`} />
        </Popover>
      </div>
    </article>
  );
}

function AssignChatbotModal({ template, open, onClose, channels }) {
  const supportsInstagram = template?.key === 'blank';
  const isBlank = template?.key === 'blank';

  return (
    <Modal
      centered
      open={open}
      width={800}
      title="Assign Chatbot"
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="save" type="primary" disabled={!template || isBlank}>
          Save
        </Button>,
      ]}
    >
      <div className="bots-assign-modal">
        <Text>The chatbot will respond to customers from this channel.</Text>
        <Title level={4}>Choose a Channel</Title>
        {channels
          .filter((channel) => supportsInstagram || channel.network !== 'instagram')
          .map((channel) => (
            <Button key={channel.id} type="text" className="bots-assign-channel">
              <NetworkIcon network={channel.network} />
              <span>
                <Text strong>{channel.name}</Text>
                <Text type="secondary">{channel.handle}</Text>
              </span>
            </Button>
          ))}
      </div>
    </Modal>
  );
}

function DeleteBotModal({ bot, open, onClose }) {
  return (
    <Modal
      centered
      open={open}
      width={600}
      title={`Are you sure you want to delete ${bot?.name || 'this bot'}?`}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="delete" danger type="primary" onClick={onClose}>Delete</Button>,
      ]}
    >
      <Text>
        All message and avatar configurations for this chatbot will be permanently lost. Remember, you can disable
        the chatbot without deleting.
      </Text>
    </Modal>
  );
}

function SharePreviewModal({ open, onClose }) {
  return (
    <Modal
      centered
      open={open}
      width={800}
      title="Shareable Links"
      footer={null}
      onCancel={onClose}
      className="bots-share-modal"
    >
      <div className="bots-share-empty">
        <div className="bots-share-illustration" aria-hidden="true">
          <div />
          <span />
          <span />
          <i />
        </div>
        <Title level={3}>No Share Links</Title>
        <Text type="secondary">Create a link to share with your team or clients.</Text>
        <Button type="primary">Create Link</Button>
      </div>
    </Modal>
  );
}

export default function BotsPage() {
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [templatesCollapsed, setTemplatesCollapsed] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState('LAST_MODIFIED');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [deleteBot, setDeleteBot] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const { activeChannelIds } = useChannelGroup();
  const visibleBotChannels = useMemo(
    () => filterItemsByChannelIds(BOT_CHANNELS, activeChannelIds),
    [activeChannelIds],
  );

  const bots = useMemo(() => (
    filterItemsByChannelIds(BOTS, activeChannelIds)
      .filter((bot) => bot.name.toLowerCase().includes(searchValue.trim().toLowerCase()))
  ), [activeChannelIds, searchValue]);

  const handleMenuAction = (action, bot) => {
    if (action === 'edit') {
      setBuilderOpen(true);
      return;
    }

    if (action === 'duplicate') {
      setSelectedTemplate({ key: 'duplicate', title: 'Duplicate' });
      return;
    }

    if (action === 'delete') {
      setDeleteBot(bot);
      return;
    }

    if (action === 'share') {
      setShareOpen(true);
    }
  };

  return (
    <AdminPageLayout
      title="Bots"
      headerExtra={(
        <HeaderControls
          filtersVisible={filtersVisible}
          setFiltersVisible={setFiltersVisible}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      )}
      maxWidth="none"
      contentPadding="0 0 24px"
    >
      <div className="bots-page">
        <FilterBar visible={filtersVisible} channels={visibleBotChannels} />
        <TemplatesPanel
          collapsed={templatesCollapsed}
          setCollapsed={setTemplatesCollapsed}
          onCustomize={setSelectedTemplate}
        />
        <div className="bots-list-header">
          <span />
          <label>
            <Text strong>Sort by</Text>
            <Select
              value={sortValue}
              onChange={setSortValue}
              options={[
                { label: 'Last Modified', value: 'LAST_MODIFIED' },
                { label: 'Bot Name', value: 'BOT_NAME' },
              ]}
            />
          </label>
        </div>
        <section className="bots-grid" aria-label="Bots list">
          {bots.map((bot) => (
            <BotCard
              key={bot.id}
              bot={bot}
              onOpenBuilder={() => setBuilderOpen(true)}
              onMenuAction={handleMenuAction}
            />
          ))}
          {bots.length === 0 ? (
            <div className="bots-empty">
              <SearchOutlined />
              <Title level={3}>No bots found</Title>
              <Text>Try another bot name or reset your filters.</Text>
            </div>
          ) : null}
        </section>
      </div>
      <AssignChatbotModal
        template={selectedTemplate}
        open={Boolean(selectedTemplate)}
        channels={visibleBotChannels}
        onClose={() => setSelectedTemplate(null)}
      />
      <BuilderOverlay open={builderOpen} onClose={() => setBuilderOpen(false)} />
      <DeleteBotModal bot={deleteBot} open={Boolean(deleteBot)} onClose={() => setDeleteBot(null)} />
      <SharePreviewModal open={shareOpen} onClose={() => setShareOpen(false)} />
    </AdminPageLayout>
  );
}
