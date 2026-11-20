import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AppProTable } from '../src/app/pro/AppProTable';
import { T } from '../src/theme';

describe('AppProTable', () => {
  it('renders row selection alert actions using the shared selection bar', async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();

    render(
      <AppProTable
        columns={[
          { title: 'Name', dataIndex: 'name' },
        ]}
        dataSource={[
          { id: 1, name: 'Alice' },
        ]}
        rowSelection={{}}
        alertActions={[
          <a key="delete" onClick={handleDelete}>
            Delete
          </a>,
        ]}
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    const alertBar = screen.getByTestId('app-pro-table-alert');
    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    const deselectButton = screen.getByRole('button', { name: 'Deselect' });

    expect(alertBar).toHaveStyle({
      background: T.colorPrimaryBg,
      marginBottom: '0px',
    });
    expect(alertBar).toHaveStyle({
      borderBottom: `1px solid ${T.colorPrimaryBorder}`,
    });
    expect(screen.getByText('1 selected')).toBeInTheDocument();
    expect(deleteButton).toHaveClass('app-pro-table-alert-action', 'app-pro-table-alert-action-danger');
    expect(deselectButton).toHaveClass('app-pro-table-alert-clear');
  });
});
