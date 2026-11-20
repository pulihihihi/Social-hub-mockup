import { Breadcrumb, Button, Drawer, Input, Table, Tag, Typography } from 'antd';
import { SearchOutlined, RightOutlined } from '@ant-design/icons';
import { T } from '../../theme';
import { CHANNEL_TERMINOLOGY } from '../../data/channelManagement';
import './PublishingResourcePanel.css';

const { Text, Title } = Typography;

const RESOURCE_CONTENT = {
  instagramCollaborators: {
    title: 'Instagram collaborators',
    crumb: ['Publishing Resources', 'Compose', 'Instagram Options', 'Collaborators'],
    sourceLabel: 'Sprout Support article',
    sourceUrl: 'https://support.sproutsocial.com/hc/en-us/articles/28825824263565/',
    definition: `Collaborators let an Instagram post invite additional ${CHANNEL_TERMINOLOGY.lowerPlural} before publishing. This local composer keeps the invite flow as a safe mock until the Instagram collaboration API contract is available.`,
    highlights: [
      `Invite up to 3 eligible Instagram ${CHANNEL_TERMINOLOGY.lowerPlural}.`,
      'Collaborators must be reviewed before the post is saved, scheduled, or submitted for approval.',
      'Disconnected or unsupported channels remain blocked from collaborator invites.',
    ],
    sections: [
      {
        title: 'Compose workflow',
        items: [
          'Select an Instagram channel in the channel selector.',
          'Open Instagram Options and choose Invite Collaborators.',
          'Search or select eligible collaborators, then review the invite list before scheduling.',
          'If a collaborator is unavailable, save the post as a draft and resolve channel access first.',
        ],
      },
      {
        title: 'Local implementation status',
        items: [
          'This drawer is a safe mock resource state and does not send real Instagram invites.',
          'Real collaborator selection, validation, and submission require API contracts.',
          'The composer keeps this action visible so the source affordance is not a dead control.',
        ],
      },
    ],
    related: [
      'Instagram publishing requirements',
      'Channel connection status',
      'Approval workflows',
    ],
  },
  paidPromotion: {
    title: 'Facebook and Instagram paid promotion',
    crumb: ['Publishing Resources', 'Compose', 'Promote'],
    sourceLabel: 'Sprout Support article',
    sourceUrl: 'https://support.sproutsocial.com/hc/en-us/articles/7759006161037-How-do-I-run-a-promotion-on-my-Facebook-or-Instagram-Meta-Ad-Account-in-Sprout',
    definition: 'Use paid promotion to boost Facebook and Instagram posts directly from the publishing workflow. Promotions can be started from Compose, the Publishing Calendar, or the Facebook Post Performance Report.',
    highlights: [
      'Promote drafted, scheduled, queued, Publish Now, or approval-needed posts.',
      'Supported entry points include Compose, Calendar, and Facebook Post Performance Report.',
      'Only users with publishing permissions for the selected pages and ad account can run promotions.',
    ],
    sections: [
      {
        title: 'Required setup',
        items: [
          'Add the Facebook Business Page to Facebook Business Manager.',
          'Add the Facebook Ad Account to the same Business Manager.',
          'Confirm the user has permission for the Facebook or Instagram page and the associated ad account.',
        ],
      },
      {
        title: 'Promote from Compose',
        items: [
          `Select the Facebook or Instagram ad account in the ${CHANNEL_TERMINOLOGY.lowerSingular} picker.`,
          'Create the post with the required text and media.',
          'Open the Promote section and start a Boost Post flow.',
          'Select an audience, set spend, duration, Advantage+ placements, and page publishing options.',
          'Apply optional workflows, tags, schedule timing, then save or submit.',
        ],
      },
      {
        title: 'Other promotion entry points',
        items: [
          'From Calendar, use the post action menu to open the promotion flow.',
          'For sent posts, the Promote Post modal opens directly.',
          'For upcoming posts, Compose opens first so the post can be reviewed before promotion.',
          'From Post Performance Report, open a Facebook post and complete the Boost Post form.',
        ],
      },
    ],
    related: [
      'What Facebook Ad Tools can I use in Sprout?',
      'How do I connect my Facebook Ad Account to Sprout?',
      'Facebook Paid Promotions FAQs',
    ],
  },
  bulkScheduling: {
    title: 'Bulk scheduling',
    crumb: ['Publishing Resources', 'Compose', 'When to post'],
    sourceLabel: 'Sprout Support article',
    sourceUrl: 'https://support.sproutsocial.com/hc/en-us/articles/115005864203-How-do-I-use-bulk-scheduling',
    definition: 'Bulk scheduling imports a CSV file into the Publishing Calendar so teams can create many posts in one workflow instead of composing each post manually.',
    highlights: [
      'Create up to 350 messages with tags, links, and images in a single import.',
      'Trial customers can upload up to 50 messages per import.',
      'Bulk scheduling can import scheduled messages or drafts, but it does not support videos.',
    ],
    tableTitle: 'CSV fields',
    tableRows: [
      { field: 'date', required: 'Required', detail: 'Use dd/mm/yyyy or mm/dd/yyyy based on the import preference.' },
      { field: 'time_24hr', required: 'Required', detail: 'Use 24-hour time. Messages must be spaced at least 10 minutes apart and at least 10 minutes after upload.' },
      { field: 'message_text', required: 'Required', detail: 'Post copy. It must stay within the selected network character limit.' },
      { field: 'link_url', required: 'Optional', detail: 'Well-formed HTTP or HTTPS link for supported networks.' },
      { field: 'instagram_first_comment', required: 'Optional', detail: `First-comment copy for Instagram Business ${CHANNEL_TERMINOLOGY.lowerPlural}.` },
      { field: 'public_image_url', required: 'Optional', detail: 'A publicly accessible image URL that opens without login.' },
      { field: 'tags', required: 'Optional', detail: 'Existing tags separated by commas.' },
      { field: 'approval_workflow_name', required: 'Optional', detail: 'Existing approval workflow name applied per row.' },
    ],
    sections: [
      {
        title: 'Import workflow',
        items: [
          'Open Bulk Post Import from Compose or from the Publishing Calendar.',
          `Select the ${CHANNEL_TERMINOLOGY.lowerPlural} that should receive the imported messages.`,
          'Upload or drag in the CSV file.',
          'Select the date format and optional shared tags.',
          'Choose whether to import as drafts and whether to shorten links, then start the import.',
        ],
      },
      {
        title: 'Validation and timing',
        items: [
          'Sprout recommends scheduling no more than six months into the future.',
          'If validation fails, the import reports formatting errors and can produce a CSV of failed rows.',
          'Large imports may continue in the background, with completion reported by email.',
        ],
      },
      {
        title: 'Image and encoding considerations',
        items: [
          'Use Google Sheets or UTF-8 CSV export for emoji or international characters.',
          'Image URLs should point directly to the image file, not a preview page.',
          'For Google Drive and Dropbox, make sure the image is publicly accessible.',
          'Test image URLs in a private browser window before import.',
        ],
      },
    ],
    related: [
      'Sample CSV template',
      'Approval Workflow setup',
      'Publishing Calendar import flow',
    ],
  },
};

