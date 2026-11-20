import dayjs from 'dayjs';
import { getNewPostAiSection, getNewPostAiSections } from './newPostAiRegistry';
import { resolveNewPostAiConfig } from './newPostAiConfigResolver';
import {
  createComposerSnapshot,
  describeAiPatch,
  doesAiPatchChangeSnapshot,
  isAiPatchEmptyTarget,
} from './newPostAiPatches';

const CORE_HASHTAGS = ['#DeltaForce', '#GarenaDeltaForce', '#DeltaForceVN'];

const summarizeMedia = (media = []) => {
  if (!media.length) {
    return 'uploaded Delta Force media';
  }

  const lead = media[0];
  const leadLabel = lead?.label || lead?.title || lead?.name || (lead?.type === 'video' ? 'gameplay video' : 'promo image');
  const counts = media.reduce((accumulator, item) => {
    accumulator[item.type] = (accumulator[item.type] || 0) + 1;
    return accumulator;
  }, {});

  const mix = [
    counts.image ? `${counts.image} image${counts.image > 1 ? 's' : ''}` : null,
    counts.video ? `${counts.video} video${counts.video > 1 ? 's' : ''}` : null,
  ].filter(Boolean).join(' + ');

  return mix ? `${leadLabel} (${mix})` : leadLabel;
};

const unique = (values = []) => Array.from(new Set(values.filter(Boolean)));

const buildReferenceMap = (items = []) => new Map(items.map((item) => [item.id, item]));

const buildUsedReferences = (ids = [], map) => ids.map((id) => {
  const item = map.get(id);

  return {
    id,
    linkedReasons: item?.linkedReasons || [],
    name: item?.name || id,
    verificationTier: item?.verificationTier || item?.status || null,
    verifiedOn: item?.updatedAt || item?.createdAt || null,
    version: item?.version || null,
  };
});

const buildResultProvenance = ({ section, sectionConfig = null }) => {
  if (!sectionConfig) {
    return {
      activeKnowledge: [],
      activeSkills: [],
      linkedKnowledge: [],
      linkedSkills: [],
      usedKnowledge: [],
      usedSkills: [],
    };
  }

  const skillMap = buildReferenceMap(sectionConfig.linkedSkills || []);
  const knowledgeMap = buildReferenceMap(sectionConfig.linkedKnowledge || []);
  const linkedSkills = buildUsedReferences(section.skills || [], skillMap);
  const linkedKnowledge = buildUsedReferences(section.knowledge || [], knowledgeMap);
  const activeSkills = buildUsedReferences(
    (sectionConfig.activeSkills || []).map((item) => item.id),
    skillMap,
  );
  const activeKnowledge = buildUsedReferences(
    (sectionConfig.activeKnowledge || []).map((item) => item.id),
    knowledgeMap,
  );

  return {
    activeKnowledge,
    activeSkills,
    linkedKnowledge,
    linkedSkills,
    usedKnowledge: activeKnowledge,
    usedSkills: activeSkills,
  };
};

const toSentenceCase = (value = '') => value.charAt(0).toUpperCase() + value.slice(1);

const splitSentences = (value = '') => (
  String(value || '')
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
);

const shortenText = (value = '') => {
  const sentences = splitSentences(value);
  if (!sentences.length) {
    return value;
  }

  return sentences.slice(0, 2).join(' ');
};

const addStrongerCta = (value = '') => {
  if (/comment|reply|share|watch|drop|tell us/i.test(value)) {
    return value;
  }

  return `${value.trim()} Drop your loadout in the comments.`;
};

const applyRefinement = (value, refinementPrompt = '') => {
  if (!refinementPrompt) {
    return value;
  }

  const prompt = refinementPrompt.toLowerCase();
  let nextValue = value;

  if (prompt.includes('short')) {
    nextValue = shortenText(nextValue);
  }

  if (prompt.includes('cta')) {
    nextValue = addStrongerCta(nextValue);
  }

  if (prompt.includes('direct')) {
    nextValue = nextValue.replace(/check out|watch now/gi, 'Watch').replace(/\s+/g, ' ').trim();
  }

  if (prompt.includes('emoji')) {
    nextValue = nextValue.includes('🔥') ? nextValue : `🔥 ${nextValue}`;
  }

  return nextValue;
};

