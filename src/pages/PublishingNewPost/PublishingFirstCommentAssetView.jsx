import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Button,
  Input,
  Select,
  Typography,
} from 'antd';
import { FontColorsOutlined } from '@ant-design/icons';
import { useManagedTagCollections } from '../../data/tagManagementStore';
import {
  flattenOptionGroups,
  getPublishingTagFilterGroups,
} from '../../data/publishingTaxonomy';

const { Text } = Typography;

const ASSET_CONTEXT_OPTIONS = [
  { label: 'Compose', value: 'compose' },
  { label: 'Reply', value: 'reply' },
  { label: 'Both Compose and Reply', value: 'both' },
];

export function FirstCommentAssetAddView({
  initialText,
  onAddAsset,
  onBack,
}) {
  const [assetTitle, setAssetTitle] = useState('');
  const [assetText, setAssetText] = useState(initialText);
  const [context, setContext] = useState('compose');
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagCollections] = useManagedTagCollections();
  const tagOptions = useMemo(
    () => flattenOptionGroups(getPublishingTagFilterGroups(tagCollections)),
    [tagCollections],
  );
  const titleRemaining = Math.max(100 - assetTitle.length, 0);
  const canAddAsset = Boolean(assetTitle.trim() && assetText.trim());

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onBack]);

  return (
    <div className="publishing-new-post-asset-add-page">
      <main className="publishing-new-post-asset-add-main">
        <section className="publishing-new-post-asset-add-card">
          <label htmlFor="new-post-asset-title">Asset Title</label>
          <Input
            id="new-post-asset-title"
            value={assetTitle}
            maxLength={100}
            onChange={(event) => setAssetTitle(event.target.value)}
            placeholder="Enter Title"
            suffix={<Text type="secondary">{titleRemaining}</Text>}
          />

          <label htmlFor="new-post-asset-text">Asset Text</label>
          <Input.TextArea
            id="new-post-asset-text"
            value={assetText}
            onChange={(event) => setAssetText(event.target.value)}
            autoSize={{ minRows: 4, maxRows: 8 }}
          />
        </section>
      </main>

      <aside className="publishing-new-post-asset-add-side">
        <Button
          type="primary"
          size="large"
          disabled={!canAddAsset}
          onClick={() => onAddAsset({
            context,
            tags: selectedTags,
            text: assetText,
            title: assetTitle,
          })}
        >
          Add Asset
        </Button>

        <label htmlFor="new-post-asset-context">Context</label>
        <Select
          id="new-post-asset-context"
          aria-label="Asset context"
          value={context}
          onChange={setContext}
          options={ASSET_CONTEXT_OPTIONS}
        />

        <label htmlFor="new-post-asset-tags">Tags</label>
        <Select
          id="new-post-asset-tags"
          aria-label="Asset tags"
          mode="multiple"
          maxTagCount="responsive"
          placeholder="Please select Tags..."
          value={selectedTags}
          onChange={setSelectedTags}
          options={tagOptions}
        />

        <Text strong>Created</Text>
        <div className="publishing-new-post-asset-created">
          <Avatar size={28} className="publishing-new-post-asset-created-avatar">HT</Avatar>
          <span>Hai-Son Tran on 9 May 2026</span>
        </div>

        <Text strong>Asset details</Text>
        <div className="publishing-new-post-asset-detail-line">
          <FontColorsOutlined />
          <span>Text</span>
        </div>
      </aside>
    </div>
  );
}
