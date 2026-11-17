import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox.js';

describe('Checkbox', () => {
  it('toggles from the box, the label and Space', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Accept terms" onCheckedChange={onCheckedChange} />);
    const box = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(box).not.toBeChecked();

    await user.click(box);
    expect(box).toBeChecked();
    await user.click(screen.getByText('Accept terms'));
    expect(box).not.toBeChecked();
    box.focus();
    await user.keyboard(' ');
    expect(box).toBeChecked();

    expect(onCheckedChange.mock.calls.map((c) => c[0])).toEqual([true, false, true]);
  });

  it('stays put when controlled until the parent updates', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <Checkbox aria-label="Opt in" checked={false} onCheckedChange={onCheckedChange} />,
    );
    const box = screen.getByRole('checkbox', { name: 'Opt in' });
    await user.click(box);
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
    expect(box).not.toBeChecked();

    rerender(<Checkbox aria-label="Opt in" checked onCheckedChange={onCheckedChange} />);
    expect(box).toBeChecked();
  });

  it('works as a controlled pair', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [checked, setChecked] = useState(false);
      return <Checkbox label="Notify me" checked={checked} onCheckedChange={setChecked} />;
    }
    render(<Controlled />);
    const box = screen.getByRole('checkbox', { name: 'Notify me' });
    await user.click(box);
    expect(box).toBeChecked();
  });

  it('reports indeterminate as mixed', () => {
    render(<Checkbox aria-label="Select all" indeterminate />);
    expect(screen.getByRole('checkbox', { name: 'Select all' })).toHaveAttribute(
      'aria-checked',
      'mixed',
    );
  });

  it('ignores clicks when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Locked" disabled onCheckedChange={onCheckedChange} />);
    const box = screen.getByRole('checkbox', { name: 'Locked' });
    await user.click(box);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(box).not.toBeChecked();
  });

  it('links helper text, and an error replaces it and marks the box invalid', () => {
    const { rerender } = render(<Checkbox label="Terms" helperText="Required to continue" />);
    const box = screen.getByRole('checkbox', { name: 'Terms' });
    expect(box).toHaveAccessibleDescription('Required to continue');
    expect(box).not.toHaveAttribute('aria-invalid');

    rerender(
      <Checkbox label="Terms" helperText="Required to continue" errorMessage="You must accept" />,
    );
    expect(box).toHaveAccessibleDescription('You must accept');
    expect(box).toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByText('Required to continue')).not.toBeInTheDocument();
  });
});
