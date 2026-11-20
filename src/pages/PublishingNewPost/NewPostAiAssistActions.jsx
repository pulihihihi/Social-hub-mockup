import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Empty, Popover, Segmented, Space, Tag, Typography } from 'antd';
import { ExternalLinkIco, MoreIco, SparkleIco } from '../../components/icons';
import { useAiAssetStore } from '../../features/ai-assets/aiAssetStoreHooks';
import { buildAiSkillDetailRoute, buildAiSkillRoute } from '../../features/ai-assist/aiSkillRoutes';
import { getNewPostAiAssetsForSections } from '../../features/ai-assist/newPostAiCatalog';
import { C, T } from '../../theme';

const { Paragraph, Text } = Typography;

const formatLabel = (value = '') => (
  String(value || '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
);

const formatDateLabel = (value) => {
  if (!value) {
    return 'Not dated';
  }

  return value;
};

const buildAssetMeta = (asset, assetType) => {
  if (assetType === 'knowledge') {
    const linkedSkillCount = asset.linkedSkills?.length || 0;
    return linkedSkillCount ? `${asset.category} | ${linkedSkillCount} linked skills` : asset.category;
  }

  const linkedKnowledgeCount = asset.linkedKnowledge?.length || 0;
  return linkedKnowledgeCount ? `${asset.category} | ${linkedKnowledgeCount} linked knowledge` : asset.category;
};

const buildAssetRoute = ({ activeTab, asset, assetType }) => buildAiSkillDetailRoute({
  detailId: asset.id,
  detailType: assetType,
  originTab: activeTab,
  sourceKind: asset.source === 'marketplace' ? 'marketplace' : 'local',
  tab: activeTab,
});

const AiConfigList = ({
  activeTab,
  assetType,
  items,
  onOpen,
}) => {
  if (!items.length) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={`No active ${assetType === 'knowledge' ? 'knowledge packs' : 'skills'} are linked to this section.`}
      />
    );
  }

  return (
    <div className="publishing-new-post-ai-config-list">
      {items.map((item) => (
        <a
          key={item.id}
          href={buildAssetRoute({ activeTab, asset: item, assetType })}
          target="_blank"
          rel="noopener noreferrer"
          className="publishing-new-post-ai-config-item"
          onClick={onOpen}
        >
          <span className="publishing-new-post-ai-config-item-copy">
            <span className="publishing-new-post-ai-config-item-name">{item.name}</span>
            <span className="publishing-new-post-ai-config-item-meta">{buildAssetMeta(item, assetType)}</span>
            <span className="publishing-new-post-ai-config-item-reason">
              {item.linkedReasons?.join(' | ') || 'Used for this section'}
            </span>
            <span className="publishing-new-post-ai-config-item-tags">
              <Tag color="blue" style={{ marginInlineEnd: 0 }}>Active</Tag>
              <Tag style={{ marginInlineEnd: 0 }}>{`v${item.version || '1.0'}`}</Tag>
              <Tag style={{ marginInlineEnd: 0 }}>{formatLabel(item.verificationTier || item.status || 'configured')}</Tag>
              <Tag style={{ marginInlineEnd: 0 }}>{`Verified ${formatDateLabel(item.updatedAt || item.createdAt)}`}</Tag>
            </span>
          </span>
          <ExternalLinkIco s={12} color={C.aiBlue} />
        </a>
      ))}
    </div>
  );
};

