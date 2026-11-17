import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button/Button.js';
import { Dropdown, type DropdownItem } from './Dropdown.js';

function setup(props: Partial<Parameters<typeof Dropdown>[0]> = {}) {
  const onRename = vi.fn();
  const onDelete = vi.fn();
  const items: DropdownItem[] = [
    { label: 'Rename', onClick: onRename },
    { label: 'Delete', onClick: onDelete, disabled: true },
  ];
  render(<Dropdown trigger={<Button>Actions</Button>} items={items} {...props} />);
  return {
    user: userEvent.setup(),
    onRename,
    onDelete,
    trigger: screen.getByRole('button', { name: 'Actions' }),
  };
}

describe('Dropdown', () => {
  it('opens a menu from the trigger and runs the picked item', async () => {
    const { user, onRename, trigger } = setup();
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    await user.click(trigger);
    expect(await screen.findByRole('menu')).toBeInTheDocument();
    await user.click(screen.getByRole('menuitem', { name: 'Rename' }));
    expect(onRename).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('skips a disabled item', async () => {
    const { user, onDelete, trigger } = setup();
    await user.click(trigger);
    const del = await screen.findByRole('menuitem', { name: 'Delete' });
    expect(del).toHaveAttribute('aria-disabled', 'true');
    await user.click(del);
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('opens from the keyboard and closes on Escape with focus back on the trigger', async () => {
    const { user, onRename, trigger } = setup();
    trigger.focus();
    await user.keyboard('{Enter}');
    await screen.findByRole('menu');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(onRename).not.toHaveBeenCalled();
  });

  it('starts open with defaultOpen and reports open changes', async () => {
    const onOpenChange = vi.fn();
    const { user } = setup({ defaultOpen: true, onOpenChange });
    expect(await screen.findByRole('menu')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('follows `open` when controlled', async () => {
    const onOpenChange = vi.fn();
    const { user, trigger } = setup({ open: false, onOpenChange });
    // Keyboard here: in jsdom a pointer click on a controlled-closed Menu doesn't
    // request opening (checked in Chromium: the click does — jsdom quirk).
    trigger.focus();
    await user.keyboard('{Enter}');
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
