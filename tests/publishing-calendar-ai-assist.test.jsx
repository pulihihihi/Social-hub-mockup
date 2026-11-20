import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CalendarAiAssistPanel } from '../src/pages/PublishingCalendar';

describe('Publishing Calendar AI Assist panel', () => {
  it('renders the assistant side panel with chat starter copy', () => {
    render(<CalendarAiAssistPanel onClose={vi.fn()} />);

    expect(screen.getByRole('complementary', { name: 'Calendar AI Assist' })).toBeInTheDocument();
    expect(screen.getByText("Hi Hai-Son! I'm here to help you generate posts.")).toBeInTheDocument();
    expect(screen.getByText('AI actions')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tell AI Assist what to do next...' })).toBeInTheDocument();
  }, 10000);

  it('opens the AI actions menu from the footer trigger', async () => {
    render(<CalendarAiAssistPanel onClose={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Tell AI Assist what to do next...' }));

    expect(await screen.findByText('Generate from Top performing posts')).toBeInTheDocument();
    expect(screen.getByText('Generate from Custom topic')).toBeInTheDocument();
    expect(screen.getByText('Generate from Article')).toBeInTheDocument();
    expect(screen.getByText('Generate more')).toBeInTheDocument();
    expect(screen.getByText('Make confident')).toBeInTheDocument();
    expect(screen.getByText('Make friendly')).toBeInTheDocument();
    expect(screen.getByText('Make professional')).toBeInTheDocument();
    expect(screen.getByText('Translate')).toBeInTheDocument();
  });

  it('closes from the panel header close button', () => {
    const onClose = vi.fn();

    render(<CalendarAiAssistPanel onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Close AI Assist' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
