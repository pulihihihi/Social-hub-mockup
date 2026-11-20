import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppQueryFilter } from '../src/app/pro/AppQueryFilter';

describe('AppQueryFilter', () => {
  it('renders filter children inside the query filter shell', () => {
    render(
      <AppQueryFilter>
        <button type="button">Search</button>
        <button type="button">Filter</button>
      </AppQueryFilter>,
    );

    expect(screen.getByTestId('mock-query-filter')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Filter')).toBeInTheDocument();
  });
});
