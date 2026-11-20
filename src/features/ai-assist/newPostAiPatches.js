const isBlankString = (value) => !String(value || '').trim();

const hasOwnKeys = (value) => Boolean(value && Object.keys(value).length);
const arraysEqual = (left = [], right = []) => (
  left.length === right.length && left.every((value, index) => value === right[index])
);

export const createComposerSnapshot = ({
  activeNetwork,
  approvalWorkflow,
  captions,
  firstComment,
  labels,
  mobilePublisher,
  mode,
  scheduleByNetwork,
  scheduleMode,
  scheduledTimes,
  videoDetails,
  youtubeAudience,
  youtubeTitle,
}) => ({
  activeNetwork,
  approvalWorkflow,
  captions,
  firstComment,
  labels,
  mobilePublisher,
  mode,
  scheduleByNetwork,
  scheduleMode,
  scheduledTimes,
  videoDetails,
  youtubeAudience,
  youtubeTitle,
});

export const applyAiPatch = (snapshot, patch = {}) => ({
  ...snapshot,
  approvalWorkflow: patch.approvalWorkflow ?? snapshot.approvalWorkflow,
  captions: hasOwnKeys(patch.captions)
    ? { ...snapshot.captions, ...patch.captions }
    : snapshot.captions,
  firstComment: patch.firstComment ?? snapshot.firstComment,
  labels: Array.isArray(patch.labels) ? patch.labels : snapshot.labels,
  mobilePublisher: patch.mobilePublisher ?? snapshot.mobilePublisher,
  scheduleByNetwork: typeof patch.scheduleByNetwork === 'boolean'
    ? patch.scheduleByNetwork
    : snapshot.scheduleByNetwork,
  scheduleMode: patch.scheduleMode ?? snapshot.scheduleMode,
  scheduledTimes: Array.isArray(patch.scheduledTimes) ? patch.scheduledTimes : snapshot.scheduledTimes,
  videoDetails: hasOwnKeys(patch.videoDetails)
    ? { ...snapshot.videoDetails, ...patch.videoDetails }
    : snapshot.videoDetails,
  youtubeAudience: patch.youtubeAudience ?? snapshot.youtubeAudience,
  youtubeTitle: patch.youtubeTitle ?? snapshot.youtubeTitle,
});

export const isAiPatchEmptyTarget = (snapshot, patch = {}) => {
  if (patch.captions) {
    return Object.entries(patch.captions).every(([key]) => isBlankString(snapshot.captions?.[key]));
  }

  if ('firstComment' in patch) {
    return isBlankString(snapshot.firstComment);
  }

  if ('youtubeTitle' in patch) {
    return isBlankString(snapshot.youtubeTitle);
  }

  if ('youtubeAudience' in patch) {
    return isBlankString(snapshot.youtubeAudience);
  }

  if (patch.videoDetails) {
    return Object.entries(patch.videoDetails).every(([key, value]) => {
      const currentValue = snapshot.videoDetails?.[key];

      if (Array.isArray(value)) {
        return !Array.isArray(currentValue) || currentValue.length === 0;
      }

      if (typeof value === 'boolean') {
        return currentValue === undefined || currentValue === null;
      }

      return isBlankString(currentValue);
    });
  }

  if ('labels' in patch) {
    return !snapshot.labels?.length;
  }

  if ('approvalWorkflow' in patch) {
    return !snapshot.approvalWorkflow;
  }

  if ('mobilePublisher' in patch) {
    return !snapshot.mobilePublisher;
  }

  if ('scheduledTimes' in patch) {
    return Array.isArray(snapshot.scheduledTimes)
      ? snapshot.scheduledTimes.every((entry) => !entry?.date && !entry?.time)
      : true;
  }

  return false;
};

export const doesAiPatchChangeSnapshot = (snapshot, patch = {}) => {
  if (patch.captions) {
    return Object.entries(patch.captions).some(([key, value]) => snapshot.captions?.[key] !== value);
  }

  if ('firstComment' in patch) {
    return snapshot.firstComment !== patch.firstComment;
  }

  if ('youtubeTitle' in patch) {
    return snapshot.youtubeTitle !== patch.youtubeTitle;
  }

  if ('youtubeAudience' in patch) {
    return snapshot.youtubeAudience !== patch.youtubeAudience;
  }

  if (patch.videoDetails) {
    return Object.entries(patch.videoDetails).some(([key, value]) => {
      const currentValue = snapshot.videoDetails?.[key];

      if (Array.isArray(value)) {
        return !arraysEqual(currentValue || [], value);
      }

      return currentValue !== value;
    });
  }

  if ('labels' in patch) {
    return !arraysEqual(snapshot.labels || [], patch.labels || []);
  }

  if ('approvalWorkflow' in patch) {
    return snapshot.approvalWorkflow !== patch.approvalWorkflow;
  }

  if ('mobilePublisher' in patch) {
    return snapshot.mobilePublisher !== patch.mobilePublisher;
  }

  if ('scheduledTimes' in patch) {
    return JSON.stringify(snapshot.scheduledTimes || []) !== JSON.stringify(patch.scheduledTimes || []);
  }

  if ('scheduleMode' in patch) {
    return snapshot.scheduleMode !== patch.scheduleMode;
  }

  if ('scheduleByNetwork' in patch) {
    return snapshot.scheduleByNetwork !== patch.scheduleByNetwork;
  }

  return false;
};

export const describeAiPatch = (patch = {}) => {
  if (patch.captions) {
    const captionKeys = Object.keys(patch.captions);
    return `Prepared caption for ${captionKeys.join(', ')}`;
  }

  if ('firstComment' in patch) {
    return 'Prepared first comment';
  }

  if ('youtubeTitle' in patch) {
    return 'Prepared YouTube title';
  }

  if (patch.videoDetails?.youtubeTags) {
    return 'Prepared YouTube tags';
  }

  if (patch.videoDetails?.subtitleText) {
    return 'Prepared subtitle draft';
  }

  if (patch.videoDetails?.threadsAltText) {
    return 'Prepared Threads alt text';
  }

  if (patch.videoDetails?.facebookCategory || patch.videoDetails?.facebookPlacement) {
    return 'Prepared Facebook video settings';
  }

  if (patch.videoDetails?.youtubeCategory || patch.videoDetails?.youtubeAgeRestriction || patch.videoDetails?.youtubeLicense) {
    return 'Prepared YouTube settings';
  }

  if (
    'tiktokAllowComments' in (patch.videoDetails || {})
    || 'tiktokAllowDuets' in (patch.videoDetails || {})
    || 'tiktokAllowStitches' in (patch.videoDetails || {})
  ) {
    return 'Prepared TikTok settings';
  }

  if ('approvalWorkflow' in patch) {
    return 'Prepared approval workflow recommendation';
  }

  if ('mobilePublisher' in patch) {
    return 'Prepared mobile publisher recommendation';
  }

  if ('labels' in patch) {
    return 'Prepared tags';
  }

  if ('scheduledTimes' in patch) {
    return 'Prepared schedule suggestion';
  }

  return 'Prepared AI suggestion';
};
