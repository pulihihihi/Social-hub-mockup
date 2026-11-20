import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Input, Space, Tag, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { SparkleIco } from '../../components/icons';

const { Paragraph, Text } = Typography;
const { TextArea } = Input;

const STATUS_COLORS = {
  applied: 'success',
  generated: 'blue',
  'needs-setup': 'orange',
  'needs-review': 'orange',
  pending: 'default',
  generating: 'processing',
  skipped: 'default',
};

const unique = (values = []) => Array.from(new Set(values.filter(Boolean)));

const statusLabel = (status) => {
  switch (status) {
    case 'needs-review':
      return 'Ready';
    case 'needs-setup':
      return 'Needs setup';
    case 'applied':
      return 'Applied';
    default:
      return String(status || 'generated')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }
};

const buildPreviewSnippet = (value = '') => (
  String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .find(Boolean)
  || 'Ready to review'
);

const ResultCard = ({
  result,
  onApply,
  onRegenerate,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [draftMessage, setDraftMessage] = useState('');
  const canRefine = result.status !== 'needs-setup';
  const previewSnippet = buildPreviewSnippet(result.preview);

  const handleRefine = () => {
    const nextPrompt = draftMessage.trim();

    if (!nextPrompt) {
      return;
    }

    onRegenerate(result.key, nextPrompt);
    setDraftMessage('');
    setExpanded(true);
  };

  return (
    <article className="publishing-new-post-ai-result-card">
      <div className="publishing-new-post-ai-result-summary-row">
        <div className="publishing-new-post-ai-result-summary-copy">
          <Text strong>{result.label}</Text>
          <Text type="secondary">{previewSnippet}</Text>
        </div>
        <div className="publishing-new-post-ai-result-summary-actions">
          <Tag color={STATUS_COLORS[result.status] || 'default'}>{statusLabel(result.status)}</Tag>
          <Button type="text" onClick={() => setExpanded((current) => !current)}>
            {expanded ? 'Hide' : 'Open'}
          </Button>
        </div>
      </div>
      {expanded ? (
        <div className="publishing-new-post-ai-result-body">
          {result.patchSummary ? (
            <Text type="secondary" className="publishing-new-post-ai-result-summary">{result.patchSummary}</Text>
          ) : null}
          <pre className="publishing-new-post-ai-result-preview">{result.preview}</pre>
          {result.warnings?.length ? (
            <div className="publishing-new-post-ai-result-warnings">
              {result.warnings.map((warning) => (
                <Alert key={warning} type="warning" showIcon description={warning} />
              ))}
            </div>
          ) : null}
          {canRefine ? (
            <div className="publishing-new-post-ai-result-chat">
              <TextArea
                autoSize={{ minRows: 1, maxRows: 3 }}
                value={draftMessage}
                placeholder={`Tell AI what to change for ${result.label.toLowerCase()}`}
                onChange={(event) => setDraftMessage(event.target.value)}
              />
              <div className="publishing-new-post-ai-result-actions">
                {result.patch ? (
                  <Button
                    type="primary"
                    disabled={result.status === 'applied'}
                    onClick={() => onApply(result.key)}
                  >
                    {result.status === 'applied' ? 'Already used' : 'Use this'}
                  </Button>
                ) : null}
                <Button onClick={() => onRegenerate(result.key)}>Try another version</Button>
                <Button disabled={!draftMessage.trim()} onClick={handleRefine}>Send</Button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
};

const SectionPicker = ({
  expanded,
  groups,
  needsSetupCount = 0,
  onSelectionChange,
  onToggle,
  selectedSectionKeys,
}) => {
  const selectedKeys = new Set(selectedSectionKeys);
  const selectedSummary = selectedSectionKeys.length === groups.flatMap((group) => group.sections).length
    ? 'All tasks selected'
    : `${selectedSectionKeys.length} tasks selected`;

  const toggleSection = (sectionKey, checked) => {
    const nextSelection = checked
      ? unique([...selectedSectionKeys, sectionKey])
      : selectedSectionKeys.filter((value) => value !== sectionKey);

    onSelectionChange(nextSelection);
  };

  const selectAll = () => {
    onSelectionChange(groups.flatMap((group) => group.sections.map((section) => section.key)));
  };

  return (
    <div className="publishing-new-post-ai-picker-inline">
      <button type="button" className="publishing-new-post-ai-picker-toggle" onClick={onToggle}>
        <span className="publishing-new-post-ai-picker-copy">
          <Text strong>AI will help with</Text>
          <Text type="secondary">{selectedSummary}</Text>
        </span>
        <Space size={6}>
          {needsSetupCount ? <Tag color="orange">{`${needsSetupCount} setup needed`}</Tag> : null}
          <span className="publishing-new-post-ai-picker-icon" aria-hidden="true">
            {expanded ? <UpOutlined /> : <DownOutlined />}
          </span>
        </Space>
      </button>
      {expanded ? (
        <div className="publishing-new-post-ai-picker-body">
          <div className="publishing-new-post-ai-picker-tools">
            <Button type="link" onClick={selectAll}>Select all</Button>
          </div>
          {groups.map((group) => (
            <div key={group.key} className="publishing-new-post-ai-picker-group">
              <Text strong>{group.label}</Text>
              <div className="publishing-new-post-ai-picker-list">
                {group.sections.map((section) => (
                  <label key={section.key} className="publishing-new-post-ai-picker-item">
                    <Checkbox
                      checked={selectedKeys.has(section.key)}
                      onChange={(event) => toggleSection(section.key, event.target.checked)}
                    />
                    <span className="publishing-new-post-ai-picker-item-copy">
                      <Text>{section.label}</Text>
                      {section.setupWarnings?.length ? (
                        <Text type="secondary">{section.setupWarnings[0]}</Text>
                      ) : null}
                    </span>
                    {!section.hasRequiredAssets ? <Tag color="orange">Setup needed</Tag> : null}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export const AiAssistPanel = ({
  busy = false,
  hasMedia = false,
  onApplyAll,
  onApplyResult,
  onApplySelected,
  onClearSession,
  onRegenerateSection,
  onRunAssist,
  onSelectionChange,
  results = [],
  sections = [],
  selectedSectionKeys = [],
}) => {
  const [pickerExpanded, setPickerExpanded] = useState(false);
  const visibleSections = useMemo(
    () => sections.filter((section) => section.isRelevant !== false),
    [sections],
  );
  const groupedSections = useMemo(
    () => visibleSections.reduce((groups, section) => {
      const groupKey = section.groupKey || 'other';
      const existing = groups.find((item) => item.key === groupKey);

      if (existing) {
        existing.sections.push(section);
        return groups;
      }

      groups.push({
        key: groupKey,
        label: section.group?.label || 'Other',
        sections: [section],
      });
      return groups;
    }, []),
    [visibleSections],
  );
  const groupedResults = useMemo(
    () => results.reduce((groups, result) => {
      const groupKey = result.groupKey || 'other';
      const existing = groups.find((item) => item.key === groupKey);

      if (existing) {
        existing.results.push(result);
        return groups;
      }

      groups.push({
        key: groupKey,
        label: result.group?.label || 'Results',
        results: [result],
      });
      return groups;
    }, []),
    [results],
  );
  const selectedResultKeys = useMemo(
    () => results
      .filter((result) => selectedSectionKeys.includes(result.key) && result.patch && result.status !== 'applied')
      .map((result) => result.key),
    [results, selectedSectionKeys],
  );
  const pendingResultKeys = useMemo(
    () => results
      .filter((result) => result.patch && result.status !== 'applied')
      .map((result) => result.key),
    [results],
  );
  const selectedNeedsSetupCount = useMemo(
    () => visibleSections.filter((section) => selectedSectionKeys.includes(section.key) && !section.hasRequiredAssets).length,
    [selectedSectionKeys, visibleSections],
  );

  return (
    <div className="publishing-new-post-ai-panel">
      <div className="publishing-new-post-ai-rail">
        <div className="publishing-new-post-ai-toolbar">
          <div className="publishing-new-post-ai-toolbar-status">
            <Text strong>AI Assist</Text>
          </div>
          <div className="publishing-new-post-ai-toolbar-actions">
            <Button
              type="primary"
              disabled={!hasMedia || !selectedSectionKeys.length || busy}
              icon={<SparkleIco s={14} color="#fff" />}
              onClick={() => onRunAssist(selectedSectionKeys)}
            >
              Generate with AI
            </Button>
            <Button
              disabled={!hasMedia || !selectedSectionKeys.length || busy}
              onClick={() => onRunAssist(selectedSectionKeys)}
            >
              Regenerate
            </Button>
            <Button disabled={!selectedResultKeys.length || busy} onClick={onApplySelected}>
              Apply selected
            </Button>
            <Button disabled={!pendingResultKeys.length || busy} onClick={onApplyAll}>
              Apply all
            </Button>
            <Button onClick={onClearSession}>Reset</Button>
          </div>
        </div>
        <div className="publishing-new-post-ai-rail-meta">
          <Space size={[6, 6]} wrap>
            <Tag color={hasMedia ? 'success' : 'default'}>
              {hasMedia ? 'Creative ready' : 'Creative required'}
            </Tag>
            <Tag>{selectedSectionKeys.length === visibleSections.length ? 'All selected' : `${selectedSectionKeys.length} selected`}</Tag>
          </Space>
          <SectionPicker
            expanded={pickerExpanded}
            groups={groupedSections}
            needsSetupCount={selectedNeedsSetupCount}
            onSelectionChange={onSelectionChange}
            onToggle={() => setPickerExpanded((current) => !current)}
            selectedSectionKeys={selectedSectionKeys}
          />
        </div>
      </div>

      <div className="publishing-new-post-ai-results">
        {!results.length ? (
          <div className="publishing-new-post-ai-results-empty">
            <div className="publishing-new-post-ai-results-empty-icon">
              <SparkleIco s={18} color="#1677ff" />
            </div>
            <Paragraph type="secondary" className="publishing-new-post-ai-results-placeholder">
              {hasMedia ? 'Generate to start' : 'Upload creative to start'}
            </Paragraph>
          </div>
        ) : (
          groupedResults.map((group) => (
            <section key={group.key} className="publishing-new-post-ai-result-group">
              <div className="publishing-new-post-ai-result-group-head">
                <Text strong>{group.label}</Text>
              </div>
              <div className="publishing-new-post-ai-result-group-list">
                {group.results.map((result) => (
                  <ResultCard
                    key={result.key}
                    result={result}
                    onApply={onApplyResult}
                    onRegenerate={onRegenerateSection}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
};

export default AiAssistPanel;
