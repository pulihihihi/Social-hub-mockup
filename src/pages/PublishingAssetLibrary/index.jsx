import { useMemo, useState } from 'react';
import {
  Button,
  Checkbox,
  Dropdown,
  Input,
  Pagination,
  Select,
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd';
import {
  AppstoreOutlined,
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FilterOutlined,
  FolderOutlined,
  MessageOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  SearchOutlined,
  SendOutlined,
  TableOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import AdminPageLayout from '../../components/AdminPageLayout';
import {
  PublishingFilterBar,
  PublishingFilterCell,
} from '../../components/PublishingFilterBar';
import { getPublishingFilterSummary } from '../../components/PublishingFilterBar.utils';
import { ViewModeSegmented } from '../../components/ViewModeSegmented';
import { useManagedTagCollections } from '../../data/tagManagementStore';
import {
  flattenOptionGroups,
  getPublishingTagFilterGroups,
} from '../../data/publishingTaxonomy';
import {
  assets,
  authorOptions,
  contextOptions,
  folders,
  sortOptions,
} from './assetLibraryData';
import {
  matchesAssetFilters,
  matchesFolderFilters,
} from './assetLibraryUtils';
import './PublishingAssetLibrary.css';

const { Text, Title } = Typography;

const assetIconByType = {
  image: FileImageOutlined,
  video: VideoCameraOutlined,
  text: FileTextOutlined,
  template: AppstoreOutlined,
};

function CheckboxList({ options, value, onChange }) {
  return (
    <Checkbox.Group value={value} onChange={onChange} className="publishing-asset-checkbox-list">
      {options.map((option) => (
        <Checkbox key={option.value} value={option.value}>
          {option.label}
        </Checkbox>
      ))}
    </Checkbox.Group>
  );
}

function TagsFilter({ tagGroups, value, onChange }) {
  return (
    <div className="publishing-asset-popover">
      <div className="publishing-asset-popover-head">
        <Text strong>Tags</Text>
        <Button type="link" size="small" onClick={() => onChange([])}>
          Reset
        </Button>
      </div>
      <Input size="small" prefix={<SearchOutlined />} placeholder="Search Tags" />
      {tagGroups.map((group) => (
        <div key={group.label}>
          <Text className="publishing-asset-popover-section">{group.label}</Text>
          <CheckboxList options={group.options} value={value} onChange={onChange} />
        </div>
      ))}
      <Checkbox>Match all selected</Checkbox>
    </div>
  );
}

function AssetTypeIcon({ type }) {
  const Icon = assetIconByType[type] || FileTextOutlined;

  return <Icon className="publishing-asset-kind-icon" />;
}

function FolderCard({ folder }) {
  const menuItems = [
    { key: 'rename', label: 'Rename Folder', icon: <EditOutlined /> },
    { key: 'delete', label: 'Delete Folder', icon: <DeleteOutlined />, danger: true },
  ];

  return (
    <article className="publishing-folder-card">
      <FolderOutlined />
      <Text strong>{folder.name}</Text>
      <Dropdown menu={{ items: menuItems }} trigger={['click']}>
        <Button aria-label={`Options for ${folder.name}`} type="text" icon={<MoreOutlined />} />
      </Dropdown>
    </article>
  );
}

function AssetPreview({ asset }) {
  if (asset.type === 'text' || asset.type === 'template') {
    return (
      <div className="publishing-asset-text-preview">
        <p>{asset.content}</p>
      </div>
    );
  }

  return (
    <div className={`publishing-asset-media-preview is-${asset.tone || 'blue'}`}>
      {asset.src && asset.type === 'image' ? (
        <img src={asset.src} alt={asset.name} loading="lazy" />
      ) : null}
      {asset.src && asset.type === 'video' ? (
        <video src={asset.src} muted playsInline preload="metadata" aria-label={asset.name} />
      ) : null}
      {asset.type === 'video' ? <PlayCircleOutlined /> : null}
      {!asset.src ? <span>{asset.content}</span> : null}
    </div>
  );
}

function AssetCard({ asset, onView }) {
  const menuItems = [
    { key: 'view', label: 'View Asset', icon: <EditOutlined />, onClick: () => onView(asset) },
    { key: 'compose', label: 'Send to Compose', icon: <SendOutlined /> },
    { key: 'copy', label: 'Copy Asset Link', icon: <CopyOutlined /> },
  ];

  return (
    <article className="publishing-asset-card">
      <header>
        <span>
          <AssetTypeIcon type={asset.type} />
          <Text strong>{asset.name}</Text>
        </span>
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <Button aria-label={`Options for ${asset.name}`} type="text" icon={<MoreOutlined />} />
        </Dropdown>
      </header>
      <AssetPreview asset={asset} />
      <footer>
        <Button aria-label={`View Asset: ${asset.name}`} onClick={() => onView(asset)}>
          View Asset
        </Button>
        <Button aria-label={`Send to Compose: ${asset.name}`} icon={<SendOutlined />}>
          Send to Compose
        </Button>
      </footer>
    </article>
  );
}

function AssetEditView({ asset, onClose, tagOptions }) {
  const [context, setContext] = useState('both');
  const [selectedTags, setSelectedTags] = useState(asset.tags || []);

  return (
    <AdminPageLayout
      title="Edit Asset"
      headerExtra={(
        <div className="publishing-asset-edit-close">
          <Text className="publishing-asset-esc">esc</Text>
          <Button onClick={onClose}>go back</Button>
          <Button aria-label="Close edit asset" type="text" icon={<CloseOutlined />} onClick={onClose} />
        </div>
      )}
      maxWidth="none"
      contentPadding="0 0 0 0"
    >
      <div className="publishing-asset-edit-page">
        <main className="publishing-asset-edit-main">
          <section className="publishing-asset-edit-card">
            <label htmlFor="asset-title">Asset Title</label>
            <Input id="asset-title" defaultValue={asset.name} suffix={<Text type="secondary">81</Text>} />
            <label htmlFor="asset-text">Asset Text</label>
            <Input.TextArea id="asset-text" defaultValue={asset.content} autoSize={{ minRows: 4, maxRows: 8 }} />
          </section>
        </main>
        <aside className="publishing-asset-edit-side">
          <Button type="primary" size="large">Save changes</Button>
          <Button icon={<SendOutlined />}>Send To Compose</Button>
          <Button icon={<MessageOutlined />}>Start Team Conversation</Button>

          <label htmlFor="asset-context">Context</label>
          <Select
            id="asset-context"
            value={context}
            onChange={setContext}
            options={[
              { label: 'Compose', value: 'compose' },
              { label: 'Reply', value: 'reply' },
              { label: 'Both Compose and Reply', value: 'both' },
            ]}
          />

          <label htmlFor="asset-tags">Tags</label>
          <Select
            id="asset-tags"
            mode="multiple"
            maxTagCount="responsive"
            placeholder="Please select Tags..."
            value={selectedTags}
            options={tagOptions}
            onChange={setSelectedTags}
          />

          <Text strong>Created</Text>
          <div className="publishing-asset-created">
            <Tag color="purple">{asset.author}</Tag>
            <span>2026-04-02 16:56:39 on {asset.date}</span>
          </div>

          <Text strong>Asset details</Text>
          <div className="publishing-asset-detail-line">
            <AssetTypeIcon type={asset.type} />
            <span>{asset.type[0].toUpperCase() + asset.type.slice(1)}</span>
          </div>
          <Button type="link" icon={<CopyOutlined />}>Copy Asset Link</Button>
          <Text type="secondary">Asset visible to all groups in your account</Text>
        </aside>
      </div>
    </AdminPageLayout>
  );
}

export default function PublishingAssetLibraryPage() {
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [viewMode, setViewMode] = useState('tiles');
  const [showAllFolders, setShowAllFolders] = useState(false);
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [filters, setFilters] = useState({ context: [], tags: [], authors: [] });
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [tagCollections] = useManagedTagCollections();
  const tagGroups = useMemo(
    () => getPublishingTagFilterGroups(tagCollections),
    [tagCollections],
  );
  const tagOptions = useMemo(() => flattenOptionGroups(tagGroups), [tagGroups]);

  const visibleFolders = useMemo(
    () => folders.filter((folder) => matchesFolderFilters(folder, filters)),
    [filters],
  );
  const visibleAssets = useMemo(
    () => assets.filter((asset) => matchesAssetFilters(asset, filters)),
    [filters],
  );
  const rows = useMemo(() => [
    ...visibleFolders.map((folder) => ({ ...folder, rowType: 'folder' })),
    ...visibleAssets.map((asset) => ({ ...asset, rowType: 'asset', fileSize: asset.type === 'text' ? '--' : '2.4 MB' })),
  ], [visibleAssets, visibleFolders]);

  if (selectedAsset) {
    return (
      <AssetEditView
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        tagOptions={tagOptions}
      />
    );
  }

  const updateFilter = (key, values) => {
    setFilters((current) => ({ ...current, [key]: values }));
  };

  const clearFilters = () => setFilters({ context: [], tags: [], authors: [] });
  const activeFilterCount = filters.context.length + filters.tags.length + filters.authors.length;

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (_, record) => (
        <div className="publishing-asset-table-name">
          {record.rowType === 'folder' ? <FolderOutlined /> : <AssetTypeIcon type={record.type} />}
          <div>
            <Text strong>{record.name}</Text>
            {record.content ? <Text type="secondary">{record.content}</Text> : null}
          </div>
        </div>
      ),
    },
    { title: 'Creation Date', dataIndex: 'date', width: 180 },
    {
      title: 'Created By',
      dataIndex: 'author',
      width: 120,
      render: (value) => <Tag color={value === 'MXT' ? 'gold' : 'blue'}>{value}</Tag>,
    },
    {
      title: 'Tags',
      width: 180,
      render: (_, record) => (
        record.tags?.length ? (
          <div className="publishing-asset-table-tags">
            {record.tags.slice(0, 2).map((tag) => <Tag key={tag}>{tag}</Tag>)}
            {record.tags.length > 2 ? <Tag>+{record.tags.length - 2}</Tag> : null}
          </div>
        ) : '--'
      ),
    },
    { title: 'File Size', dataIndex: 'fileSize', width: 120, render: (value) => value || '--' },
    {
      title: '',
      width: 72,
      render: (_, record) => (
        record.rowType === 'asset' ? <Checkbox aria-label={`Select ${record.name}`} /> : null
      ),
    },
    {
      title: 'Actions',
      width: 110,
      align: 'center',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: record.rowType === 'folder'
              ? [{ key: 'delete-folder', label: 'Delete Folder', danger: true }]
              : [
                { key: 'view', label: 'View Asset', onClick: () => setSelectedAsset(record) },
                { key: 'compose', label: 'Send to Compose' },
              ],
          }}
          trigger={['click']}
        >
          <Button aria-label={`Options for ${record.name}`} icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <AdminPageLayout
      title="Asset Library"
      headerExtra={(
        <div className="publishing-asset-header-actions">
          <Button
            type="primary"
            icon={<FilterOutlined />}
            onClick={() => setFiltersVisible((visible) => !visible)}
          >
            Filters
          </Button>
          <ViewModeSegmented
            ariaLabel="Select how you want to display assets"
            value={viewMode}
            onChange={setViewMode}
            options={[
              {
                ariaLabel: 'Display assets in table',
                icon: <TableOutlined />,
                tooltip: 'Display assets in table',
                value: 'table',
              },
              {
                ariaLabel: 'Display assets in tiles',
                icon: <AppstoreOutlined />,
                tooltip: 'Display assets in tiles',
                value: 'tiles',
              },
            ]}
          />
          <Input className="publishing-asset-search" prefix={<SearchOutlined />} placeholder="Search all assets for..." />
        </div>
      )}
      maxWidth="none"
      contentPadding="16px 24px 24px"
    >
      <div className="publishing-asset-page">
        {filtersVisible ? (
          <PublishingFilterBar
            ariaLabel="Filters"
            activeCount={activeFilterCount}
            onClearAll={clearFilters}
          >
            <PublishingFilterCell
              title="Context & Type"
              summary={getPublishingFilterSummary(filters.context)}
              activeCount={filters.context.length}
              popoverWidth={320}
            >
              <div className="publishing-asset-popover">
                <Text strong>Context & Type</Text>
                <CheckboxList
                  options={contextOptions}
                  value={filters.context}
                  onChange={(values) => updateFilter('context', values)}
                />
              </div>
            </PublishingFilterCell>
            <PublishingFilterCell
              title="Tags"
              summary={getPublishingFilterSummary(filters.tags, 'Viewing all', tagOptions)}
              activeCount={filters.tags.length}
              popoverWidth={360}
            >
              <TagsFilter
                tagGroups={tagGroups}
                value={filters.tags}
                onChange={(values) => updateFilter('tags', values)}
              />
            </PublishingFilterCell>
            <PublishingFilterCell
              title="Asset Authors"
              summary={getPublishingFilterSummary(filters.authors)}
              activeCount={filters.authors.length}
              popoverWidth={320}
            >
              <div className="publishing-asset-popover">
                <Text strong>Asset Authors</Text>
                <CheckboxList
                  options={authorOptions}
                  value={filters.authors}
                  onChange={(values) => updateFilter('authors', values)}
                />
              </div>
            </PublishingFilterCell>
          </PublishingFilterBar>
        ) : null}

        <section className="publishing-asset-controls">
          {viewMode === 'tiles' ? (
            <Select
              aria-label="Sort assets"
              value={sortOrder}
              options={sortOptions}
              onChange={setSortOrder}
              style={{ width: 228 }}
            />
          ) : null}
          <div className="publishing-asset-folder-toggle">
            <Text strong>Show assets from all folders</Text>
            <Switch checked={showAllFolders} onChange={setShowAllFolders} />
          </div>
        </section>

        <Text className="publishing-asset-result-label">
          Filter results: {visibleFolders.length} folders and {visibleAssets.length} assets
        </Text>

        {viewMode === 'table' ? (
          <Table
            rowKey={(record) => `${record.rowType}-${record.id}`}
            columns={columns}
            dataSource={rows}
            pagination={false}
            className="publishing-asset-table"
          />
        ) : (
          <div className="publishing-asset-grid-page">
            <Title level={3}>Folders ({folders.length})</Title>
            <div className="publishing-folder-grid">
              {visibleFolders.map((folder) => <FolderCard key={folder.id} folder={folder} />)}
            </div>
            <Title level={3}>Assets ({assets.length})</Title>
            <div className="publishing-asset-grid">
              {visibleAssets.map((asset) => <AssetCard key={asset.id} asset={asset} onView={setSelectedAsset} />)}
            </div>
          </div>
        )}

        <div className="publishing-asset-pagination">
          <Pagination current={1} total={1110} pageSize={10} showSizeChanger={false} />
        </div>
      </div>
    </AdminPageLayout>
  );
}
