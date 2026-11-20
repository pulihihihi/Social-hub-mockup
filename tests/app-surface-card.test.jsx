import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppSurfaceCard } from '../src/app/pro/AppSurfaceCard';

describe('AppSurfaceCard', () => {
  it('renders title, subtitle, extra content, and body', () => {
    render(
      <AppSurfaceCard title="Section Title" subtitle="Section subtitle" extra={<button type="button">Action</button>}>
        <div>Card body</div>
      </AppSurfaceCard>,
    );

    expect(screen.getByText('Section Title')).toBeInTheDocument();
    expect(screen.getByText('Section subtitle')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Card body')).toBeInTheDocument();
  });
});
