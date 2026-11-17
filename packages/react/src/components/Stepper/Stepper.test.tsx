import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Stepper } from './Stepper.js';

describe('Stepper', () => {
  it('has an input named by its label, with named − / + buttons', () => {
    render(<Stepper label="Guests" defaultValue={2} />);
    expect(screen.getByRole('textbox', { name: 'Guests' })).toHaveValue('2');
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Increase' })).toBeInTheDocument();
  });

  it('steps with the buttons and the arrow keys, reporting each value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Stepper label="Guests" defaultValue={2} onValueChange={onValueChange} />);
    const input = screen.getByRole('textbox', { name: 'Guests' });

    await user.click(screen.getByRole('button', { name: 'Increase' }));
    expect(input).toHaveValue('3');
    await user.click(screen.getByRole('button', { name: 'Decrease' }));
    await user.click(screen.getByRole('button', { name: 'Decrease' }));
    expect(input).toHaveValue('1');

    await user.click(input);
    await user.keyboard('{ArrowUp}');
    expect(input).toHaveValue('2');

    expect(onValueChange.mock.calls.map((c) => c[0])).toEqual([3, 2, 1, 2]);
  });

  it('clamps to min / max and disables the button at each end', async () => {
    const user = userEvent.setup();
    render(<Stepper label="Seats" defaultValue={1} min={1} max={2} />);
    const input = screen.getByRole('textbox', { name: 'Seats' });
    const decrease = screen.getByRole('button', { name: 'Decrease' });
    const increase = screen.getByRole('button', { name: 'Increase' });

    expect(decrease).toBeDisabled();
    await user.click(increase);
    expect(input).toHaveValue('2');
    expect(increase).toBeDisabled();
    await user.click(increase);
    expect(input).toHaveValue('2');
  });

  it('does nothing when disabled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Stepper label="Guests" defaultValue={2} disabled onValueChange={onValueChange} />);
    expect(screen.getByRole('textbox', { name: 'Guests' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Increase' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('links the helper, and an error replaces it and marks the input invalid', () => {
    const { rerender } = render(<Stepper label="Guests" helper="Up to 8" />);
    const input = screen.getByRole('textbox', { name: 'Guests' });
    expect(input).toHaveAccessibleDescription('Up to 8');

    rerender(<Stepper label="Guests" helper="Up to 8" errorMessage="Too many guests" />);
    expect(input).toHaveAccessibleDescription('Too many guests');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
