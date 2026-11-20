import {
  AppstoreOutlined,
  BulbOutlined,
  CustomerServiceOutlined,
  MessageOutlined,
  PictureOutlined,
  PlusOutlined,
  RocketOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { MANAGED_CHANNELS } from '../../data/channelManagement';

const BOT_CHANNEL_IDS = ['fb-delta-main', 'fb-warrior', 'ig-delta', 'ig-warrior'];

export const BOT_CHANNELS = MANAGED_CHANNELS
  .filter((channel) => BOT_CHANNEL_IDS.includes(channel.id))
  .map((channel) => ({
    id: channel.id,
    name: channel.name,
    handle: channel.handle,
    network: channel.platformKey,
  }));

export const TEMPLATES = [
  {
    key: 'blank',
    title: 'Blank Template',
    description: 'Create a bot from scratch.',
    icon: <PlusOutlined />,
    tone: 'blank',
  },
  {
    key: 'customer-care',
    title: 'Customer Care',
    description: 'Create a bot that helps your customers.',
    icon: <CustomerServiceOutlined />,
    tone: 'care',
  },
  {
    key: 'lead-generation',
    title: 'Lead Generation',
    description: 'Create a bot that generates leads for your business.',
    icon: <BulbOutlined />,
    tone: 'lead',
  },
  {
    key: 'shop',
    title: 'Shop Bot',
    description: 'Create a bot that guides users to your products.',
    icon: <ShoppingOutlined />,
    tone: 'shop',
  },
  {
    key: 'content',
    title: 'Content Discovery',
    description: 'Create a bot that shares valuable content.',
    icon: <RocketOutlined />,
    tone: 'content',
  },
];

export const BOTS = [
  {
    id: 'test-primary',
    sourceChannelId: 'fb-delta-main',
    name: 'test',
    channel: 'Garena Delta Force (VN - Vietnamese)',
    handle: 'GarenaDeltaForceVN',
    network: 'facebook',
    status: 'Offline',
    savedAt: '3 minutes ago',
  },
  {
    id: 'test-copy',
    sourceChannelId: 'fb-warrior',
    name: 'test',
    channel: 'Chien Than Delta Force',
    handle: 'chienthanDF',
    network: 'facebook',
    status: 'Offline',
    savedAt: '4 minutes ago',
  },
];

export const QUICK_REPLIES = [
  { id: 'returns', text: 'Returns & Shipping', icon: 'box', response: 'For returns & shipping information, please click on the link below.' },
  { id: 'feedback', text: 'Provide Feedback', icon: 'mail', response: 'We appreciate hearing what you think! Please click the link below to share your feedback.' },
  { id: 'order', text: 'My Order', icon: 'question', response: 'Great! What do you need to know?' },
  { id: 'human', text: 'Human Help', icon: 'person', response: 'Great! Someone will be in touch shortly. While you wait, would you mind letting us know what you are reaching out about?' },
];

export const ORDER_REPLIES = [
  { id: 'status', text: 'Order Status', response: 'Cool! Click below and enter your login information to get an update on your order.' },
  { id: 'cancel', text: 'Order Cancellation', response: 'Sorry to hear your order did not work out. Please click this link and login to your account to cancel your order.' },
  { id: 'refund', text: 'Refund Request', response: 'You can submit a refund request here. If you have other questions about your refund, please ask below.' },
  { id: 'other', text: 'Something else', response: 'Please hang tight while we connect you to someone who can resolve your issue!' },
];

export const CONTENT_TYPES = [
  {
    key: 'text',
    title: 'Text Message',
    description: 'Send a written response in the conversation flow.',
    icon: <MessageOutlined />,
  },
  {
    key: 'image',
    title: 'Image Message',
    description: 'Represent an image response with optional supporting copy.',
    icon: <PictureOutlined />,
  },
  {
    key: 'quickReply',
    title: 'Quick Reply',
    description: 'Add a clickable reply option that branches the conversation.',
    icon: <RocketOutlined />,
  },
  {
    key: 'carousel',
    title: 'Carousel Cards',
    description: 'Show a card-style response that can link users to a URL.',
    icon: <AppstoreOutlined />,
  },
];

export const createBotBuilderId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const createMessage = (body, type = 'text', { createId = createBotBuilderId } = {}) => ({
  id: createId('msg'),
  type,
  body,
});

export const WELCOME_MESSAGES = [
  createMessage('Hi there! Thanks for reaching out, you are messaging with our chatbot. Please click on one of the options below so we can better assist you.'),
  createMessage('If you ever want to restart your conversation with us please type "menu" or hit the Restart button.'),
];

export const getDefaultMessageBody = (type) => {
  if (type === 'image') return 'Image response placeholder with alt text and an upload slot.';
  if (type === 'carousel') return 'Carousel card placeholder with image, title, subtitle, and URL button.';
  return 'New bot message';
};

export const createReply = (text, response = 'Add a response for this quick reply.', children = [], options = {}) => ({
  id: (options.createId || createBotBuilderId)('qr'),
  text,
  messages: [createMessage(response, 'text', options)],
  children,
});

export const buildInitialReplies = (options = {}) => QUICK_REPLIES.map((reply) => createReply(
  reply.text,
  reply.response,
  reply.id === 'order'
    ? ORDER_REPLIES.map((orderReply) => createReply(orderReply.text, orderReply.response, [], options))
    : [],
  options,
));
