import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Checkbox,
  Input,
  Popover,
  Typography,
} from 'antd';
import {
  BookOutlined,
  LeftOutlined,
  RightOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useManagedTagCollections } from '../../data/tagManagementStore';

const { Text } = Typography;

const TAG_MANAGEMENT_ROUTE = '/settings/tag-management';

const getComposerTagGroups = (collections) => (
  collections
    .filter((collection) => !collection.archived)
    .map((collection) => ({
      key: collection.id,
      label: collection.name,
      tags: collection.tags || [],
    }))
);

const flattenTagGroups = (groups) => (
  groups.flatMap((group) => group.tags.map((tag) => ({
    groupKey: group.key,
    groupLabel: group.label,
    label: tag,
    value: tag,
  })))
);

const TaxonomyTriggerButton = forwardRef(({
  className,
  icon,
  items = [],
  maxVisible = 2,
  placeholder,
  value,
  ...triggerProps
}, ref) => {
  const visibleItems = items.slice(0, maxVisible);
  const hiddenCount = Math.max(items.length - visibleItems.length, 0);

  return (
    <button
      {...triggerProps}
      ref={ref}
      type="button"
      className={['publishing-new-post-taxonomy-trigger', className].filter(Boolean).join(' ')}
    >
      <span className="publishing-new-post-taxonomy-trigger-icon">{icon}</span>
      <span className={[
        'publishing-new-post-taxonomy-trigger-content',
        items.length || value ? 'has-value' : '',
      ].filter(Boolean).join(' ')}
      >
        {value ? (
          <span className="publishing-new-post-taxonomy-single-value">{value}</span>
        ) : visibleItems.length ? (
          <>
            {visibleItems.map((item) => (
              <span key={item} className="publishing-new-post-taxonomy-token">{item}</span>
            ))}
            {hiddenCount ? (
              <span className="publishing-new-post-taxonomy-token is-count">+{hiddenCount}</span>
            ) : null}
          </>
        ) : (
          <span className="publishing-new-post-taxonomy-placeholder">{placeholder}</span>
        )}
      </span>
    </button>
  );
});

export const TagsPickerPopover = ({ labels, onChange }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeGroupKey, setActiveGroupKey] = useState(null);
  const searchRef = useRef(null);
  const [managedTagCollections] = useManagedTagCollections();
  const tagGroups = useMemo(
    () => getComposerTagGroups(managedTagCollections),
    [managedTagCollections],
  );
  const allTags = useMemo(() => flattenTagGroups(tagGroups), [tagGroups]);
  const activeGroup = tagGroups.find((group) => group.key === activeGroupKey);
  const selectedLabels = new Set(labels);
  const normalizedSearch = search.trim().toLowerCase();
  const searchResults = normalizedSearch
    ? allTags.filter((tag) => (
      tag.label.toLowerCase().includes(normalizedSearch)
      || tag.groupLabel.toLowerCase().includes(normalizedSearch)
    ))
    : [];
  const visibleTags = activeGroup
    ? activeGroup.tags.map((tag) => ({
      groupKey: activeGroup.key,
      groupLabel: activeGroup.label,
      label: tag,
      value: tag,
    }))
    : searchResults;

  useEffect(() => {
    if (!open) return;
    window.setTimeout(() => searchRef.current?.focus?.(), 80);
  }, [open, activeGroupKey]);

  const handleOpenChange = (nextOpen) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setSearch('');
      setActiveGroupKey(null);
    }
  };

  const toggleLabel = (value) => {
    onChange(
      selectedLabels.has(value)
        ? labels.filter((label) => label !== value)
        : [...labels, value],
    );
  };

  const content = (
    <div className="publishing-new-post-taxonomy-panel">
      <div className="publishing-new-post-taxonomy-panel-header">
        <Text strong>{activeGroup ? activeGroup.label : 'Tags'}</Text>
        {activeGroup ? (
          <Button
            type="link"
            icon={<LeftOutlined />}
            onClick={() => {
              setActiveGroupKey(null);
              setSearch('');
            }}
          >
            Back
          </Button>
        ) : (
          <Button type="link" disabled={!labels.length} onClick={() => onChange([])}>
            Remove All
          </Button>
        )}
      </div>
      <div className="publishing-new-post-taxonomy-search">
        <Input
          ref={searchRef}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search Tags..."
        />
      </div>
      <div className="publishing-new-post-taxonomy-list" role="listbox" aria-label="Tags">
        {!activeGroup && !normalizedSearch ? (
          tagGroups.map((group) => (
            <button
              key={group.key}
              type="button"
            className="publishing-new-post-taxonomy-row is-category"
            onClick={() => setActiveGroupKey(group.key)}
          >
            <BookOutlined />
            <span>{group.label}</span>
              <RightOutlined />
            </button>
          ))
        ) : visibleTags.length ? (
          visibleTags.map((tag) => (
            <button
              key={`${tag.groupKey}-${tag.value}`}
              type="button"
              className={[
                'publishing-new-post-taxonomy-row',
                'is-leaf',
                selectedLabels.has(tag.value) ? 'is-selected' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => toggleLabel(tag.value)}
            >
              <Checkbox
                checked={selectedLabels.has(tag.value)}
                onClick={(event) => event.stopPropagation()}
                onChange={() => toggleLabel(tag.value)}
              />
              <span>
                <Text>{tag.label}</Text>
                {activeGroup ? null : <Text type="secondary">{tag.groupLabel}</Text>}
              </span>
            </button>
          ))
        ) : (
          <div className="publishing-new-post-taxonomy-empty">
            <Text type="secondary">No tags found.</Text>
          </div>
        )}
      </div>
      <div className="publishing-new-post-taxonomy-panel-footer">
        <Button
          type="link"
          onClick={() => {
            setOpen(false);
            navigate(TAG_MANAGEMENT_ROUTE);
          }}
        >
          Manage
        </Button>
      </div>
    </div>
  );

  return (
    <Popover
      arrow={false}
      content={content}
      open={open}
      onOpenChange={handleOpenChange}
      overlayClassName="publishing-new-post-taxonomy-popover"
      placement="right"
      trigger="click"
    >
      <TaxonomyTriggerButton
        icon={<TagOutlined />}
        items={labels}
        placeholder="Add tags"
      />
    </Popover>
  );
};