const buildBaseCaption = ({ mediaSummary, refinementPrompt, selectedNetworks = [] }) => {
  const networkHint = selectedNetworks.includes('youtube')
    ? 'Watch the full upload and'
    : selectedNetworks.includes('tiktok')
      ? 'Lock in and'
      : 'Jump in and';

  return applyRefinement(
    `Delta Force is live in ${mediaSummary}. ${networkHint} tell us which operator, loadout, or play you are running today.`,
    refinementPrompt,
  );
};

const buildPerNetworkCaptions = ({ baseCaption, selectedNetworks = [], refinementPrompt }) => {
  const variants = {};

  selectedNetworks.forEach((networkKey) => {
    if (networkKey === 'youtube') {
      variants.youtube = applyRefinement(
        `Delta Force gameplay breakdown. ${shortenText(baseCaption)} Watch the full upload and drop your squad callout below.`,
        refinementPrompt,
      );
      return;
    }

    if (networkKey === 'tiktok') {
      variants.tiktok = applyRefinement(
        `Delta Force clip check. ${shortenText(baseCaption)} Drop the loadout you would run.`,
        refinementPrompt,
      );
      return;
    }

    if (networkKey === 'threads') {
      variants.threads = applyRefinement(
        `Delta Force check-in: ${shortenText(baseCaption)}`,
        refinementPrompt,
      );
      return;
    }

    variants[networkKey] = applyRefinement(baseCaption, refinementPrompt);
  });

  return variants;
};

const buildHashtags = ({ caption = '', selectedNetworks = [] }) => {
  const values = [...CORE_HASHTAGS];

  if (/operator|loadout/i.test(caption)) {
    values.push('#OperatorLoadout');
  }

  if (selectedNetworks.includes('tiktok')) {
    values.push('#TacticalShooter');
  }

  if (selectedNetworks.includes('youtube')) {
    values.push('#Gameplay');
  }

  return unique(values).slice(0, 5);
};

const buildFirstComment = ({ caption, refinementPrompt }) => (
  applyRefinement(
    `Sound off: which operator or loadout are you bringing into the next Delta Force match?`,
    refinementPrompt || caption,
  )
);

const buildAltText = ({ mediaSummary }) => (
  `Delta Force promotional ${/video/i.test(mediaSummary) ? 'video still' : 'image'} showing ${mediaSummary}.`
);

const buildThreadsAltText = ({ mediaSummary }) => (
  `Delta Force Threads video about ${mediaSummary}.`
);

const buildSubtitleText = ({ caption, mediaSummary }) => {
  const lines = [
    shortenText(caption) || `Delta Force update featuring ${mediaSummary}.`,
    'Squad up, watch the clip, and drop your loadout below.',
    'Garena Delta Force VN.',
  ];

  return [
    '1',
    '00:00:00,000 --> 00:00:02,200',
    lines[0],
    '',
    '2',
    '00:00:02,200 --> 00:00:04,800',
    lines[1],
    '',
    '3',
    '00:00:04,800 --> 00:00:06,800',
    lines[2],
  ].join('\n');
};

const buildYouTubeTitle = ({ mediaSummary, caption, refinementPrompt }) => (
  applyRefinement(
    `Delta Force VN | ${toSentenceCase(shortenText(mediaSummary || caption || 'Gameplay update'))}`,
    refinementPrompt,
  )
);

const buildYouTubeTags = ({ mediaSummary, caption }) => unique([
  'Delta Force',
  'Delta Force VN',
  /warfare/i.test(`${mediaSummary} ${caption}`) ? 'Delta Force Warfare' : 'Delta Force Operators',
  /loadout|arsenal/i.test(`${mediaSummary} ${caption}`) ? 'Delta Force Loadout' : 'Gameplay',
]).slice(0, 5);

const pickLabels = ({ tagCollections = [], caption = '', hasVideo = false }) => {
  const allTags = unique(tagCollections.flatMap((collection) => collection.tags || []));
  const preferred = ['Delta Force VN'];

  if (hasVideo) {
    preferred.push('Video');
  }

  if (/event|season|reward|drop/i.test(caption)) {
    preferred.push('Event');
  } else {
    preferred.push('Community');
  }

  if (/campaign|launch|update/i.test(caption)) {
    preferred.push('Campaign');
  }

  return preferred.filter((tag) => allTags.includes(tag)).slice(0, 3);
};

