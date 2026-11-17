import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switcher, type SwitcherItem } from './Switcher.js';

const items: SwitcherItem[] = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'board', label: 'Board', disabled: true },
];

const pressed = (name: string) =>
  screen.getByRole('button', { name }).getAttribute('aria-pressed') === 'true';

describe('Switcher', () => {
  it('is a named group with the default item pressed', () => {
    render(<Switcher aria-label="Layout" items={items} defaultValue="grid" />);
    expect(screen.getByRole('group', { name: 'Layout' })).not.toHaveAttribute('aria-orientation');
    expect(pressed('Grid')).toBe(true);
  });

  it('switches items and reports the value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Switcher
        aria-label="Layout"
        items={items}
        defaultValue="grid"
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'List' }));
    expect(pressed('List')).toBe(true);
    expect(pressed('Grid')).toBe(false);
    expect(onValueChange).toHaveBeenLastCalledWith('list');
  });

  it('keeps the active item when it is clicked again', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Switcher
        aria-label="Layout"
        items={items}
        defaultValue="grid"
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Grid' }));
    expect(pressed('Grid')).toBe(true);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('follows the value when controlled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Switcher aria-label="Layout" items={items} value="grid" onValueChange={onValueChange} />,
    );
    await user.click(screen.getByRole('button', { name: 'List' }));
    expect(onValueChange).toHaveBeenCalledWith('list');
    expect(pressed('Grid')).toBe(true);

    rerender(
      <Switcher aria-label="Layout" items={items} value="list" onValueChange={onValueChange} />,
    );
    expect(pressed('List')).toBe(true);
  });

  it('does not select a disabled item', async () => {
    const user = userEvent.setup();
    render(<Switcher aria-label="Layout" items={items} defaultValue="grid" />);
    const board = screen.getByRole('button', { name: 'Board' });
    expect(board).toBeDisabled();
    await user.click(board);
    expect(pressed('Grid')).toBe(true);
  });
});
