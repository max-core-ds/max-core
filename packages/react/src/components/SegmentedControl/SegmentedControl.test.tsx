import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SegmentedControl, type SegmentedItem } from './SegmentedControl.js';

const items: SegmentedItem[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month', disabled: true },
];

const pressed = (name: string) =>
  screen.getByRole('button', { name }).getAttribute('aria-pressed') === 'true';

describe('SegmentedControl', () => {
  it('is a named group with the default segment pressed', () => {
    render(<SegmentedControl aria-label="Range" items={items} defaultValue="day" />);
    expect(screen.getByRole('group', { name: 'Range' })).not.toHaveAttribute('aria-orientation');
    expect(pressed('Day')).toBe(true);
    expect(pressed('Week')).toBe(false);
  });

  it('selects another segment and reports it', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        aria-label="Range"
        items={items}
        defaultValue="day"
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Week' }));
    expect(pressed('Week')).toBe(true);
    expect(pressed('Day')).toBe(false);
    expect(onValueChange).toHaveBeenLastCalledWith('week');
  });

  // Phase 4.5 regression: clicking the active segment cleared the selection.
  it('keeps exactly one segment selected when the active one is clicked', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        aria-label="Range"
        items={items}
        defaultValue="day"
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Day' }));
    expect(pressed('Day')).toBe(true);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('follows the value when controlled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <SegmentedControl
        aria-label="Range"
        items={items}
        value="day"
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Week' }));
    expect(onValueChange).toHaveBeenCalledWith('week');
    expect(pressed('Day')).toBe(true);

    rerender(
      <SegmentedControl
        aria-label="Range"
        items={items}
        value="week"
        onValueChange={onValueChange}
      />,
    );
    expect(pressed('Week')).toBe(true);
  });

  it('does not select a disabled segment', async () => {
    const user = userEvent.setup();
    render(<SegmentedControl aria-label="Range" items={items} defaultValue="day" />);
    const month = screen.getByRole('button', { name: 'Month' });
    expect(month).toBeDisabled();
    await user.click(month);
    expect(pressed('Day')).toBe(true);
  });
});
