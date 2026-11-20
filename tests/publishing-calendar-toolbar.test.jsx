import { fireEvent, render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import { describe, expect, it, vi } from 'vitest';
import { CalendarTopArea } from '../src/pages/PublishingCalendar/PublishingCalendarToolbar';

const noop = () => {};

const renderToolbar = (overrides = {}) => render(
  <CalendarTopArea
    calendarDateLabel="Fri, 1 May 2026"
    calendarRange={[dayjs('2026-05-01'), dayjs('2026-05-04')]}
    density="compact"
    filterBar={<div>Filters panel</div>}
    filtersVisible={false}
    aiAssistOpen={false}
    viewMode="list"
    onChangeDateRange={noop}
    onNavigateNext={noop}
    onNavigatePrevious={noop}
    onNavigateToday={noop}
    onOpenBulkImport={noop}
    onSetDensity={noop}
    onSetViewMode={noop}
    onToggleAiAssist={noop}
    onToggleFilters={noop}
    onToggleVolumeChart={noop}
    {...overrides}
  />,
);

describe('Publishing Calendar toolbar', () => {
  it('opens export actions from the calendar export button', async () => {
    renderToolbar();

    fireEvent.click(screen.getByRole('button', { name: 'Calendar export options' }));

    expect(await screen.findByText('Create shareable link')).toBeInTheDocument();
    expect(screen.getByText('Download PDF')).toBeInTheDocument();
    expect(screen.getByText('Send PDF')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Open calendar in full screen' })).not.toBeInTheDocument();
  }, 10000);

  it('keeps More Actions focused on calendar utility actions', async () => {
    const onOpenBulkImport = vi.fn();
    const onToggleVolumeChart = vi.fn();

    render(
      <CalendarTopArea
        calendarDateLabel="Fri, 1 May 2026"
        calendarRange={[dayjs('2026-05-01'), dayjs('2026-05-04')]}
        density="compact"
        filterBar={<div>Filters panel</div>}
        filtersVisible={false}
        aiAssistOpen={false}
        viewMode="list"
        onChangeDateRange={noop}
        onOpenBulkImport={onOpenBulkImport}
        onSetDensity={noop}
        onSetViewMode={noop}
        onToggleAiAssist={noop}
        onToggleFilters={noop}
        onToggleVolumeChart={onToggleVolumeChart}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'More calendar actions' }));
    fireEvent.click(await screen.findByText('Bulk Post Import'));

    expect(onOpenBulkImport).toHaveBeenCalledTimes(1);
    expect(onToggleVolumeChart).not.toHaveBeenCalled();
  });

  it('uses the AI Assist button to toggle the calendar side panel', () => {
    const onToggleAiAssist = vi.fn();

    render(
      <CalendarTopArea
        calendarDateLabel="Fri, 1 May 2026"
        calendarRange={[dayjs('2026-05-01'), dayjs('2026-05-04')]}
        density="compact"
        filterBar={<div>Filters panel</div>}
        filtersVisible={false}
        aiAssistOpen
        viewMode="list"
        onChangeDateRange={noop}
        onOpenBulkImport={noop}
        onSetDensity={noop}
        onSetViewMode={noop}
        onToggleAiAssist={onToggleAiAssist}
        onToggleFilters={noop}
        onToggleVolumeChart={noop}
      />,
    );

    const aiAssistButton = screen.getByRole('button', { name: 'AI Assist' });

    expect(aiAssistButton).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(aiAssistButton);
    expect(onToggleAiAssist).toHaveBeenCalledTimes(1);
  });

  it('replaces the date picker with period controls in week view', () => {
    const onNavigateNext = vi.fn();
    const onNavigatePrevious = vi.fn();
    const onNavigateToday = vi.fn();

    renderToolbar({
      calendarDateLabel: 'Week of 11 May 2026',
      viewMode: 'week',
      onNavigateNext,
      onNavigatePrevious,
      onNavigateToday,
    });

    expect(screen.getByText('Week of 11 May 2026')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Start date')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Previous week' }));
    fireEvent.click(screen.getByRole('button', { name: 'Today' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next week' }));

    expect(onNavigatePrevious).toHaveBeenCalledTimes(1);
    expect(onNavigateToday).toHaveBeenCalledTimes(1);
    expect(onNavigateNext).toHaveBeenCalledTimes(1);
  });

  it('renders the shared volume chart area below filters in week view', () => {
    renderToolbar({
      calendarDateLabel: 'Week of 11 May 2026',
      filtersVisible: true,
      viewMode: 'week',
      volumeChart: <div>Post Volume</div>,
    });

    expect(screen.getByText('Filters panel')).toBeInTheDocument();
    expect(screen.getByText('Post Volume')).toBeInTheDocument();
  });
});