const tableColumns = [
  {
    title: 'Field',
    dataIndex: 'field',
    key: 'field',
    width: 170,
    render: (value) => <Text strong>{value}</Text>,
  },
  {
    title: 'Status',
    dataIndex: 'required',
    key: 'required',
    width: 110,
    render: (value) => (
      <Tag color={value === 'Required' ? 'blue' : 'default'}>{value}</Tag>
    ),
  },
  {
    title: 'Detail',
    dataIndex: 'detail',
    key: 'detail',
  },
];

const PublishingResourcePanel = ({ activeKey, onClose, open }) => {
  const resource = RESOURCE_CONTENT[activeKey] || null;

  if (!resource) {
    return null;
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      title="Publishing Resources"
      width="50vw"
      rootClassName="publishing-resource-drawer"
      styles={{ body: { padding: 0, overflow: 'hidden' } }}
      zIndex={2500}
    >
      <div className="publishing-resource-panel">
        <div className="publishing-resource-breadcrumb">
          <Breadcrumb items={resource.crumb.map((item) => ({ title: item }))} />
        </div>
        <div className="publishing-resource-search">
          <Input placeholder="Search resources..." prefix={<SearchOutlined />} />
        </div>
        <div className="publishing-resource-content">
          <div className="publishing-resource-title-row">
            <Title level={4}>{resource.title}</Title>
            <Button type="link" href={resource.sourceUrl} target="_blank" rel="noreferrer">
              {resource.sourceLabel}
            </Button>
          </div>

          <div className="publishing-resource-definition">
            <Text strong style={{ color: T.colorPrimary }}>Definition</Text>
            <Text>{resource.definition}</Text>
          </div>

          <section className="publishing-resource-section">
            <Text strong>Key points</Text>
            <ul>
              {resource.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {resource.tableRows ? (
            <section className="publishing-resource-section">
              <Text strong>{resource.tableTitle}</Text>
              <Table
                columns={tableColumns}
                dataSource={resource.tableRows.map((row) => ({ ...row, key: row.field }))}
                pagination={false}
                size="small"
              />
            </section>
          ) : null}

          {resource.sections.map((section) => (
            <section key={section.title} className="publishing-resource-section">
              <Text strong>{section.title}</Text>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}

          <section className="publishing-resource-related">
            <Text strong>Related</Text>
            {resource.related.map((item) => (
              <button key={item} type="button">
                <RightOutlined />
                <span>{item}</span>
              </button>
            ))}
          </section>
        </div>
      </div>
    </Drawer>
  );
};

export { RESOURCE_CONTENT };
export default PublishingResourcePanel;
