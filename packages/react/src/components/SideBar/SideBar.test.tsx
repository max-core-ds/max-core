import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EntityCard } from '../EntityCard/EntityCard.js';
import { EntityItem } from '../EntityItem/EntityItem.js';
import { ListItem } from '../ListItem/ListItem.js';
import { SideBar, type SideBarProps } from './SideBar.js';
import { SideBarTrigger } from './SideBarTrigger.js';

function Rail(props: SideBarProps) {
  return (
    <SideBar
      aria-label="Main"
      topBar={
        <SideBarTrigger>
          <svg aria-hidden="true" />
        </SideBarTrigger>
      }
      footer={
        <EntityCard>
          <EntityItem title="Ada Lovelace" />
        </EntityCard>
      }
      {...props}
    >
      <ListItem leftIcon={<svg aria-hidden="true" />} active>
        Dashboard
      </ListItem>
      <ListItem leftIcon={<svg aria-hidden="true" />}>Reports</ListItem>
    </SideBar>
  );
}

describe('SideBar', () => {
  it('collapses and expands from SideBarTrigger, reporting each change', async () => {
    const user = userEvent.setup();
    const onCollapsedChange = vi.fn();
    render(<Rail onCollapsedChange={onCollapsedChange} />);

    const trigger = screen.getByRole('button', { name: 'Collapse sidebar' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Dashboard')).toBeVisible();

    await user.click(trigger);
    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await user.click(screen.getByRole('button', { name: 'Expand sidebar' }));
    expect(onCollapsedChange.mock.calls.map((c) => c[0])).toEqual([true, false]);
  });

  // Phase 6.2 regression: collapsed rail items were icon-only buttons with no name.
  it('keeps every rail button named when collapsed', () => {
    render(<Rail defaultCollapsed />);
    expect(screen.getByRole('button', { name: 'Dashboard' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Reports' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ada Lovelace' })).toBeInTheDocument();
    for (const button of screen.getAllByRole('button')) {
      expect(button).toHaveAccessibleName();
    }
  });

  it('follows `collapsed` when controlled', async () => {
    const user = userEvent.setup();
    const onCollapsedChange = vi.fn();
    const { rerender } = render(<Rail collapsed={false} onCollapsedChange={onCollapsedChange} />);
    await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('button', { name: 'Collapse sidebar' })).toBeInTheDocument();

    rerender(<Rail collapsed onCollapsedChange={onCollapsedChange} />);
    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toBeInTheDocument();
  });
});
