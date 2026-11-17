import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch.js';

describe('Switch', () => {
  it('toggles from the track, the label and Space', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch label="Wi-Fi" onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole('switch', { name: 'Wi-Fi' });
    expect(control).toHaveAttribute('aria-checked', 'false');

    await user.click(control);
    expect(control).toHaveAttribute('aria-checked', 'true');
    await user.click(screen.getByText('Wi-Fi'));
    expect(control).toHaveAttribute('aria-checked', 'false');
    control.focus();
    await user.keyboard(' ');
    expect(control).toHaveAttribute('aria-checked', 'true');

    expect(onCheckedChange.mock.calls.map((c) => c[0])).toEqual([true, false, true]);
  });

  it('is named by aria-label when there is no visible label', () => {
    render(<Switch aria-label="Dark mode" defaultChecked />);
    expect(screen.getByRole('switch', { name: 'Dark mode' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('ignores clicks when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch label="Locked" disabled onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByRole('switch', { name: 'Locked' }));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('links helper text, and an error replaces it and marks the switch invalid', () => {
    const { rerender } = render(<Switch label="2FA" helperText="Recommended" />);
    const control = screen.getByRole('switch', { name: '2FA' });
    expect(control).toHaveAccessibleDescription('Recommended');
    expect(control).not.toHaveAttribute('aria-invalid');

    rerender(<Switch label="2FA" helperText="Recommended" errorMessage="Required" />);
    expect(control).toHaveAccessibleDescription('Required');
    expect(control).toHaveAttribute('aria-invalid', 'true');
  });
});
