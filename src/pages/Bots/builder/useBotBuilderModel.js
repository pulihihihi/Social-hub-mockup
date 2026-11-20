import { useState } from 'react';
import { WELCOME_MESSAGES, buildInitialReplies } from '../botData';
import {
  addContentToFlow,
  deleteNodeFromFlow,
  duplicateNodeInFlow,
  getNodeValue,
  saveNodeValue,
} from './botBuilderState';

export const useBotBuilderModel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('builder');
  const [welcomeMessages, setWelcomeMessages] = useState(WELCOME_MESSAGES);
  const [quickReplies, setQuickReplies] = useState(buildInitialReplies);
  const [settings, setSettings] = useState({
    name: 'test',
    description: '',
    restartCommand: 'Start Over',
    disableFreeText: false,
    autoCompleteSmartInbox: true,
    typingIndicators: true,
    online: false,
    saved: true,
  });
  const [contentContext, setContentContext] = useState(null);
  const [editNode, setEditNode] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [keywordsOpen, setKeywordsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [commands, setCommands] = useState([
    { id: 'cmd-restart', title: 'Restart', keywords: 'restart, menu', response: 'Welcome Message' },
  ]);

  const markDirty = () => setSettings((current) => ({ ...current, saved: false }));

  const applyFlowState = ({ nextWelcomeMessages, nextQuickReplies }) => {
    if (nextWelcomeMessages) setWelcomeMessages(nextWelcomeMessages);
    if (nextQuickReplies) setQuickReplies(nextQuickReplies);
    markDirty();
  };

  const openEditNode = (ref) => {
    setEditNode({
      ...ref,
      kind: ref.scope.includes('Reply') || ref.scope === 'reply' ? 'reply' : 'message',
      value: getNodeValue({ ref, welcomeMessages, quickReplies }),
    });
  };

  const saveNode = (value) => {
    if (!editNode) return;

    const nextState = saveNodeValue({ editNode, value, welcomeMessages, quickReplies });
    applyFlowState({
      nextWelcomeMessages: nextState.welcomeMessages,
      nextQuickReplies: nextState.quickReplies,
    });
    setEditNode(null);
  };

  const addContent = (type) => {
    if (!contentContext) return;

    const nextState = addContentToFlow({
      context: contentContext,
      type,
      welcomeMessages,
      quickReplies,
    });
    applyFlowState({
      nextWelcomeMessages: nextState.welcomeMessages,
      nextQuickReplies: nextState.quickReplies,
    });
    setContentContext(null);
  };

  const duplicateNode = (ref) => {
    const nextState = duplicateNodeInFlow({ ref, welcomeMessages, quickReplies });
    applyFlowState({
      nextWelcomeMessages: nextState.welcomeMessages,
      nextQuickReplies: nextState.quickReplies,
    });
  };

  const deleteNode = (ref) => {
    const nextState = deleteNodeFromFlow({ ref, welcomeMessages, quickReplies });
    applyFlowState({
      nextWelcomeMessages: nextState.welcomeMessages,
      nextQuickReplies: nextState.quickReplies,
    });
  };

  const setOnline = (online) => setSettings((current) => ({ ...current, online, saved: false }));

  const handleFinish = () => {
    setSettings((current) => ({ ...current, saved: true }));
    onClose();
  };

  return {
    activeTab,
    addContent,
    commands,
    contentContext,
    deleteNode,
    duplicateNode,
    editNode,
    handleFinish,
    helpOpen,
    keywordsOpen,
    openEditNode,
    previewOpen,
    quickReplies,
    saveNode,
    setActiveTab,
    setCommands,
    setContentContext,
    setEditNode,
    setHelpOpen,
    setKeywordsOpen,
    setOnline,
    setPreviewOpen,
    setSettings,
    settings,
    welcomeMessages,
  };
};