const pickApprovalWorkflow = ({ workflowOptions = [] }) => (
  workflowOptions.find((option) => /marketing/i.test(option.label || ''))?.value
  || workflowOptions[0]?.value
  || null
);

const pickMobilePublisher = ({ publisherOptions = [] }) => publisherOptions[0]?.value || null;

const buildScheduleTimes = ({ scheduleByNetwork = false, selectedNetworks = [] }) => {
  const scheduleDate = dayjs().add(1, 'day').startOf('day');
  const scheduleTime = dayjs().hour(20).minute(0).second(0).millisecond(0);
  const defaultSlot = { date: scheduleDate, time: scheduleTime };

  if (!scheduleByNetwork) {
    return [defaultSlot];
  }

  return selectedNetworks.map(() => ({ ...defaultSlot }));
};

const buildValidationNotes = ({ context }) => {
  const notes = [];

  if (context.selectedNetworks.includes('youtube') && !context.youtubeTitle.trim()) {
    notes.push('YouTube title is still empty before AI apply.');
  }

  if (context.selectedNetworks.includes('youtube') && !context.youtubeAudience) {
    notes.push('YouTube audience selection is missing.');
  }

  if (!context.isDraft && context.scheduleMode === 'specific' && context.scheduledTimes.some((slot) => !slot?.date || !slot?.time)) {
    notes.push('Schedule date or time is missing.');
  }

  if (!notes.length) {
    notes.push('No obvious validation blockers were found in the current Delta Force draft.');
  }

  return notes;
};

const buildPreviewNotes = ({ caption, hashtags, selectedNetworks = [] }) => {
  const notes = [];

  if (caption.length > 2200 && selectedNetworks.includes('instagram')) {
    notes.push('Instagram caption may be too long.');
  }

  if (hashtags.length > 5) {
    notes.push('Hashtag set looks heavier than needed.');
  }

  if (!notes.length) {
    notes.push('Preview looks coherent for the current network mix.');
  }

  return notes;
};

const createSectionResult = ({
  key,
  preview,
  patch = null,
  sectionConfig = null,
  snapshot,
  warnings = [],
}) => {
  const section = getNewPostAiSection(key);
  const fallbackSectionConfig = sectionConfig || resolveNewPostAiConfig({ sectionKeys: [key] }).sections[0] || null;
  const provenance = buildResultProvenance({ section, sectionConfig: fallbackSectionConfig });
  const status = !patch
    ? warnings.length ? 'generated' : 'generated'
    : !doesAiPatchChangeSnapshot(snapshot, patch) || isAiPatchEmptyTarget(snapshot, patch)
      ? 'applied'
      : 'needs-review';

  return {
    key,
    group: section?.group || null,
    groupKey: section?.groupKey || null,
    label: section?.label || key,
    description: section?.description || '',
    userDescription: section?.userDescription || section?.description || '',
    preview,
    patch,
    patchSummary: patch ? describeAiPatch(patch) : null,
    activeKnowledge: provenance.activeKnowledge,
    activeSkills: provenance.activeSkills,
    linkedKnowledge: provenance.linkedKnowledge,
    linkedSkills: provenance.linkedSkills,
    usedKnowledge: provenance.usedKnowledge,
    usedSkills: provenance.usedSkills,
    warnings,
    status,
  };
};

const createSkippedResult = (key, message, sectionConfig = null) => {
  const section = getNewPostAiSection(key);
  const fallbackSectionConfig = sectionConfig || resolveNewPostAiConfig({ sectionKeys: [key] }).sections[0] || null;
  const provenance = buildResultProvenance({ section, sectionConfig: fallbackSectionConfig });

  return {
    key,
    group: section?.group || null,
    groupKey: section?.groupKey || null,
    label: section?.label || key,
    description: section?.description || '',
    userDescription: section?.userDescription || section?.description || '',
    preview: message,
    patch: null,
    patchSummary: null,
    activeKnowledge: provenance.activeKnowledge,
    activeSkills: provenance.activeSkills,
    linkedKnowledge: provenance.linkedKnowledge,
    linkedSkills: provenance.linkedSkills,
    usedKnowledge: provenance.usedKnowledge,
    usedSkills: provenance.usedSkills,
    warnings: [message],
    status: 'skipped',
  };
};

