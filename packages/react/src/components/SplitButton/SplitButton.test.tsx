import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SplitButton } from './SplitButton.js';

function setup(props: { disabled?: boolean } = {}) {
  const onClick = vi.fn();
  const onDuplicate = vi.fn();
  const onArchive = vi.fn();
  render(
    <SplitButton
      onClick={onClick}
      items={[
        { label: 'Duplicate', onClick: onDuplicate },
        { label: 'Archive', onClick: onArchive, disabled: true },
      ]}
      {...props}
    >
      Save
    </SplitButton>,
  );
  return { user: userEvent.setup(), onClick, onDuplicate, onArchive };
}

describe('SplitButton', () => {
  it('runs the primary action without opening the menu', async () => {
    const { user, onClick } = setup();
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens the menu from the named trigger and runs the picked item', async () => {
    const { user, onClick, onDuplicate } = setup();
    const trigger = screen.getByRole('button', { name: 'More actions' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');

    await user.click(trigger);
    expect(await screen.findByRole('menu')).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await user.click(screen.getByRole('menuitem', { name: 'Duplicate' }));
    expect(onDuplicate).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not run a disabled menu item', async () => {
    const { user, onArchive } = setup();
    await user.click(screen.getByRole('button', { name: 'More actions' }));
    const archive = await screen.findByRole('menuitem', { name: 'Archive' });
    expect(archive).toHaveAttribute('aria-disabled', 'true');
    await user.click(archive);
    expect(onArchive).not.toHaveBeenCalled();
  });

  it('closes the menu on Escape and returns focus to the trigger', async () => {
    const { user } = setup();
    const trigger = screen.getByRole('button', { name: 'More actions' });
    await user.click(trigger);
    await screen.findByRole('menu');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('disables both halves', async () => {
    const { user, onClick } = setup({ disabled: true });
    const main = screen.getByRole('button', { name: 'Save' });
    const trigger = screen.getByRole('button', { name: 'More actions' });
    expect(main).toBeDisabled();
    expect(trigger).toBeDisabled();
    await user.click(main);
    await user.click(trigger);
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
