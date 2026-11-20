import { useState } from 'react';
import dayjs from 'dayjs';
import {
  Alert,
  Button,
  DatePicker,
  Popover,
  Radio,
  Select,
  Switch,
  Tooltip,
  Typography,
} from 'antd';
import {
  CalendarOutlined,
  DeleteOutlined,
  DownOutlined,
  PlusOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { PlatformIcon } from '../../components/SharedBadges';
import {
  SCHEDULE_HOUR_OPTIONS,
  SCHEDULE_MINUTE_OPTIONS,
  SCHEDULE_PERIOD_OPTIONS,
} from './publishingComposerConfig';
import { getPlatformMeta } from './publishingComposerUtils';
import { applyOptimalTimeToDate, canUseOptimalTimes } from './publishingScheduleUtils';

const { Text } = Typography;

export const PublishingScheduleHeader = ({ isDraft, scheduleMode, onScheduleModeChange }) => (
  <span className="publishing-new-post-schedule-header">
    <Text strong>{isDraft ? 'Show draft on calendar (optional)' : 'When to post'}</Text>
    {!isDraft ? (
      <Select
        className="publishing-new-post-schedule-mode-select"
        value={scheduleMode}
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
        onChange={onScheduleModeChange}
        options={[
          { value: 'immediate', label: 'Immediately' },
          { value: 'queue', label: 'Auto-schedule with Sprout Queue' },
          { value: 'specific', label: 'Specific Days & Times' },
        ]}
      />
    ) : null}
  </span>
);

export const PublishingScheduleSection = ({
  isDraft,
  mode,
  networkKeys,
  onOpenResource,
  scheduleByNetwork,
  scheduleMode,
  scheduledTimes,
  setScheduleByNetwork,
  setScheduledTimes,
}) => {
  const [advancedSchedulingOpen, setAdvancedSchedulingOpen] = useState(false);
  const [queuePlacement, setQueuePlacement] = useState('last');
  const [timeZone, setTimeZone] = useState('asia-bangkok');
  const showScheduleByNetwork = mode === 'per_network' && networkKeys.length > 1;
  const shouldUseNetworkSchedule = !isDraft && showScheduleByNetwork && scheduleByNetwork;

  const updateScheduledTime = (index, patch) => {
    setScheduledTimes((currentTimes) => (
      currentTimes.map((time, timeIndex) => (
        timeIndex === index ? { ...time, ...patch } : time
      ))
    ));
  };
  const getScheduleTimeParts = (time) => {
    if (!time) {
      return { hour: undefined, minute: undefined, period: undefined };
    }

    const hour24 = time.hour();
    const hour12 = hour24 % 12 || 12;
    return {
      hour: String(hour12),
      minute: time.format('mm'),
      period: hour24 >= 12 ? 'PM' : 'AM',
    };
  };
  const updateScheduledTimePart = (index, part, value) => {
    const currentTime = scheduledTimes[index]?.time || dayjs().hour(0).minute(0).second(0);
    const currentParts = getScheduleTimeParts(currentTime);
    const nextParts = { ...currentParts, [part]: value };
    const hour12 = Number(nextParts.hour || '12');
    const minute = Number(nextParts.minute || '00');
    const period = nextParts.period || 'AM';
    const hour24 = period === 'PM'
      ? (hour12 === 12 ? 12 : hour12 + 12)
      : (hour12 === 12 ? 0 : hour12);

    updateScheduledTime(index, {
      time: currentTime.hour(hour24).minute(minute).second(0),
    });
  };
  const renderTimeSelects = (time, index) => {
    const parts = getScheduleTimeParts(time);

    return (
      <div className="publishing-new-post-time-parts">
        <Select
          value={parts.hour}
          placeholder="-"
          options={SCHEDULE_HOUR_OPTIONS}
          onChange={(hour) => updateScheduledTimePart(index, 'hour', hour)}
        />
        <span>:</span>
        <Select
          value={parts.minute}
          placeholder="-"
          options={SCHEDULE_MINUTE_OPTIONS}
          onChange={(minute) => updateScheduledTimePart(index, 'minute', minute)}
        />
        <Select
          value={parts.period}
          placeholder="-"
          options={SCHEDULE_PERIOD_OPTIONS}
          onChange={(period) => updateScheduledTimePart(index, 'period', period)}
        />
      </div>
    );
  };
  const pickOptimalTime = (index, timeValue) => {
    updateScheduledTime(index, {
      time: applyOptimalTimeToDate(scheduledTimes[index]?.date, timeValue),
    });
  };
  const optimalTimesContent = (index) => (
    <div className="publishing-new-post-optimal-times">
      <Text strong>Use Optimal Times</Text>
      {['09:30', '13:15', '20:00'].map((timeValue) => (
        <Button key={timeValue} onClick={() => pickOptimalTime(index, timeValue)}>
          {timeValue}
        </Button>
      ))}
    </div>
  );
  const renderOptimalTimeButton = (time, index, className) => {
    const isEligible = canUseOptimalTimes(time);
    const button = (
      <Button
        aria-label="Use Optimal Times"
        className={className}
        disabled={!isEligible}
        type="link"
      >
        Use Optimal Times <DownOutlined />
      </Button>
    );

    if (!isEligible) {
      return (
        <Tooltip title="Choose a date before using optimal times.">
          <span className="publishing-new-post-disabled-trigger">{button}</span>
        </Tooltip>
      );
    }

    return (
      <Popover trigger="click" content={optimalTimesContent(index)}>
        {button}
      </Popover>
    );
  };
  const renderScheduleRow = (time, index) => (
    <div key={index} className="publishing-new-post-schedule-row">
      <label>
        <Text>Date</Text>
        <DatePicker
          value={time.date}
          onChange={(date) => updateScheduledTime(index, { date })}
          placeholder="D/M/YYYY"
          suffixIcon={<CalendarOutlined />}
        />
      </label>
      <label>
        <Text>Time</Text>
        {renderTimeSelects(time.time, index)}
      </label>
      {renderOptimalTimeButton(time, index, 'publishing-new-post-schedule-optimal-button')}
      <Button
        type="text"
        icon={<DeleteOutlined />}
        aria-label="Delete scheduled time"
        disabled={scheduledTimes.length === 1}
        onClick={() => {
          setScheduledTimes((currentTimes) => (
            currentTimes.length === 1
              ? currentTimes
              : currentTimes.filter((_, rowIndex) => rowIndex !== index)
          ));
        }}
      />
    </div>
  );
  const handleScheduleByNetworkChange = (checked) => {
    setScheduleByNetwork(checked);

    if (checked) {
      setScheduledTimes((currentTimes) => {
        if (currentTimes.length >= networkKeys.length) {
          return currentTimes;
        }

        const fallbackTime = currentTimes[0] || { date: null, time: null };
        return Array.from(
          { length: networkKeys.length },
          (_, index) => currentTimes[index] || { ...fallbackTime },
        );
      });
    }
  };

  if (!isDraft && scheduleMode === 'queue') {
    return (
      <Radio.Group
        className="publishing-new-post-queue-options"
        value={queuePlacement}
        onChange={(event) => setQueuePlacement(event.target.value)}
      >
        <Radio value="next">Queue Next</Radio>
        <Radio value="last">Queue Last</Radio>
      </Radio.Group>
    );
  }

  if (!isDraft && scheduleMode !== 'specific') {
    return (
      <Alert
        type="info"
        showIcon
        message={scheduleMode === 'queue' ? 'This post will use queue settings.' : 'This post will publish immediately when scheduled.'}
      />
    );
  }

  return (
    <div className="publishing-new-post-schedule-list">
      {!shouldUseNetworkSchedule ? (
        <div className="publishing-new-post-schedule-primary">
          {scheduledTimes.map(renderScheduleRow)}
          <div className="publishing-new-post-schedule-actions">
            <Button
              type="link"
              icon={<PlusOutlined />}
              onClick={() => setScheduledTimes((currentTimes) => [...currentTimes, { date: null, time: null }])}
            >
              Add more scheduled times
            </Button>
          </div>
          <div className="publishing-new-post-schedule-secondary">
            <Button
              type="link"
              onClick={() => setAdvancedSchedulingOpen((open) => !open)}
            >
              Advanced Scheduling {advancedSchedulingOpen ? <UpOutlined /> : <DownOutlined />}
            </Button>
            <Text type="secondary">
              Need to schedule a lot at once?{' '}
              <Button type="link" onClick={() => onOpenResource?.('bulkScheduling')}>
                Try Bulk Scheduling
              </Button>
            </Text>
          </div>
          {advancedSchedulingOpen ? (
            <label className="publishing-new-post-timezone-field">
              <Text>Time zone</Text>
              <Select
                value={timeZone}
                onChange={setTimeZone}
                options={[
                  { value: 'asia-bangkok', label: 'Bangkok, Hanoi, Jakarta (UTC +07:00)' },
                  { value: 'asia-singapore', label: 'Kuala Lumpur, Singapore (UTC +08:00)' },
                  { value: 'asia-manila', label: 'Manila (UTC +08:00)' },
                ]}
              />
            </label>
          ) : null}
        </div>
      ) : (
        <div className="publishing-new-post-network-schedule-list">
          {networkKeys.map((networkKey, index) => {
            const network = getPlatformMeta(networkKey);
            const time = scheduledTimes[index] || scheduledTimes[0] || { date: null, time: null };
            return (
              <div key={networkKey} className="publishing-new-post-network-schedule-row">
                <div className="publishing-new-post-network-schedule-name">
                  <span><PlatformIcon platform={network.key} size="row" /></span>
                  <Text strong>{network.label}</Text>
                </div>
                <label>
                  <Text>Date</Text>
                  <DatePicker
                    value={time.date}
                    onChange={(date) => updateScheduledTime(index, { date })}
                    placeholder="D/M/YYYY"
                    suffixIcon={<CalendarOutlined />}
                  />
                </label>
                <label>
                  <Text>Time</Text>
                  {renderTimeSelects(time.time, index)}
                </label>
                {renderOptimalTimeButton(time, index, 'publishing-new-post-network-optimal-button')}
              </div>
            );
          })}
        </div>
      )}
      {!isDraft && showScheduleByNetwork ? (
        <div className="publishing-new-post-schedule-network-toggle">
          <span>
            <Text strong>Schedule by network</Text>
            <Text type="secondary">Set different publish times for each selected network.</Text>
          </span>
          <Switch checked={scheduleByNetwork} onChange={handleScheduleByNetworkChange} />
        </div>
      ) : null}
    </div>
  );
};