const createNeedsSetupResult = (key, sectionConfig = null) => {
  const section = getNewPostAiSection(key);
  const fallbackSectionConfig = sectionConfig || resolveNewPostAiConfig({ sectionKeys: [key] }).sections[0] || null;
  const provenance = buildResultProvenance({ section, sectionConfig: fallbackSectionConfig });
  const warnings = sectionConfig?.setupWarnings?.length
    ? sectionConfig.setupWarnings
    : ['AI configuration is incomplete for this section.'];

  return {
    key,
    group: section?.group || null,
    groupKey: section?.groupKey || null,
    label: section?.label || key,
    description: section?.description || '',
    userDescription: section?.userDescription || section?.description || '',
    preview: 'This section needs at least one active skill and one active knowledge pack before AI Assist can generate output.',
    patch: null,
    patchSummary: null,
    activeKnowledge: provenance.activeKnowledge,
    activeSkills: provenance.activeSkills,
    linkedKnowledge: provenance.linkedKnowledge,
    linkedSkills: provenance.linkedSkills,
    usedKnowledge: provenance.usedKnowledge,
    usedSkills: provenance.usedSkills,
    warnings,
    status: 'needs-setup',
  };
};

export const runNewPostAiAssist = ({
  context,
  refinementPrompt = '',
  resolvedConfig = null,
  selectedSectionKeys,
}) => {
  const effectiveConfig = resolvedConfig || resolveNewPostAiConfig({ sectionKeys: selectedSectionKeys });
  const sectionConfigByKey = new Map((effectiveConfig.sections || []).map((section) => [section.key, section]));
  const baseCaption = buildBaseCaption({
    mediaSummary: summarizeMedia(context.media),
    refinementPrompt,
    selectedNetworks: context.selectedNetworks,
  });
  const perNetworkCaptions = buildPerNetworkCaptions({
    baseCaption,
    selectedNetworks: context.selectedNetworks,
    refinementPrompt,
  });
  const hashtags = buildHashtags({ caption: baseCaption, selectedNetworks: context.selectedNetworks });
  const snapshot = createComposerSnapshot(context);
  const mediaSummary = summarizeMedia(context.media);
  const hasImage = context.media.some((item) => item.type === 'image');
  const hasVideo = context.media.some((item) => item.type === 'video');

  const sections = selectedSectionKeys.map((sectionKey) => {
    const sectionConfig = sectionConfigByKey.get(sectionKey);

    if (sectionConfig && !sectionConfig.hasRequiredAssets) {
      return createNeedsSetupResult(sectionKey, sectionConfig);
    }

    switch (sectionKey) {
      case 'captionBase':
        return createSectionResult({
          key: sectionKey,
          preview: baseCaption,
          patch: {
            captions: {
              [context.mode === 'per_network' ? context.activeNetwork : 'all']: baseCaption,
            },
          },
          snapshot,
        });
      case 'captionPerNetwork':
        return createSectionResult({
          key: sectionKey,
          preview: Object.entries(perNetworkCaptions)
            .map(([networkKey, value]) => `${toSentenceCase(networkKey)}: ${value}`)
            .join('\n'),
          patch: {
            captions: perNetworkCaptions,
          },
          snapshot,
        });
      case 'hashtags':
        return createSectionResult({
          key: sectionKey,
          preview: hashtags.join(' '),
          patch: null,
          warnings: ['Hashtags are generated as guidance because the current composer has no dedicated hashtag field.'],
          snapshot,
        });
      case 'firstComment':
        return createSectionResult({
          key: sectionKey,
          preview: buildFirstComment({ caption: baseCaption, refinementPrompt }),
          patch: {
            firstComment: buildFirstComment({ caption: baseCaption, refinementPrompt }),
          },
          snapshot,
        });
      case 'imageAltText':
        return hasImage
          ? createSectionResult({
            key: sectionKey,
            preview: buildAltText({ mediaSummary }),
            patch: null,
            warnings: ['Use the generated alt text in the image alt-text modal, because per-image storage is currently modal-local.'],
            snapshot,
          })
          : createSkippedResult(sectionKey, 'Skipped because there is no uploaded image to describe.');
      case 'threadsAltText':
        return hasVideo && context.selectedNetworks.includes('threads')
          ? createSectionResult({
            key: sectionKey,
            preview: buildThreadsAltText({ mediaSummary }),
            patch: {
              videoDetails: {
                threadsAltText: buildThreadsAltText({ mediaSummary }),
              },
            },
            snapshot,
          })
          : createSkippedResult(sectionKey, 'Skipped because Threads video alt text only applies to Threads video posts.');
      case 'subtitles':
        return hasVideo
          ? createSectionResult({
            key: sectionKey,
            preview: buildSubtitleText({ caption: baseCaption, mediaSummary }),
            patch: {
              videoDetails: {
                subtitles: 'auto',
                subtitleFileName: 'generated-caption.srt',
                subtitleLanguage: 'English (United States)',
                subtitleText: buildSubtitleText({ caption: baseCaption, mediaSummary }),
              },
            },
            snapshot,
          })
          : createSkippedResult(sectionKey, 'Skipped because there is no uploaded video for subtitle generation.');
      case 'youtubeTitle':
        return hasVideo && context.selectedNetworks.includes('youtube')
          ? createSectionResult({
            key: sectionKey,
            preview: buildYouTubeTitle({ mediaSummary, caption: baseCaption, refinementPrompt }),
            patch: {
              youtubeTitle: buildYouTubeTitle({ mediaSummary, caption: baseCaption, refinementPrompt }),
            },
            snapshot,
          })
          : createSkippedResult(sectionKey, 'Skipped because YouTube title generation only applies to YouTube video posts.');
      case 'youtubeTags':
        return hasVideo && context.selectedNetworks.includes('youtube')
          ? createSectionResult({
            key: sectionKey,
            preview: buildYouTubeTags({ mediaSummary, caption: baseCaption }).join(', '),
            patch: {
              videoDetails: {
                youtubeTags: buildYouTubeTags({ mediaSummary, caption: baseCaption }),
              },
            },
            snapshot,
          })
          : createSkippedResult(sectionKey, 'Skipped because YouTube tags only apply to YouTube video posts.');
      case 'facebookVideoOptions':
        return hasVideo && context.selectedNetworks.includes('facebook')
          ? createSectionResult({
            key: sectionKey,
            preview: 'Standard post + Video Games category',
            patch: {
              videoDetails: {
                facebookPlacement: 'standard',
                facebookCategory: 'Video Games',
              },
            },
            snapshot,
          })
          : createSkippedResult(sectionKey, 'Skipped because Facebook video options only apply to Facebook video posts.');
      case 'instagramOptions':
        return context.selectedNetworks.includes('instagram')
          ? createSectionResult({
            key: sectionKey,
            preview: hasVideo
              ? 'Share Reel to profile feed, keep trial reel disabled.'
              : 'No Instagram-specific video option changes are needed for image posts.',
            patch: hasVideo ? {
              videoDetails: {
                instagramTrialReel: false,
                instagramTrialReelAutoPublish: false,
                instagramShareToFeed: true,
              },
            } : null,
            snapshot,
          })
          : createSkippedResult(sectionKey, 'Skipped because Instagram options only apply when Instagram is selected.');
      case 'threadsOptions':
        return context.selectedNetworks.includes('threads')
          ? createSectionResult({
            key: sectionKey,
            preview: 'Reply control: Anyone',
            patch: {
              videoDetails: {
                threadsReplyControl: 'anyone',
              },
            },
            snapshot,
          })
          : createSkippedResult(sectionKey, 'Skipped because Threads is not selected.');
      case 'youtubeOptions':
        return hasVideo && context.selectedNetworks.includes('youtube')
          ? createSectionResult({
            key: sectionKey,
            preview: 'Category: Gaming, Audience: Not made for kids, Age restriction: Not restricted',
            patch: {
              youtubeAudience: 'not-made-for-kids',
              videoDetails: {
                youtubeCategory: 'Gaming',
                youtubeAgeRestriction: 'not-restricted',
                youtubeLicense: 'standard',
                youtubeEmbedding: true,
                youtubeNotifySubscribers: true,
              },
            },
            snapshot,
          })
          : createSkippedResult(sectionKey, 'Skipped because YouTube options only apply to YouTube video posts.');
      case 'tiktokOptions':
        return context.selectedNetworks.includes('tiktok')
          ? createSectionResult({
            key: sectionKey,
            preview: 'Allow comments, duets, and stitches',
            patch: {
              videoDetails: {
                tiktokAllowComments: true,
                tiktokAllowDuets: true,
                tiktokAllowStitches: true,
              },
            },
            snapshot,
          })
          : createSkippedResult(sectionKey, 'Skipped because TikTok is not selected.');
      case 'approvalWorkflow':
        return createSectionResult({
          key: sectionKey,
          preview: pickApprovalWorkflow({ workflowOptions: context.workflowOptions }),
          patch: pickApprovalWorkflow({ workflowOptions: context.workflowOptions })
            ? { approvalWorkflow: pickApprovalWorkflow({ workflowOptions: context.workflowOptions }) }
            : null,
          warnings: context.workflowOptions.length ? [] : ['No enabled approval workflows are available in the local store.'],
          snapshot,
        });
      case 'mobilePublisher':
        return createSectionResult({
          key: sectionKey,
          preview: pickMobilePublisher({ publisherOptions: context.publisherOptions }),
          patch: pickMobilePublisher({ publisherOptions: context.publisherOptions })
            ? { mobilePublisher: pickMobilePublisher({ publisherOptions: context.publisherOptions }) }
            : null,
          warnings: context.publisherOptions.length ? [] : ['No eligible mobile publishers are available in the local store.'],
          snapshot,
        });
      case 'labels': {
        const nextLabels = pickLabels({ tagCollections: context.tagCollections, caption: baseCaption, hasVideo });
        return createSectionResult({
          key: sectionKey,
          preview: nextLabels.join(', ') || 'No matching local tags found.',
          patch: nextLabels.length ? { labels: nextLabels } : null,
          warnings: nextLabels.length ? [] : ['No matching local tags were found in the current managed Tag Groups.'],
          snapshot,
        });
      }
      case 'schedule':
        return context.isDraft
          ? createSectionResult({
            key: sectionKey,
            preview: 'Draft mode is active, so no schedule patch was applied.',
            patch: null,
            warnings: ['Schedule suggestions are skipped while the post is in draft mode.'],
            snapshot,
          })
          : createSectionResult({
            key: sectionKey,
            preview: buildScheduleTimes({
              scheduleByNetwork: context.scheduleByNetwork,
              selectedNetworks: context.selectedNetworks,
            }).map((slot, index) => `${context.scheduleByNetwork ? `Slot ${index + 1}` : 'Scheduled'}: ${slot.date} ${slot.time}`).join('\n'),
            patch: {
              scheduleMode: 'specific',
              scheduledTimes: buildScheduleTimes({
                scheduleByNetwork: context.scheduleByNetwork,
                selectedNetworks: context.selectedNetworks,
              }),
            },
            snapshot,
          });
      case 'validation':
        return createSectionResult({
          key: sectionKey,
          preview: buildValidationNotes({ context }).join('\n'),
          patch: null,
          warnings: buildValidationNotes({ context }),
          snapshot,
        });
      case 'previewQA':
        return createSectionResult({
          key: sectionKey,
          preview: buildPreviewNotes({ caption: baseCaption, hashtags, selectedNetworks: context.selectedNetworks }).join('\n'),
          patch: null,
          warnings: buildPreviewNotes({ caption: baseCaption, hashtags, selectedNetworks: context.selectedNetworks }),
          snapshot,
        });
      default:
        return createSkippedResult(sectionKey, 'Skipped because this AI section is not registered.');
    }
  });

  return {
    configSummary: effectiveConfig.summary,
    contextSummary: {
      mediaSummary,
      selectedNetworks: context.selectedNetworks,
    },
    resolvedConfig: effectiveConfig,
    sections,
    selectedSections: effectiveConfig.sections || getNewPostAiSections(selectedSectionKeys),
  };
};
