import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { type BottomNavItem, BottomNavigation } from './BottomNavigation.js';

const icon = <svg aria-hidden="true" />;

function setup(value = 'home') {
  const onValueChange = vi.fn();
  const onSettings = vi.fn();
  const items: BottomNavItem[] = [
    { value: 'home', label: 'Home', icon },
    { value: 'inbox', label: 'Inbox', icon, dot: true },
    { value: 'profile', label: 'Profile', icon, hideLabel: true },
    { value: 'orders', label: 'Orders', icon, disabled: true },
    { value: 'more', label: 'More', icon, menu: [{ label: 'Settings', onClick: onSettings }] },
  ];
  render(
    <BottomNavigation
      aria-label="Primary"
      items={items}
      value={value}
      onValueChange={onValueChange}
    />,
  );
  return { user: userEvent.setup(), onValueChange, onSettings };
}

describe('BottomNavigation', () => {
  it('is a named nav that marks the current item', () => {
    setup('home');
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Inbox, New activity' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('reports the picked item (it stays controlled)', async () => {
    const { user, onValueChange } = setup('home');
    await user.click(screen.getByRole('button', { name: 'Inbox, New activity' }));
    expect(onValueChange).toHaveBeenCalledWith('inbox');
    expect(screen.getByRole('button', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  });

  it('announces the notification dot after the label', () => {
    setup();
    expect(screen.getByRole('button', { name: 'Inbox, New activity' })).toBeInTheDocument();
  });

  it('keeps a hidden label as the accessible name', () => {
    setup();
    expect(screen.getByRole('button', { name: 'Profile' })).toBeInTheDocument();
  });

  it('does not pick a disabled item', async () => {
    const { user, onValueChange } = setup();
    const orders = screen.getByRole('button', { name: 'Orders' });
    expect(orders).toBeDisabled();
    await user.click(orders);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('opens the More menu instead of picking a value', async () => {
    const { user, onValueChange, onSettings } = setup();
    const more = screen.getByRole('button', { name: 'More' });
    expect(more).toHaveAttribute('aria-haspopup', 'menu');
    await user.click(more);
    await user.click(await screen.findByRole('menuitem', { name: 'Settings' }));
    expect(onSettings).toHaveBeenCalledTimes(1);
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