export const NewPostAiAssistActions = ({
  configLabel = 'AI Assist',
  disabled = false,
  iconOnly = false,
  moreButtonType = 'link',
  moreAriaLabel,
  onAiAssist,
  popoverPlacement = 'bottomRight',
  primaryAriaLabel,
  primaryButtonType = 'link',
  primaryLabel = 'AI Assist',
  sectionKeys = [],
  size = 'small',
  stopPropagation = false,
}) => {
  const { knowledge, skills } = useAiAssetStore();
  const [activeTab, setActiveTab] = useState('skills');
  const [popoverOpen, setPopoverOpen] = useState(false);
  const config = useMemo(
    () => getNewPostAiAssetsForSections(sectionKeys, { knowledge, skills }),
    [knowledge, sectionKeys, skills],
  );
  const defaultTab = config.skills.length ? 'skills' : 'knowledge';
  const sectionLabels = config.sections.map((section) => section.label).join(', ');
  const setupWarnings = useMemo(
    () => config.sections.flatMap((section) => (
      section.setupWarnings?.map((warning) => `${section.label}: ${warning}`) || []
    )),
    [config.sections],
  );

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab, sectionKeys]);

  const handleStopPropagation = (event) => {
    if (stopPropagation) {
      event.stopPropagation();
    }
  };

  const handleAiAssist = (event) => {
    handleStopPropagation(event);
    onAiAssist?.();
  };

  const handlePopoverToggle = (nextOpen) => {
    setPopoverOpen(nextOpen);
  };

  const closePopover = () => {
    setPopoverOpen(false);
  };

  const primaryIconColor = disabled && (primaryButtonType === 'link' || primaryButtonType === 'text')
    ? T.colorTextDisabled
    : C.aiBlue;

  return (
    <Space size={4} className={`publishing-new-post-ai-action-group${iconOnly ? ' is-icon-only' : ''}`}>
      <Button
        type={primaryButtonType}
        size={size}
        disabled={disabled}
        icon={<SparkleIco s={14} color={primaryIconColor} />}
        aria-label={primaryAriaLabel || primaryLabel}
        onClick={handleAiAssist}
      >
        {iconOnly ? null : primaryLabel}
      </Button>
      <Popover
        trigger="click"
        placement={popoverPlacement}
        open={popoverOpen}
        onOpenChange={handlePopoverToggle}
        overlayClassName="publishing-new-post-ai-config-popover"
        content={(
          <div className="publishing-new-post-ai-config-card" onClick={handleStopPropagation}>
            <div className="publishing-new-post-ai-config-header">
              <div>
                <Text strong>AI Configuration</Text>
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  {sectionLabels || 'Active AI assets controlling this section.'}
                </Paragraph>
              </div>
            </div>
            <div className="publishing-new-post-ai-config-summary">
              <Tag color="blue">{`${config.configSummary?.activeSkillCount || 0} active skills`}</Tag>
              <Tag color="cyan">{`${config.configSummary?.activeKnowledgeCount || 0} active knowledge`}</Tag>
              {config.configSummary?.sectionsNeedingSetup ? (
                <Tag color="orange">{`${config.configSummary.sectionsNeedingSetup} need setup`}</Tag>
              ) : null}
            </div>
            {setupWarnings.length ? (
              <div className="publishing-new-post-ai-config-warnings">
                {setupWarnings.map((warning) => (
                  <Alert key={warning} type="warning" showIcon message={warning} />
                ))}
              </div>
            ) : null}
            <Segmented
              size="middle"
              className="publishing-new-post-ai-config-tabs"
              value={activeTab}
              onChange={setActiveTab}
              options={[
                { label: `My Skills (${config.skills.length})`, value: 'skills' },
                { label: `My Knowledge (${config.knowledge.length})`, value: 'knowledge' },
              ]}
            />
            <AiConfigList
              activeTab={activeTab}
              assetType={activeTab === 'skills' ? 'skill' : 'knowledge'}
              items={activeTab === 'skills' ? config.skills : config.knowledge}
              onOpen={closePopover}
            />
            <Button
              type="link"
              icon={<ExternalLinkIco s={12} color={C.aiBlue} />}
              href={buildAiSkillRoute({ tab: activeTab })}
              target="_blank"
              rel="noopener noreferrer"
              className="publishing-new-post-ai-config-open-link"
              onClick={closePopover}
            >
              Open AI Skill
            </Button>
          </div>
        )}
      >
        <Button
          type={moreButtonType}
          size={size}
          icon={<MoreIco s={14} color={C.aiBlue} />}
          aria-label={moreAriaLabel || `Open AI configuration for ${configLabel}`}
          onClick={handleStopPropagation}
        />
      </Popover>
    </Space>
  );
};

export default NewPostAiAssistActions;
