import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppMetaDescriptions } from '../src/app/pro/AppMetaDescriptions';

describe('AppMetaDescriptions', () => {
  it('renders metadata labels and values', () => {
    render(
      <AppMetaDescriptions
        items={[
          { key: 'owner', label: 'Owner', value: 'Hai-Son Tran' },
          { key: 'version', label: 'Version', value: '1.0' },
        ]}
      />,
    );

    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.getByText('Hai-Son Tran')).toBeInTheDocument();
    expect(screen.getByText('Version')).toBeInTheDocument();
    expect(screen.getByText('1.0')).toBeInTheDocument();
  });
});
