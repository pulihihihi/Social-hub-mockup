import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppStatisticCard } from '../src/app/pro/AppStatisticCard';

describe('AppStatisticCard', () => {
  it('renders statistic title, value, and description', () => {
    render(
      <AppStatisticCard
        statistic={{
          title: 'Total mentions',
          value: 128,
          description: 'vs prev period',
        }}
      />,
    );

    expect(screen.getByText('Total mentions')).toBeInTheDocument();
    expect(screen.getByText('128')).toBeInTheDocument();
    expect(screen.getByText('vs prev period')).toBeInTheDocument();
  });
});
