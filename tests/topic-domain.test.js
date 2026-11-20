import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_TOPIC_UPDATE_FREQUENCY,
  TOPIC_STATUS,
  TOPIC_UPDATE_FREQUENCY,
} from '../src/domain/topic/contracts';
import { buildDuplicateTopicName, createTopicState, topicReducer, TOPIC_ACTIONS } from '../src/domain/topic/topicReducer';
import { selectActiveTopic, selectTopicById } from '../src/domain/topic/selectors';
import { TOPIC_SEED } from '../src/mocks/seeds/topicSeed';

describe('topic domain workflow', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('hydrates initial topic state and selectors from the seed', () => {
    const state = createTopicState(TOPIC_SEED);

    expect(state.activeTopicId).toBe(TOPIC_SEED[0].id);
    expect(selectActiveTopic(state)?.name).toBe('Espresso');
    expect(selectTopicById(state, 't2')?.name).toBe('Brand Health VN');
  });

  it('adds a topic through the reducer and promotes it to active', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-17T10:00:00+07:00'));
    vi.spyOn(Date, 'now').mockReturnValue(1713322800000);

    const state = topicReducer(createTopicState(TOPIC_SEED), {
      type: TOPIC_ACTIONS.ADD_TOPIC,
      payload: {
        name: 'Free Fire Crisis Watch',
        description: 'Escalations around server lag',
        channels: [{ id: 'fb-1', name: 'Garena Free Fire VN' }],
        keywords: ['lag', 'server'],
        alertRules: [{ id: 'rule-1' }],
      },
    });

    const activeTopic = selectActiveTopic(state);

    expect(state.topics).toHaveLength(TOPIC_SEED.length + 1);
    expect(activeTopic).toMatchObject({
      id: 't1713322800000',
      name: 'Free Fire Crisis Watch',
      status: TOPIC_STATUS.ACTIVE,
      description: 'Escalations around server lag',
      updateFrequency: DEFAULT_TOPIC_UPDATE_FREQUENCY,
      keywords: ['lag', 'server'],
    });
    expect(activeTopic.dateRange).toBe('17 Apr 2026 - Present');
  });

  it('updates an existing topic without changing its id or date range', () => {
    const state = topicReducer(createTopicState(TOPIC_SEED), {
      type: TOPIC_ACTIONS.UPDATE_TOPIC,
      payload: {
        id: 't1',
        name: 'Espresso Updated',
        description: 'Updated description',
        updateFrequency: TOPIC_UPDATE_FREQUENCY.ONE_HOUR,
        channels: [{ id: 'yt-1', name: 'Garena Vietnam', platformKey: 'youtube' }],
        keywords: ['espresso', 'latte'],
      },
    });

    expect(selectTopicById(state, 't1')).toMatchObject({
      id: 't1',
      name: 'Espresso Updated',
      description: 'Updated description',
      updateFrequency: TOPIC_UPDATE_FREQUENCY.ONE_HOUR,
      channels: [{ id: 'yt-1', name: 'Garena Vietnam', platformKey: 'youtube' }],
      keywords: ['espresso', 'latte'],
      dateRange: '27 Feb 2026 - Present',
    });
    expect(state.activeTopicId).toBe('t1');
  });

  it('builds a unique duplicate topic name without mutating state', () => {
    expect(buildDuplicateTopicName(TOPIC_SEED, 'Espresso')).toBe('Espresso Copy');
    expect(buildDuplicateTopicName(
      [
        ...TOPIC_SEED,
        { ...TOPIC_SEED[0], id: 't3', name: 'Espresso Copy' },
        { ...TOPIC_SEED[0], id: 't4', name: 'Espresso Copy 2' },
      ],
      'Espresso',
    )).toBe('Espresso Copy 3');
  });

  it('toggles topic status without losing the active selection', () => {
    const state = topicReducer(createTopicState(TOPIC_SEED), {
      type: TOPIC_ACTIONS.SET_TOPIC_STATUS,
      payload: {
        id: 't1',
        status: TOPIC_STATUS.PAUSED,
      },
    });

    expect(selectTopicById(state, 't1')).toMatchObject({
      id: 't1',
      status: TOPIC_STATUS.PAUSED,
    });
    expect(state.activeTopicId).toBe('t1');
  });

  it('deletes the active topic and falls back to the next remaining topic', () => {
    const state = topicReducer(createTopicState(TOPIC_SEED), {
      type: TOPIC_ACTIONS.DELETE_TOPIC,
      payload: 't1',
    });

    expect(state.topics).toHaveLength(1);
    expect(selectTopicById(state, 't1')).toBeNull();
    expect(state.activeTopicId).toBe('t2');
  });
});
