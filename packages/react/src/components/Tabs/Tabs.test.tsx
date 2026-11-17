import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { type TabItem, Tabs } from './Tabs.js';

const items: TabItem[] = [
  { value: 'overview', label: 'Overview', content: 'Overview panel' },
  { value: 'activity', label: 'Activity', content: 'Activity panel' },
  { value: 'billing', label: 'Billing', content: 'Billing panel', disabled: true },
  { value: 'settings', label: 'Settings', content: 'Settings panel' },
];

const selected = (name: string) =>
  screen.getByRole('tab', { name }).getAttribute('aria-selected') === 'true';

describe('Tabs', () => {
  it('selects the first tab by default and shows its labelled panel', () => {
    render(<Tabs items={items} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(selected('Overview')).toBe(true);
    expect(screen.getByRole('tabpanel', { name: 'Overview' })).toHaveTextContent('Overview panel');
  });

  it('switches tab and panel on click and reports the value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Tabs items={items} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('tab', { name: 'Activity' }));
    expect(selected('Activity')).toBe(true);
    expect(screen.getByRole('tabpanel', { name: 'Activity' })).toHaveTextContent('Activity panel');
    expect(onValueChange).toHaveBeenLastCalledWith('activity');
  });

  // ARIA tabs pattern: a disabled tab stays focusable (so it can be discovered) but
  // can't be activated.
  it('moves between tabs with the arrow keys; a disabled tab is focusable, not selectable', async () => {
    const user = userEvent.setup();
    render(<Tabs items={items} defaultValue="activity" />);
    await user.click(screen.getByRole('tab', { name: 'Activity' }));
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Billing' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(selected('Billing')).toBe(false);
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(selected('Settings')).toBe(true);
  });

  it('does not select a disabled tab', async () => {
    const user = userEvent.setup();
    render(<Tabs items={items} />);
    await user.click(screen.getByRole('tab', { name: 'Billing' }));
    expect(selected('Billing')).toBe(false);
    expect(selected('Overview')).toBe(true);
  });

  it('follows the value when controlled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Tabs items={items} value="overview" onValueChange={onValueChange} />,
    );
    await user.click(screen.getByRole('tab', { name: 'Activity' }));
    expect(onValueChange).toHaveBeenCalledWith('activity');
    expect(selected('Overview')).toBe(true);

    rerender(<Tabs items={items} value="activity" onValueChange={onValueChange} />);
    expect(selected('Activity')).toBe(true);
  });
});
